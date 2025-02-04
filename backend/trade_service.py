from typing import List, Dict, Optional
from dataclasses import dataclass
from web3 import Web3 # type: ignore
import json
import asyncio

@dataclass
class Order:
    id: int
    trader: str
    amount: float
    min_price: float
    max_price: float
    is_buy_order: bool
    is_active: bool
    order_type: str

class TradeMatchingService:
    def __init__(self, web3_provider: str, contract_addresses: Dict[str, str]):
        self.w3 = Web3(Web3.HTTPProvider(web3_provider))
        self.contract_addresses = contract_addresses
        self.load_contracts()

    def load_contracts(self):
        # Load contract ABIs and create contract instances
        with open('contracts/OrderBook.json') as f:
            order_book_abi = json.load(f)['abi']
        with open('contracts/TradeMatching.json') as f:
            trade_matching_abi = json.load(f)['abi']
            
        self.order_book = self.w3.eth.contract(
            address=self.contract_addresses['order_book'],
            abi=order_book_abi
        )
        self.trade_matcher = self.w3.eth.contract(
            address=self.contract_addresses['trade_matching'],
            abi=trade_matching_abi
        )

    def find_matching_orders(self, buy_order_id: int) -> List[int]:
        """Find all eligible sell orders for a given buy order."""
        buy_order = self._get_order(buy_order_id)
        if not buy_order or not buy_order.is_active or not buy_order.is_buy_order:
            return []

        all_orders = self._get_all_active_orders()
        eligible_sells = []

        for sell_order in all_orders:
            if self._is_eligible_match(buy_order, sell_order):
                eligible_sells.append(sell_order.id)

        return eligible_sells

    def _is_eligible_match(self, buy_order: Order, sell_order: Order) -> bool:
        """Check if two orders are eligible for matching."""
        return (
            sell_order.is_active and
            not sell_order.is_buy_order and
            sell_order.order_type == buy_order.order_type and
            sell_order.amount == buy_order.amount and
            buy_order.max_price >= sell_order.min_price and
            sell_order.max_price >= buy_order.min_price
        )

    def _get_order(self, order_id: int) -> Optional[Order]:
        """Fetch order details from blockchain."""
        try:
            order_data = self.order_book.functions.orders(order_id).call()
            return Order(
                id=order_id,
                trader=order_data[0],
                amount=order_data[1],
                min_price=order_data[2],
                max_price=order_data[3],
                is_buy_order=order_data[6],
                is_active=order_data[7],
                order_type=order_data[8]
            )
        except Exception as e:
            print(f"Error fetching order {order_id}: {e}")
            return None

    def _get_all_active_orders(self) -> List[Order]:
        """Fetch all active orders from blockchain."""
        active_orders = []
        next_order_id = self.order_book.functions.nextOrderId().call()
        
        for order_id in range(1, next_order_id):
            order = self._get_order(order_id)
            if order and order.is_active:
                active_orders.append(order)
                
        return active_orders

    async def initiate_matching(self, buy_order_id: int) -> bool:
        """Initiate the onchain matching process."""
        try:
            eligible_sellers = self.find_matching_orders(buy_order_id)
            if not eligible_sellers:
                return False

            # Request onchain matching with randomness
            tx = self.trade_matcher.functions.requestMatch(
                buy_order_id,
                eligible_sellers
            ).build_transaction({
                'from': self.w3.eth.accounts[0],
                'nonce': self.w3.eth.get_transaction_count(self.w3.eth.accounts[0])
            })
            
            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key='YOUR_PRIVATE_KEY')
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction confirmation
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return tx_receipt.status == 1
            
        except Exception as e:
            print(f"Error initiating match for order {buy_order_id}: {e}")
            return False

class TradeProcessor:
    def __init__(self, matching_service: TradeMatchingService):
        self.matching_service = matching_service

    async def process_buy_order(self, buy_order_id: int):
        """Process a buy order and initiate matching."""
        success = await self.matching_service.initiate_matching(buy_order_id)
        if success:
            print(f"Successfully initiated matching for buy order {buy_order_id}")
        else:
            print(f"Failed to initiate matching for buy order {buy_order_id}")
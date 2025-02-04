// src/contract.js
import CarbonCreditABI from './contracts/CarbonCredit.json';
import CarbonMarketplaceABI from './contracts/CarbonMarketplace.json';
import OrderBookABI from './contracts/OrderBook.json';
import TradeMatchingABI from './contracts/TradeMatching.json';
import CarbonTradingABI from './contracts/CarbonTrading.json';
import Web3 from 'web3';

const contractAddresses = {
  CarbonCredit: "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47",
  CarbonMarketplace: "0xYourMarketplaceContractAddress",
  OrderBook: "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53",
  TradeMatching: "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3",
  CarbonTrading: "0xYourMarketplaceContractAddress"
};
function getWeb3(){
const web3 = new Web3(process.env.REACT_APP_CHAIN_LINK);
return web3;
}
export const loadContracts = async () => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  
  const CarbonCredit = new web3.eth.Contract(
    CarbonCreditABI.abi,
    contractAddresses.CarbonCredit
  );

  const CarbonCreditMarketplace = new web3.eth.Contract(
    CarbonMarketplaceABI.abi,
    contractAddresses.CarbonMarketplace
  );

  const OrderBook = new web3.eth.Contract(
    OrderBookABI.abi,
    contractAddresses.OrderBook
  );

  const TradeMatching= new web3.eth.Contract(
    TradeMatchingABI.abi,
    contractAddresses.TradeMatching
  );

  const CarbonTrading = new web3.eth.Contract(
    CarbonTradingABI.abi,
    contractAddresses.CarbonTrading
  );

  return { web3, accounts, CarbonCredit, CarbonMarketplaceABI,OrderBook,TradeMatching,CarbonTrading };
};
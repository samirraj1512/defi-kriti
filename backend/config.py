from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Config:
    # Blockchain Configuration
    WEB3_PROVIDER_URI = os.getenv('WEB3_PROVIDER_URI')
    CHAIN_ID = int(os.getenv('CHAIN_ID', 5))
    NETWORK_NAME = os.getenv('NETWORK_NAME', 'goerli')

    # Contract Addresses
    CONTRACT_ADDRESSES = {
        'order_book': os.getenv('ORDER_BOOK_ADDRESS'),
        'trade_matching': os.getenv('TRADE_MATCHING_ADDRESS'),
        'carbon_credit': os.getenv('CARBON_CREDIT_ADDRESS')
    }

    # Wallet Configuration
    PRIVATE_KEY = os.getenv('PRIVATE_KEY')
    WALLET_ADDRESS = os.getenv('WALLET_ADDRESS')

    # Chainlink VRF Configuration
    VRF_CONFIG = {
        'coordinator': os.getenv('VRF_COORDINATOR_ADDRESS'),
        'link_token': os.getenv('LINK_TOKEN_ADDRESS'),
        'key_hash': os.getenv('KEY_HASH'),
        'fee': int(os.getenv('VRF_FEE', 100000000000000000))
    }

    # Server Configuration
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('NODE_ENV') == 'development'

    @staticmethod
    def validate():
        """Validate required environment variables are set"""
        required_vars = [
            'WEB3_PROVIDER_URI',
            'ORDER_BOOK_ADDRESS',
            'TRADE_MATCHING_ADDRESS',
            'PRIVATE_KEY'
        ]
        
        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Validate configuration on import
Config.validate()
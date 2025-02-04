import axios from 'axios';

class GasEstimatorService {
    constructor() {
        this.tatumUrl = "https://api.tatum.io/v4/blockchainOperations/gas";
        this.blocknativeUrl = "https://api.blocknative.com/gasprices/blockprices";
        this.apiKey = process.env.REACT_APP_TATUM_API_KEY;
        this.blocknativeKey = process.env.REACT_APP_BLOCKNATIVE_API_KEY;
    }

    async getGasPrice(chain = "ethereum") {
        try {
            // Get estimates from both services for redundancy
            const [tatumResponse, blocknativeResponse] = await Promise.all([
                this.getTatumGasPrice(chain),
                this.getBlocknativeGasPrice()
            ]);

            // Use Blocknative as primary, fallback to Tatum
            return blocknativeResponse || tatumResponse;
        } catch (error) {
            console.error('Error fetching gas prices:', error);
            throw error;
        }
    }

    async getTatumGasPrice(chain) {
        try {
            const response = await axios.post(this.tatumUrl, 
                { chain: chain.toUpperCase() },
                {
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'x-api-key': this.apiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Tatum gas estimation error:', error);
            return null;
        }
    }

    async getBlocknativeGasPrice() {
        try {
            const response = await axios.get(this.blocknativeUrl, {
                headers: {
                    'Authorization': this.blocknativeKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Blocknative gas estimation error:', error);
            return null;
        }
    }
}

export default GasEstimatorService;
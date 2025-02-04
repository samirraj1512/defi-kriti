import { Web3 } from "web3"

class Web3Handler {
    web3 = new Web3(process.env.REACT_APP_CHAIN_LINK)
    getDefaultAccount = async () => {
        const accounts = await this.web3.eth.getAccounts();
        const defaultAccount = accounts[0];
        return defaultAccount
    }
    interact = (contractAddress, abi, defaultAccount, callback) => {
        const myContract = new this.web3.eth.Contract(abi, contractAddress);
        myContract.handleRevert = true;
        callback(myContract, defaultAccount)
    }
}



export default Web3Handler;
import { Contract } from '@ethersproject/contracts';
import { VRF_COORDINATOR_ABI } from '../contracts/abis';

class VRFService {
    constructor(provider) {
        // Latest Chainlink VRF Coordinator address for Ethereum mainnet
        this.coordinatorAddress = '0x271682DEB8C4E0901D1a1550aD2e64D568E69909';
        this.provider = provider;
        this.contract = new Contract(
            this.coordinatorAddress,
            VRF_COORDINATOR_ABI,
            provider
        );
    }

    async requestRandomness(keyHash, fee, seed) {
        try {
            const tx = await this.contract.requestRandomness(keyHash, fee, seed);
            return await tx.wait();
        } catch (error) {
            console.error('VRF request error:', error);
            throw error;
        }
    }

    async getRandomnessRequestStatus(requestId) {
        try {
            return await this.contract.getRequestStatus(requestId);
        } catch (error) {
            console.error('VRF status check error:', error);
            throw error;
        }
    }
}

export default VRFService;

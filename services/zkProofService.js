import { buildPoseidonWasm } from 'circomlibjs';

class ZKProofService {
    constructor() {
        this.initialized = false;
        this.poseidon = null;
    }

    async initialize() {
        if (!this.initialized) {
            this.poseidon = await buildPoseidonWasm();
            this.initialized = true;
        }
    }

    async generateEnergyTradeProof(params) {
        // Ensure Poseidon is initialized
        await this.initialize();
        
        const { amount, minPrice, maxPrice } = params;
        
        try {
            // Generate a random salt for privacy
            const salt = Math.floor(Math.random() * 1000000).toString();
            
            // Combine values for Poseidon hashing
            const values = [
                BigInt(amount), 
                BigInt(minPrice), 
                BigInt(maxPrice), 
                BigInt(salt)
            ];
            
            // Generate commitment using Poseidon hash
            const commitment = this.generateCommitment(values);
            
            // Generate nullifier
            const nullifier = this.generateNullifier(commitment);
            
            return {
                commitment,
                nullifier,
                salt,
                values: {
                    amount,
                    minPrice,
                    maxPrice
                }
            };
        } catch (error) {
            console.error('Error generating energy trade proof:', error);
            throw error;
        }
    }

    async generateCarbonTradeProof(params) {
        // Ensure Poseidon is initialized
        await this.initialize();
        
        const { amount, minPrice, maxPrice } = params;
        
        try {
            const salt = Math.floor(Math.random() * 1000000).toString();
            const values = [
                BigInt(amount), 
                BigInt(minPrice), 
                BigInt(maxPrice), 
                BigInt(salt)
            ];
            
            const commitment = this.generateCommitment(values);
            const nullifier = this.generateNullifier(commitment);
            
            return {
                commitment,
                nullifier,
                salt,
                values: {
                    amount,
                    minPrice,
                    maxPrice
                }
            };
        } catch (error) {
            console.error('Error generating carbon trade proof:', error);
            throw error;
        }
    }

    generateCommitment(values) {
        try {
            // Use Poseidon hash with the values
            if (!this.poseidon) {
                throw new Error('Poseidon not initialized');
            }
            
            const commitment = this.poseidon.hash(values);
            
            // Convert to hex string for consistency
            return BigInt(commitment).toString(16);
        } catch (error) {
            console.error('Error generating commitment:', error);
            throw error;
        }
    }

    generateNullifier(commitment) {
        try {
            if (!this.poseidon) {
                throw new Error('Poseidon not initialized');
            }
            
            // Create nullifier by hashing the commitment with a nonce
            const nullifier = this.poseidon.hash([
                BigInt(commitment), 
                BigInt(1) // Nonce
            ]);
            
            // Convert to hex string
            return BigInt(nullifier).toString(16);
        } catch (error) {
            console.error('Error generating nullifier:', error);
            throw error;
        }
    }

    async verifyProof(proof, publicInputs) {
        // Ensure Poseidon is initialized
        await this.initialize();
        
        try {
            // Reconstruct commitment from public inputs
            const reconstructedCommitment = this.generateCommitment([
                BigInt(publicInputs.amount),
                BigInt(publicInputs.minPrice),
                BigInt(publicInputs.maxPrice),
                BigInt(proof.salt)
            ]);
            
            return reconstructedCommitment === proof.commitment;
        } catch (error) {
            console.error('Error verifying proof:', error);
            throw error;
        }
    }
}

export default ZKProofService;
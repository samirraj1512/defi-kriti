import { buildPoseidon } from 'circomlibjs';

class PoseidonService {
    constructor() {
        this.poseidon = null;
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            // Using latest circomlib version for Poseidon
            this.poseidon = await buildPoseidon();
            this.initialized = true;
        }
    }

    async hash(inputs) {
        await this.initialize();
        return this.poseidon.hash(inputs);
    }

    async multiHash(inputArrays) {
        await this.initialize();
        return Promise.all(inputArrays.map(inputs => this.hash(inputs)));
    }
}

export default PoseidonService;
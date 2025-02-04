pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";

template EnergyTrade() {
    // Private inputs
    signal input amount;
    signal input minPrice;
    signal input maxPrice;
    signal input salt;
    
    // Public inputs
    signal input commitment;
    
    // Output
    signal output valid;

    // Calculate commitment using Poseidon hash
    component commitmentHasher = Poseidon(4);
    commitmentHasher.inputs[0] <== amount;
    commitmentHasher.inputs[1] <== minPrice;
    commitmentHasher.inputs[2] <== maxPrice;
    commitmentHasher.inputs[3] <== salt;

    // Verify the commitment
    commitment === commitmentHasher.out;
    
    // Check price range
    signal priceValid;
    priceValid <== maxPrice >= minPrice;
    
    // Check valid amount
    signal amountValid;
    amountValid <== amount > 0;
    
    // Final validation
    valid <== priceValid * amountValid;
}

component main { public [commitment] } = EnergyTrade();
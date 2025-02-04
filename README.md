CarbonCredit Marketplace

Overview

The CarbonCredit Marketplace is a decentralized energy trading platform where dealers and consumers can buy and sell renewable energy using ERC20-based CarbonCredits. The platform leverages IoT (Internet of Things) for energy measurement, zk-SNARKs with Poseidon Hash for validation, and on-chain randomness (VRF) for fair seller selection.

Key Features

1. Registration and Authentication

Users sign up or log in using MetaMask.

If already registered, users are redirected to their respective dashboard.

New users must register as either a Dealer or Consumer before proceeding.

2. Energy and Carbon Credit Trading Mechanism

a. Dealers:

Can sell Energy or CarbonCredits.

When selling Energy, they must specify:

Minimum Price

Maximum Price

Quantity of energy available for sale.

When selling CarbonCredits, they must specify:

Quantity of credits required.

b. Consumers:

Can place a buy order for Energy by specifying:

Minimum Price

Maximum Price

Quantity required.

3. Carbon Credit Minting & Deduction

Energy generation and transfer are monitored through IoT devices.

Based on renewable energy generation, CarbonCredits are minted into a dealer's account.

When selling energy, the equivalent CarbonCredits are deducted from the dealer’s account.

4. Verification Using zk-SNARKs (Poseidon Hash)

Ensures that:

The Dealer has the required energy or CarbonCredits to sell.

The Consumer does not make entry exceeding the maximum energy limit they can purchase.

5. Order Matching and Execution

For each buy order, all eligible sellers (who match the price range and energy quantity criteria) are identified.

The system employs on-chain randomness (VRF) to fairly select one seller.

The transaction is then committed on-chain.

6. Transaction Execution

The final transaction price is determined as the average of the overlapping price range.

The platform ensures the secure transfer of energy and payment.

Gas fee estimator is used to optimize transaction costs.

Notifications are sent to both parties regarding transaction completion.

Technologies Used

Ethereum Smart Contracts (ERC20 for CarbonCredits)

IoT-based Energy Monitoring

zk-SNARKs (Poseidon Hash) for verification

Chainlink VRF for fair seller selection

Gas Fee Estimator for transaction cost optimization

MetaMask Integration for authentication

Conclusion

The CarbonCredit Marketplace facilitates a transparent and decentralized energy trading ecosystem by leveraging blockchain, IoT, and zero-knowledge proofs. It ensures fair trading, enhances renewable energy adoption, and promotes sustainability through CarbonCredits.
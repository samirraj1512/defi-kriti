import { ethers } from 'ethers';
import MarketplaceABI from '../contracts/CarbonMarketplace.json';
import { CONFIG } from '../config';

class MarketplaceService {
    constructor(provider) {
        this.provider = provider;
        this.marketplaceAddress = CONFIG.CONTRACT_ADDRESSES.carbon_marketplace;
        this.contract = new ethers.Contract(
            this.marketplaceAddress,
            MarketplaceABI,
            provider
        );
    }

    async getListings(startIndex = 0, count = 10) {
        try {
            const listingCount = await this.contract.listingCount();
            const listings = [];
            
            const endIndex = Math.min(startIndex + count, listingCount.toNumber());
            
            for (let i = startIndex + 1; i <= endIndex; i++) {
                const listing = await this.contract.getActiveListing(i);
                if (listing.isActive) {
                    listings.push({
                        id: i,
                        seller: listing.seller,
                        amount: ethers.utils.formatEther(listing.amount),
                        pricePerCredit: ethers.utils.formatEther(listing.pricePerCredit),
                        timestamp: listing.timestamp.toNumber()
                    });
                }
            }
            
            return listings;
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    }

    async createListing(amount, pricePerCredit, commitment) {
        try {
            const signer = this.provider.getSigner();
            const marketplaceWithSigner = this.contract.connect(signer);
            
            const tx = await marketplaceWithSigner.createListing(
                ethers.utils.parseEther(amount.toString()),
                ethers.utils.parseEther(pricePerCredit.toString()),
                commitment
            );
            
            return await tx.wait();
        } catch (error) {
            console.error('Error creating listing:', error);
            throw error;
        }
    }

    async purchaseCredits(listingId, amount) {
        try {
            const signer = this.provider.getSigner();
            const marketplaceWithSigner = this.contract.connect(signer);
            
            const listing = await this.contract.getActiveListing(listingId);
            const totalPrice = listing.pricePerCredit.mul(
                ethers.utils.parseEther(amount.toString())
            );
            
            const tx = await marketplaceWithSigner.purchaseCredits(
                listingId,
                ethers.utils.parseEther(amount.toString()),
                { value: totalPrice }
            );
            
            return await tx.wait();
        } catch (error) {
            console.error('Error purchasing credits:', error);
            throw error;
        }
    }

    async getUserListings(userAddress) {
        try {
            const listingIds = await this.contract.getUserListings(userAddress);
            const listings = [];
            
            for (const id of listingIds) {
                const listing = await this.contract.getActiveListing(id);
                if (listing.isActive) {
                    listings.push({
                        id: id.toNumber(),
                        seller: listing.seller,
                        amount: ethers.utils.formatEther(listing.amount),
                        pricePerCredit: ethers.utils.formatEther(listing.pricePerCredit),
                        timestamp: listing.timestamp.toNumber()
                    });
                }
            }
            
            return listings;
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        }
    }

    async cancelListing(listingId) {
        try {
            const signer = this.provider.getSigner();
            const marketplaceWithSigner = this.contract.connect(signer);
            
            const tx = await marketplaceWithSigner.cancelListing(listingId);
            return await tx.wait();
        } catch (error) {
            console.error('Error cancelling listing:', error);
            throw error;
        }
    }
}

export default MarketplaceService;
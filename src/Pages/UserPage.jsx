import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { RedirectToSignIn } from '@clerk/clerk-react';
import Web3 from 'web3';
import OrderBook from '../contracts/OrderBook.json';
const TransactionHistory = () => {
    const transactions = [
        "Transaction 1: Qty. 1, Price $10",
        "Transaction 2: Qty. 2, Price $20",
        "Transaction 3: Qty. 3, Price $30",
        "Transaction 4: Qty. 4, Price $40",
        "Transaction 5: Qty. 5, Price $50",
        "Transaction 6: Qty. 6, Price $60",
        "Transaction 7: Qty. 7, Price $70",
        "Transaction 8: Qty. 8, Price $80",
        "Transaction 9: Qty. 9, Price $90",
        "Transaction 10: Qty. 10, Price $100"
      ];
      

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-[400px] h-[450px] flex flex-col">
      <div className="text-xl font-semibold mb-4 text-center">
        Transaction History
      </div>
      <div className="overflow-y-auto flex-1">
        {transactions.map((tx, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            {tx}
          </div>
        ))}
      </div>
    </div>
  );
};

const UserPage = () => {
  const { user } = useUser();
  // console.log(user?.primaryWeb3Wallet.web3Wallet);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [qty, setQty] = useState('');


async function interact() {
  if (!window.ethereum) {
    console.error("No Ethereum wallet detected!");
    return;
  }
  try {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // Use MetaMask or injected wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
      web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_CHAIN_LINK)); // Fallback for read-only operations
  }
  const deployedAddress = process.env.REACT_APP_ORDER_BOOK_ADDRESS
const myContract = new web3.eth.Contract(OrderBook , deployedAddress);
myContract.handleRevert = true;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const salt = Web3.utils.padLeft(user?.primaryWeb3Wallet.web3Wallet, 64);
    const nullBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const receipt = await myContract.methods.createOrder(qty, minPrice, maxPrice, salt, nullBytes32, true, 0).send({
      from: accounts[0]
   });   
    console.log(receipt);
  } catch (error) {
    console.log(error)
  }
}

  // State hooks for the inputs


  if (!user) return <RedirectToSignIn to="/" />;
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
   interact();
  };

  return (
    <div>
        <div>

        <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              
            </SignInButton>
          </SignedOut>
        </div>
    <div className="min-h-screen flex justify-center items-center gap-10 bg-gradient-to-br from-gray-100 to-blue-100 p-5">
      {/* Transaction History displayed first */}
      <TransactionHistory />

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-[400px] h-[450px] flex flex-col justify-center"
      >
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="minPrice">
            Minimum Price
          </label>
          <input
          required
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Enter minimum price"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="maxPrice">
            Maximum Price
          </label>
          <input
          required
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Enter maximum price"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="qty">
            Quantity
          </label>
          <input
          required
            type="number"
            id="qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default UserPage;

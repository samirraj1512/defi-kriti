import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { RedirectToSignIn } from '@clerk/clerk-react';
import { CarbonCredit,CarbonMarketplace,TradeMatching,OrderBook,CarbonTrading} from "../contract"

const SellerPage = () => {
    const { user } = useUser();
    
    // Declare all hooks unconditionally
    const [activeTab, setActiveTab] = useState('energy');
    const [energyMinPrice, setEnergyMinPrice] = useState('');
    const [energyMaxPrice, setEnergyMaxPrice] = useState('');
    const [energyQty, setEnergyQty] = useState('');
    const [carbonAction, setCarbonAction] = useState('Buy');
    const [carbonQty, setCarbonQty] = useState('');
  
    // Now perform the conditional check
    if (!user) return <RedirectToSignIn to="/" />;
    
    // ...rest of your component
  

  // Hardcoded balances (could come from props or an API)
  const energyBalance = 1000; // e.g. in kWh
  const carbonBalance = 500;  // e.g. in credits

  // Hardcoded transaction histories
  const energyTransactions = [
    "Energy Transaction 1: Qty. 10, Price $5",
    "Energy Transaction 2: Qty. 20, Price $4.8",
    "Energy Transaction 3: Qty. 15, Price $5.1",
    "Energy Transaction 4: Qty. 12, Price $5.0",
    "Energy Transaction 5: Qty. 18, Price $4.9",
    "Energy Transaction 6: Qty. 25, Price $5.2",
    "Energy Transaction 7: Qty. 10, Price $5.0",
    "Energy Transaction 8: Qty. 30, Price $5.3",
    "Energy Transaction 9: Qty. 22, Price $4.7",
    "Energy Transaction 10: Qty. 16, Price $5.0"
  ];

  const carbonTransactions = [
    "Carbon Transaction 1: Qty. 5, Action: Buy",
    "Carbon Transaction 2: Qty. 3, Action: Sell",
    "Carbon Transaction 3: Qty. 7, Action: Buy",
    "Carbon Transaction 4: Qty. 2, Action: Sell",
    "Carbon Transaction 5: Qty. 4, Action: Buy",
    "Carbon Transaction 6: Qty. 6, Action: Sell",
    "Carbon Transaction 7: Qty. 5, Action: Buy",
    "Carbon Transaction 8: Qty. 3, Action: Sell",
    "Carbon Transaction 9: Qty. 8, Action: Buy",
    "Carbon Transaction 10: Qty. 2, Action: Sell"
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'energy') {
      console.log("Energy Sell Order:");
      console.log("Minimum Price:", energyMinPrice);
      console.log("Maximum Price:", energyMaxPrice);
      console.log("Quantity:", energyQty);
    } else {
      console.log("Carbon Credits Order:");
      console.log("Action:", carbonAction);
      console.log("Quantity:", carbonQty);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-blue-100 p-5">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'energy'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
          onClick={() => setActiveTab('energy')}
        >
          Energy
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'carbon'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
          onClick={() => setActiveTab('carbon')}
        >
          Carbon Credits
        </button>
      </div>
      
      <div className="flex gap-10">
        {/* Transactions & Balances Panel */}
        <div className="bg-white p-5 rounded-lg shadow-md w-[400px] h-[450px] flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-center">Balances</h2>
            <div className="flex justify-around mt-2">
              <div className="text-center">
                <p className="text-sm text-gray-600">Energy</p>
                <p className="font-bold">{energyBalance} kWh</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Carbon Credits</p>
                <p className="font-bold">{carbonBalance} credits</p>
              </div>
            </div>
          </div>
          <div className="text-lg font-semibold text-center mb-3">
            {activeTab === 'energy' ? 'Energy Transactions' : 'Carbon Credit Transactions'}
          </div>
          <div className="overflow-y-auto flex-1">
            {activeTab === 'energy'
              ? energyTransactions.map((tx, index) => (
                  <div key={index} className="p-2 border-b border-gray-200">
                    {tx}
                  </div>
                ))
              : carbonTransactions.map((tx, index) => (
                  <div key={index} className="p-2 border-b border-gray-200">
                    {tx}
                  </div>
                ))
            }
          </div>
        </div>

        {/* Form Panel */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-lg shadow-md w-[400px] h-[450px] flex flex-col justify-center"
        >
          {activeTab === 'energy' ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">Sell Energy</h2>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="minPrice">
                  Minimum Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={energyMinPrice}
                  onChange={(e) => setEnergyMinPrice(e.target.value)}
                  placeholder="Enter minimum price"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="maxPrice">
                  Maximum Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={energyMaxPrice}
                  onChange={(e) => setEnergyMaxPrice(e.target.value)}
                  placeholder="Enter maximum price"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="energyQty">
                  Quantity
                </label>
                <input
                  type="number"
                  id="energyQty"
                  value={energyQty}
                  onChange={(e) => setEnergyQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">Carbon Credits</h2>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2">
                  Action
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCarbonAction('Buy')}
                    className={`px-4 py-2 rounded ${
                      carbonAction === 'Buy'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-600'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarbonAction('Sell')}
                    className={`px-4 py-2 rounded ${
                      carbonAction === 'Sell'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-600'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="carbonQty">
                  Quantity
                </label>
                <input
                  type="number"
                  id="carbonQty"
                  value={carbonQty}
                  onChange={(e) => setCarbonQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </>
          )}
          <button onClick="" type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerPage;

import React from 'react';
import LoginPage from './Pages/LoginPage';
import UserPage from './Pages/UserPage';
import SellerPage from './Pages/SellerPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import OrderBook from './contracts/OrderBook.json';
const web3 = new Web3(process.env.REACT_APP_CHAIN_LINK);
const deployedAddress = process.env.ORDER_BOOK_ADDRESS
const myContract = new web3.eth.Contract(OrderBook , deployedAddress);
myContract.handleRevert = true;

async function interact() {
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];
  try {
    const myNumber = await myContract.methods.myNumber().call();
    console.log("myNumber value:", +myNumber);
    const reciept = await myContract.methods.setMyNumber(myNumber + 1n).send({
      from:defaultAccount,

    })
  } catch (error) {
    
  }
}
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/seller" element={<SellerPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

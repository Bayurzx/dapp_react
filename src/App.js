import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import BigNumber from 'bignumber.js';

import './components/app.css';
import Navigate from './components/Navigate'
import AddItems from './components/AddItems';

import animeBallotAbi from './contracts/animeBallot.abi.json';
import erc20Abi from './contracts/erc20.abi.json';
const ERC20_DECIMALS = 18;
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
const AnimeContractAddress = "0xFF0650fD542eA0Dc1dd6Bd73444E5eFbBb736dD5"

const cost = 2; // this is the cost to donate

function App() {
  const [kit, setKit] = useState(null);
  const [address, setAddress] = useState('0x0')
  const [contract, setContract] = useState(null)
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    loadWeb3()
  }, [address])
  
  useEffect(() => {
    if (!kit) return ; // useeffect run first before checking dependecy, this ensure that it doesn't run before
    loadCeloContract()
  }, [kit])

  async function getCusd() {
    const celoBalance = await kit.getTotalBalance(kit.defaultAccount);
    const cusdBalance = celoBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    setBalance(cusdBalance);
  }

  async function donateToLike(animeName) {
    setLoading(true);

    const amount = new BigNumber(cost).shiftedBy(ERC20_DECIMALS).toString();

    const cusdContract = await new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

    cusdContract.methods.approve(cUSDContractAddress, amount)
      .send({ from: kit.defaultAccount })
      .on('transactionHash', hash => {
        // decentralBank transaction goes here
        animeBallotAbi.methods.voting(animeName)
          .send({ from: kit.defaultAccount })
          .on('transactionHash', hash => {
            // What you want it to do after voting
            setLoading(false);
          }).on('transactionHash', () => window.location.reload())

      });

  }

  async function createAnimeList(arr = [[]]) {
    let createListReply = await contract.methods.createAnimeList(arr)
    console.log(createListReply);

  }

  async function getAllAnime() {
    let allAnime = await contract.methods.createAnimeList()
    return allAnime;
  }

  async function loadWeb3() {
    if (window.celo) {
      try {
        // enable celo interaction
        window.web3 = new Web3(window.celo);
        await window.celo.enable();
        let celoKit = newKitFromWeb3(window.web3);
        await setKit(celoKit);
        await getCusd()

        console.log(kit);

      }
      catch (error) {
        console.error(error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      alert("Get the celo browser extension from chrome extensions")
    }
  }

  async function loadCeloContract() {
    let address_ = await kit.web3.eth.getAccounts();

    console.log(address_);
    // get and set default address
    kit.defaultAccount = address_[0];
    await setAddress(address_[0]);


    // sign and set contract
    const myContract = new kit.web3.eth.Contract(animeBallotAbi, AnimeContractAddress);
    await setContract(myContract);

  }

  return (
    <div className="App">
      <Navigate account={[address, balance]} />

      <AddItems createAnimeList={createAnimeList} />

    </div>
  );
}

export default App;

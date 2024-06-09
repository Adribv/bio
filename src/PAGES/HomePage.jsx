import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { abi } from '../abi';
import Web3 from 'web3';
import gif from '../ASSETS/loader.gif';
import trees from '../ASSETS/Trees.mp4';
const HomePage = ({ contract, setUser }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

 /* const handleLogin = async () => {
    setLoader(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        let accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setUser(accounts[0]);
        const web3 = new Web3(window.ethereum);
        const Instance = new web3.eth.Contract(abi, contract);
        const isUser = await Instance.methods.registeredUsers(accounts[0]).call();
        if (isUser) {
          localStorage.setItem('BioHeritageHub', JSON.stringify({ address: accounts[0] }));
          navigate('/dashboard');
        } else {
          localStorage.removeItem('BioHeritageHub');
          alert('Please register first to login!!!');
        }
      } catch (error) {
        if (error.code === 4001) {
          alert('Enabling Metamask is REQUIRED');
        } else {
          alert('Check whether you have installed METAMASK or may have NETWORK issues');
        }
      } finally {
        setLoader(false);
      }
    } else {
      alert('Please Install Metamask to use this Application');
    }
  };*/

  const handleRegister = async () => {
    setLoader(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        let accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setUser(accounts[0]);
        const web3 = new Web3(window.ethereum);
        const Instance = new web3.eth.Contract(abi, contract);
        const isUser = await Instance.methods.registeredUsers(accounts[0]).call();
        if (isUser) {
          localStorage.setItem('BioHeritageHub', JSON.stringify({ address: accounts[0] }));
          navigate('/dashboard');
        } else {
          await Instance.methods.register().send({ from: accounts[0] });
          localStorage.setItem('BioHeritageHub', JSON.stringify({ address: accounts[0] }));
          navigate('/dashboard');
        }
      } catch (error) {
        if (error.code === 4001) {
          alert('Enabling Metamask is REQUIRED');
        } else {
          alert('Check whether you have installed METAMASK or may have NETWORK issues');
        }
      } finally {
        setLoader(false);
      }
    } else {
      alert('Please Install Metamask to use this Application');
    }
  };
  const width = window.outerWidth
  const height = window.outerHeight

  return (
    <div>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',zIndex:100,position:'absolute',textAlign:'center',width:'100%',height:'100%',justifyContent:'center'}}>
    <h1 style={{marginBottom:'-5px',color:'#ffff',fontSize:'90px'}}>BIO HERITAGE</h1>
    <p style={{color:'#fff'}}>AN DECENTRALIZED PLATFORM FOR ENVIRONMENT ENGAGEMENT</p>
    <Connectbtn onClick={handleRegister} >Connect to Wallet</Connectbtn>
    </div>
    <video autoPlay loop muted style={{width:'100%',height:'100%',objectFit:'cover',position:'fixed'}} >
      <source  src={trees} type="video/mp4"  />

      
    </video>
    </div>
   /* <div style={{backgroundColor:'#52796F',width:'210.5vh',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',color :'#fff'}}>
        {loader && <Loader src={gif} alt="loading..." />}
        <div style={{textAlign:'center'}}>
          <h1 style={{marginBottom:'-5px'}}>BIO HERITAGE</h1>
          <p>AN DECENTRALIZED PLATFORM FOR ENVIRONMENT ENGAGEMENT</p>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>
          <Connectbtn  onClick={handleRegister}>Connect to Wallet</Connectbtn>
        </div>
        </div>
        
      </div> */
  );
};

const Connectbtn = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;

  &:hover {
  background-color: black;
  }

`
/*
const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #357266, #c8e6c9);
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #388e3c;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #4caf50;
  margin-bottom: 2rem;
  max-width: 30rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &
  {
  background-color: #1b5e20;
  }
  `;
*/
  const Loader = styled.img` position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; `;

  export default HomePage;
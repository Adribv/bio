import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import { useNavigate } from 'react-router-dom';
import Menu from '../COMPONENTS/Menu';
import gif from '../ASSETS/loader.gif';

const SellPage = ({ contract, user }) => {
  const [productName, setProductName] = useState('');
  const [priceInTokens, setPriceInTokens] = useState('');
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleSell = async (event) => {
    setLoader(true);
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(abi, contract);
      await instance.methods.listProduct(productName, priceInTokens).send({ from: user });
      setLoader(false);
      navigate('/market');
    } catch (error) {
      setLoader(false);
      alert(error.message);
    }
  };

  return (
    <SellContainer>
      {loader && <Loader src={gif} alt="Loading..." />}
      <h2>Sell Product</h2>
      <MenuContainer>
        <Menu contract={contract} user={user} />
      </MenuContainer>
      <SellForm onSubmit={handleSell}>
        <InputLabel htmlFor="productName">Product Name:</InputLabel>
        <Input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <InputLabel htmlFor="priceInTokens">Price in Tokens:</InputLabel>
        <Input
          type="number"
          id="priceInTokens"
          value={priceInTokens}
          onChange={(e) => setPriceInTokens(e.target.value)}
        />
        <SellButton type="submit">Sell</SellButton>
      </SellForm>
    </SellContainer>
  );
};

const Loader = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`;

const SellContainer = styled.div`
  padding: 20px;
  background-color: #357266;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative; /* Ensure proper positioning of loader */
`;

const SellForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 300px;
`;

const InputLabel = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const SellButton = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #1b5e20;
  }
`;

export default SellPage;

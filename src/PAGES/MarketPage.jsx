import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import Menu from '../COMPONENTS/Menu';
import gif from '../ASSETS/loader.gif';

const MarketPage = ({ contract, user, setUser }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userTokens, setUserTokens] = useState(0);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchUserTokens();
  }, []);

  const fetchUserTokens = async () => {
    try {
      setLoader(true);
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(abi, contract);
      const tokenCount = await instance.methods.balanceOf(user).call();
      setUserTokens(Number(tokenCount));
      setLoader(false);
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      setLoader(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoader(true);
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(abi, contract);
      const productCount = await instance.methods.productCount().call();

      const productsArray = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await instance.methods.marketplace(i).call();
        product.id = i;
        productsArray.push(product);
      }

      setProducts(productsArray);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoader(false);
    }
  };

  const handleBuyProduct = async (productId, priceInTokens, index) => {
    try {
      setLoader(true);
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(abi, contract);

      if (userTokens >= priceInTokens) {
        await instance.methods.buyProduct(productId).send({ from: user });
        alert('Product bought successfully!');
        fetchUserTokens();
        const updatedProducts = [...products];
        updatedProducts[index].sold = true;
        setProducts(updatedProducts);
      } else {
        alert('Insufficient tokens');
      }
    } catch (error) {
      console.error('Error buying product:', error);
      alert('Failed to buy product');
    } finally {
      setLoader(false);
    }
  };

  return (
    <MarketContainer>
      <MenuContainer>
        <button onClick={() => navigate('/sell')}>Sell</button>
        <div className="menu">
          <Menu contract={contract} user={user} />
        </div>
      </MenuContainer>
      {loader ? (
        <Loader src={gif} alt="Loading..." />
      ) : (
        <ProductGrid>
          {products.map((product, index) => (
            <ProductCard key={index} sold={product.sold}>
              <h3>{product.name}</h3>
              <p>Price: {Number(product.priceInTokens)} Tokens</p>
              <button
                onClick={() => handleBuyProduct(product.id, Number(product.priceInTokens), index)}
                disabled={product.sold}
              >
                {product.sold ? 'Sold' : 'Buy'}
              </button>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </MarketContainer>
  );
};

const MarketContainer = styled.div`
  padding: 20px;
  position: relative; /* Ensure relative positioning for the loader */
  background-color: #357266;
`;

const MenuContainer = styled.div`
  position: absolute;
  margin-top: 4rem;
  top: 0rem;
  right: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-bottom: 20px;
  button {
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #1b5e20;
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  margin-top: 120px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;
const Loader = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ProductCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin-bottom: 10px;
    color: #2e7d32;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 10px;
    color: #555;
  }

  button {
    background-color: ${(props) => (props.sold ? '#bdbdbd' : '#2e7d32')};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: ${(props) => (props.sold ? 'not-allowed' : 'pointer')};
    transition: background-color 0.3s ease;
    font-size: 1rem;

    &:hover {
      background-color: ${(props) => (props.sold ?'#bdbdbd' : '#1b5e20')};
}
}
`;

export default MarketPage;
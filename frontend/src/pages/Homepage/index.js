import React, { useState, useEffect } from 'react';
import { CountDown } from 'components/CountDown';
import { Token } from 'components/Token';
import { TokenStatus } from 'components/TokenStatus';
import { Wallet } from 'components/Wallet';
import { BuyToken } from 'components/BuyToken';
import { useHistory } from 'react-router-dom';
import metamasxImg from '../../assets/img/metamasx.png';
import walletConnectImg from '../../assets/img/WalletConnect.png';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { PresaleAddress, TokenAddress } from '../../_constants';
import PresaleContract from '../../abis/presale_abi.json';
import TokenContract from '../../abis/token_abi.json';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './style.scss';

const Homepage = props => {
  const [available, setAvailable] = useState(0);
  const [sold, setSold] = useState(0);
  const [phase, setPhase] = useState('');
  const [amount, setAmount] = useState(0);
  const tokenName = 'WNTR';
  const [web3, setWeb3] = useState('');
  const [account, setAccount] = useState('');
  const [referralAddress, setReferralAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [details, setDetails] = useState({ bnb_amount: '', token_amount: '' });
  const [formStatus, setFormStatus] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [contract, setContract] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [presaleStatus, setPresaleStaus] = useState(0);
  const [presaleDate, setPresaleDate] = useState(0);
  const [timerStatus, setTimerStatus] = useState(0);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  let ethereum = '';

  const tokenStatusProps = { name: tokenName, phase, tokenBalance };
  const tokenProps = { name: tokenName, available: available, sold: sold };

  useEffect(() => {
    if (window.ethereum || window.web3) {
      setIsSupported(true);
      const we = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
      setContract(new we.eth.Contract(PresaleContract, PresaleAddress));
    } else {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    if (contract) {
      getTimeStamp();
      getPhase();
      getTokenValue();
      getAvailableSold();
      setLoading(false);
    }
  }, [contract]);

  const getAvailableSold = async () => {
    try {
      const total = await contract.methods.phaseSupplyTotal().call();
      const remaining = await contract.methods.phaseSupplyLeft().call();
      console.log('Total', Number(total).toFixed(2));
      console.log('Remaining', remaining);
      setSold(Number(total - remaining).toFixed(2));
      setAvailable(Number(remaining).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };
  const getTokenValue = async () => {
    try {
      const value = await contract.methods.rate().call();
      console.log('Rate', value);
      setTokenBalance(value);
    } catch (err) {
      console.log(err);
    }
  };

  const getPhase = async () => {
    try {
      const value = await contract.methods.currentPhase().call();
      console.log('Phase', value);
      setPhase(value);
    } catch (err) {
      console.log(err);
    }
  };
  const getTimeStamp = async () => {
    try {
      const start = await contract.methods.phaseStartTimestamp().call();
      const end = await contract.methods.phaseEndTimestamp().call();
      let now = moment().utc().valueOf();
      now = new String(now).substring(0, 10);
      if (now < start) {
        setPresaleStaus(0);
        setPresaleDate(new Date(Number(`${start}000`)));
      }
      if (now > start && now < end) {
        setPresaleStaus(1);
        setPresaleDate(new Date(Number(`${end}000`)));
      }
      console.log('Start timestamp', start);
      console.log('End timestamp', end);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const {
      location: { search },
    } = history;
    console.log(history);
    if (search) {
      setReferralAddress('');
    } else {
      setReferralAddress('');
    }
  }, []);

  const MetaMaskConnect = async () => {
    try {
      if (window.ethereum) {
        ethereum = window.ethereum;
        setWeb3(new Web3(ethereum));
        ethereum
          .send('eth_requestAccounts')
          .then(addresses => {
            setAccount(addresses.result[0]);
            setConnected(true);
          })
          .catch(err => {
            console.log(err);
          });
        ethereum.on('accountsChanged', result => {
          setAccount(result[0]);
        });
      } else {
        alert('Metamask is not installed.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const WalletConnectConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        infuraId: '30652f58d2134087bd480b5113af35ea',
        chainId: 1,
      });
      if (!provider.connected) {
        await provider.enable();
        console.log('Wallet Connect', provider.accounts);
        provider.rpcUrl =
          'https://ropsten.infura.io/v3/30652f58d2134087bd480b5113af35ea';
        provider.wc.rpcUrl =
          'https://ropsten.infura.io/v3/30652f58d2134087bd480b5113af35ea';
        const we = new Web3(provider);
        setContract(new we.eth.Contract(PresaleContract, PresaleAddress));
        setWeb3(new Web3(provider));
        setAccount(provider.accounts[0]);
        setConnected(true);
        provider.on('disconnect', (code, reason) => {
          setWeb3(new Web3(window.ethereum || ''));
          setAccount('');
          setContract('');
          setConnected(false);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buyToken = async () => {
    try {
      Object.entries(details).map(([key, value]) => {
        if (!value) throw new Error('Missing');
      });
      console.log('Submitted', details);
      setFormStatus(true);
      await contract.methods
        .purchaseToken(account, referralAddress ? referralAddress : account)
        .send({
          from: account,
          to: TokenAddress,
          value: web3.utils.toWei(details['bnb_amount'].toString(), 'ether'),
        });
    } catch (err) {
      console.log('Error', details, err.message);
      if (err.message == 'Missing') {
        setFormStatus(false);
      }
    }
  };

  const status_to_title = {
    0: 'Presales starts in',
    1: 'Presales end in',
    2: 'Presales is ended. Please wait for another presales',
  };

  if (!isSupported) {
    return <div>Your browser doesnot support dApps</div>;
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Loader type='Puff' color='#00BFFF' height={70} width={70} />
      </div>
    );
  }

  return (
    <div className='main'>
      <div className='homepage'>
        <div className='homepage__section1'>
          <TokenStatus {...tokenStatusProps} />
        </div>
        <div className='homepage__section2'>
          <Token {...tokenProps}></Token>
        </div>
        <div className='homepage__section3'>
          {presaleStatus == 0 || presaleStatus == 1 ? (
            <CountDown
              title={status_to_title[presaleStatus]}
              date={presaleDate}
              setTimerStatus={setTimerStatus}
              timerStatus={timerStatus}
            ></CountDown>
          ) : (
            <h5 style={{ textAlign: 'center' }}>
              {status_to_title[presaleStatus]}
            </h5>
          )}
        </div>
        {presaleStatus == 0 ? (
          <div className='homepage__section4'>
            {!connected ? (
              <>
                <h2 style={{ fontWeight: 'bold' }}>Connect With</h2>
                <div className='walletlist'>
                  <Wallet
                    title='Metamask'
                    onClick={MetaMaskConnect}
                    wallet_image={metamasxImg}
                  ></Wallet>
                  <Wallet
                    title='WalletConnect'
                    onClick={WalletConnectConnect}
                    wallet_image={walletConnectImg}
                  ></Wallet>
                </div>
              </>
            ) : (
              <BuyToken
                details={details}
                setDetails={setDetails}
                name={tokenName}
                amount={amount}
                onClick={buyToken}
                formStatus={formStatus}
                tokenBalance={tokenBalance}
              ></BuyToken>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Homepage;

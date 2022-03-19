import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import contractAbi from './assets/newContractABI.json';
import socialContractAbi from './assets/socialContractABI.json';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = 'home';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = '0x72F376376B78DDa1188C5Bdcda01085a683fe8c5';
const SOCIAL_CONTRACT_ADDRESS = '0x6DA1b53a7B1E05FD9042bF33A88F3c03177A7663';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [habit, setHabit] = useState('');
	const [days, setDays] = useState('');
	const [network, setNetwork] = useState('');
	const [flag, setFlag] = useState('');
	let intention;
	const [numberOfDays, setNumberOfDays] = useState(0);
	const [numberOfDefaults, setnumberOfDefaults] = useState(0);
	const [weiDeposited, setweiDeposited] = useState(0);
	const [weiBalance, setweiBalance] = useState(0);
	const [habit1, setHabit1] = useState('');
	const [checking, setChecking] = useState(false);

	//Social
	const [friend, setFriend] = useState('');
	let intention2;
	const [numberOfDays2, setNumberOfDays2] = useState(0);
	const [numberOfDefaults2, setnumberOfDefaults2] = useState(0);
	const [weiDeposited2, setweiDeposited2] = useState(0);
	const [weiBalance2, setweiBalance2] = useState(0);
	const [habit2, setHabit2] = useState('');
	const [checking2, setChecking2] = useState(false);
	//tests
	//connectwallet method:
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });

			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

	// Gotta make sure this is async.
	const checkIfWalletIsConnected = async () => {
		// First make sure we have access to window.ethereum
		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		} else {
			console.log("We have the ethereum object", ethereum);
		}
		// Check if we're authorized to access the user's wallet
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		// Users can have multiple authorized accounts, we grab the first one if its there!
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);

		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	}

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: '0x13881',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
										name: "Mumbai Matic",
										symbol: "MATIC",
										decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		}
	}

	//function to call register function:
	const registerHabit = async () => {
		// Don't run if the habit is empty
		if (!habit) {
			alert('You must enter what habit you want to build');
			return;
		}
		// Dont run if number of days is empty
		if (!days) {
			alert('you must enter the number of days you want to do this habit for, WE RECOMMEND 21 DAYS')
			return;
		}
		//check the minimum days
		// if (days < 1) {
		// 	alert('Habit must be of atleast x days');
		// 	return;
		// }
		console.log("Setting Habit", habit, "for this many days:", days);
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				console.log("Going to pop wallet now to pay")
				let tx = await contract.register(habit, days, { value: ethers.utils.parseEther("0.001") });
				// Wait for the transaction to be mined
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("Habit set! https://mumbai.polygonscan.com/tx/" + tx.hash);

					setFlag(true);
					setDays('');
					setHabit('');

				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	//function to call the checkIn Function:

	const callCheckIn = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				console.log("Going to pop wallet now to pay")
				let tx = await contract.checkin();
				// Wait for the transaction to be mined
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("You have checked in! https://mumbai.polygonscan.com/tx/" + tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	//call redeem function:
	const Redeem = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				console.log("Going to pop wallet now to pay")
				let tx = await contract.redeem();
				// Wait for the transaction to be mined
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("You have redeemed! https://mumbai.polygonscan.com/tx/" + tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}


	//function to call getuserintention
	const callUserIntention = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
				const socialContract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, socialContractAbi.abi, signer);

				let check = await contract.userAddresses(currentAccount);
				console.log("BOOL:", check);
				setChecking(check);

				let habitAddress = await contract.habit();
				console.log("Token address:",habitAddress);

				console.log("The users intentions:")
				intention = await contract.getUserIntention();
				setNumberOfDays(intention[0]);
				setnumberOfDefaults(intention[1]);
				setweiDeposited(ethers.utils.formatUnits(intention[3].toString()));
				setweiBalance(ethers.utils.formatUnits(intention[4].toString()));
				setHabit1(intention[5]);
				console.log(intention)
				// Wait for the transaction to be mined
				
				let hasFriends = await socialContract.returnFriends();
				console.log("friendsList length is " + hasFriends.length);
				if(hasFriends.length > 0) {
					callFriendsIntention();
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	const callFriendsIntention = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
				const socialContract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, socialContractAbi.abi, signer);

				let check2 = await contract.userAddresses(currentAccount);
				console.log("BOOL2:", check2);
				setChecking2(check2);

				// let habitAddress = await contract.habit();
				// console.log("Token address:",habitAddress);

				// console.log("The users intentions:")
				let friendsAddr = await socialContract.returnFriends();
				console.log("Your friend's address is " + friendsAddr[0]);
				intention = await contract.getSpecificUserIntention(friendsAddr[0]);
				setNumberOfDays2(intention[0]);
				setnumberOfDefaults2(intention[1]);
				setweiDeposited2(ethers.utils.formatUnits(intention[3].toString()));
				setweiBalance2(ethers.utils.formatUnits(intention[4].toString()));
				setHabit2(intention[5]);
				console.log(intention)
				// Wait for the transaction to be mined
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	const registerFriend = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const socialContract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, socialContractAbi.abi, signer);
				// await socialContract.register();
				await socialContract.registerFriend(ethers.utils.getAddress(friend));
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	//function to call withdraw:
	//function to call getuserintention
	const withdrawFunder = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
				let tx = await contract.withdraw();
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("You have checked in! https://mumbai.polygonscan.com/tx/" + tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}

			}
		}
		catch (error) {
			console.log(error);
		}
	}

	// Render Methods:
	// Create a function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://c.tenor.com/gIeMKmGOX6AAAAAC/consisten.gif" alt="" />
			<button className="cta-button connect-wallet-button" onClick={connectWallet}>
				Connect Wallet
			</button>
		</div>
	);

	// Form to enter domain name and data
	const renderInputForm = () => {
		// If not on Polygon Mumbai Testnet, render "Please connect to Polygon Mumbai Testnet"
		if (network !== 'Polygon Mumbai Testnet') {
			return (
				<div className="connect-wallet-container">
					<h2>Please switch to Polygon Mumbai Testnet</h2>
					{/* This button will call our switch network function */}
					<button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
				</div>
			);
		}
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={habit}
						placeholder='What do you wanna do?'
						onChange={e => setHabit(e.target.value)}
					/>
					{/* <p className='tld'> {tld} </p> */}
				</div>

				<input
					type="text"
					value={days}
					placeholder='Number of Days'
					onChange={e => setDays(e.target.value)}
				/>

				<input
					type="text"
					value={friend}
					placeholder='Add a friend'
					onChange={e => setFriend(e.target.value)}
				/>

				<div className="button-container">
					{/* <button className='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>   */}
					<button className='cta-button mint-button' disabled={null} onClick={registerHabit}>
						Create habit
					</button>
					<button className='cta-button mint-button' disabled={null} onClick={callUserIntention}>
						User Profile
					</button>
					<button className='cta-button mint-button' disabled={null} onClick={registerFriend}>
						Add a friend
					</button>
					<button className='cta-button mint-button' disabled={null} onClick={withdrawFunder}>
						Withdraw Funds
					</button>

				</div>

			</div>
		);
	}

	//function to render the check in 
	const checkInPage = () => {
		return (
			<div >
				<button className='cta-button mint-button' disabled={null} onClick={callCheckIn}>
					Check In
				</button>
			</div>
		);
	}

	//function to render profile of user
	const profile = () => {
		callUserIntention();
		console.log(intention);
		return (
			<div>

				<div className="Profile">

					<div className="profile-heading">
						<h1>
							Your habit: {habit1}
						</h1>
					</div>

					<div className="profile">

						<div className="profile-item">
							<h1>{numberOfDays}</h1>
							<h2>Number of Days</h2>
							<h3>The total number of days I will do this habit for</h3>
						</div>

						<div className="profile-item">
							<h1>{numberOfDefaults}</h1>
							<h2>Misses</h2>
							<h3>Have you missed any days? 4 strikes and you are out</h3>
						</div>

						<div className="profile-item">
							<h1>{weiDeposited}</h1>
							<h2>Money deposited</h2>
							<h3>Amount you staked when registering your habit</h3>
						</div>

						<div className="profile-item">
							<h1>{weiBalance}</h1>
							<h2>Current Balance</h2>
							<h3>Is it less than what you deposited? Had warned ya, dont miss any days</h3>
						</div>

					</div>

				</div>

				{/*check in button rendering*/}
				<div className="button-container" >
					<button className='cta-button mint-button' disabled={null} onClick={callCheckIn}>
						Check In
					</button>
					<button className='cta-button mint-button' disabled={null} onClick={Redeem}>
						Redeem
					</button>
				</div>

			</div>
		)
	}

		//function to render profile of user's friend
		const profile2 = () => {
			callFriendsIntention();
			console.log(intention2);
			return (
				<div>
	
					<div className="Profile">
	
						<div className="profile-heading">
							<h1>
								Your friend's habit: {habit2}
							</h1>
						</div>
	
						<div className="profile">
	
							<div className="profile-item">
								<h1>{numberOfDays2}</h1>
								<h2>Number of Days</h2>
							</div>
	
							<div className="profile-item">
								<h1>{numberOfDefaults2}</h1>
								<h2>Misses</h2>
							</div>
	
							<div className="profile-item">
								<h1>{weiDeposited2}</h1>
								<h2>Money deposited</h2>
							</div>
	
							<div className="profile-item">
								<h1>{weiBalance2}</h1>
								<h2>Current Balance</h2>
							</div>
	
						</div>
	
					</div>
	
				</div>
			)
		}


	// This runs our function when the page loads.
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])


	return (
		<div className="App">
			<div className="container">

				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🎯 Consistently</p>
							<p className="subtitle">Build habits and earn NFTs!</p>
						</div>

						{/* Display a logo and wallet connection status*/}
						<div className="right">
							<img alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo} />
							{currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p>}
						</div>
					</header>
				</div>

				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the input form if an account is connected */}
				{!checking && currentAccount && renderInputForm()}
				{/*flag && checkInPage()*/}
				{checking && profile()}
				{checking2 && profile2()}

				{/* Hide the connect button if currentAccount isn't empty
				{!currentAccount && renderNotConnectedContainer()} */}

				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;

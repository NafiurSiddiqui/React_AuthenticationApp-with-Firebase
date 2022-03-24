import React, { useCallback, useEffect, useState } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
	//get the current time
	const currentTime = new Date().getTime();
	//convert the expiration time into milliseconds
	const adjustedExpirationTime = new Date(expirationTime).getTime();

	//calculate
	const remainingDuration = adjustedExpirationTime - currentTime;
	// NOTE  👆 this is undefined at this point since we still havent got the right expiration time yet.
	//but we will handle this.

	return remainingDuration;
};

//
const retrieveStoredToken = () => {
	const storedToken = localStorage.getItem('token');

	const storedExpirationDate = localStorage.getItem('expirationTime');

	const remainingTime = calculateRemainingTime(storedExpirationDate);

	if (remainingTime <= 60000) {
		//60000 = 1min
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		return null;
		//we do not retrieve the token
	}

	return {
		token: storedToken,
		duration: remainingTime,
	};
};

export const AuthContextProvider = (props) => {
	//get the right token data
	const tokenData = retrieveStoredToken();
	//we set the initial login state as token
	let initialToken;

	if (tokenData) {
		initialToken = tokenData.token;
	}
	//init state with 'intiToken'
	const [token, setToken] = useState(initialToken);
	//check login status
	const userIsLoggedIn = !!token;

	//logout first so that we can use it down in the login handler
	const logoutHandler = useCallback(() => {
		//resetting login status
		setToken(null);
		//remove session storage
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		//logout check
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	const loginHandler = (token, expirationTime) => {
		//setting the login status
		setToken(token);
		//setting session
		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);
		//calculate the session remaining time
		const remainingTime = calculateRemainingTime(expirationTime);

		//set timer
		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	useEffect(() => {
		if (tokenData) {
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData, logoutHandler]);

	//creating the context obj
	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;

/**
 * @context - managing the state to pass around the idTOken wherever we need it. Remember, id token is provided by our database.
 * although, the data is coming in from the DB we define our data here for genereal structure and for better autocompletion purpose with our additional keys and value.
 * @provider - is responsible for managing auth related state. We use the provider as wrapper.
 * we manage the state in the provider.
 *The value that we pass in is created here, so that all the children has access to this values.
 * @state - we see if the user isLoggedin or not, by looking at the token state.
 *
 * @tokenCheck -  that is a not not operator, check for truthy or falsy value of something
 * @notnot - operator checks a boolean condition
 *
 * @localStorage - Here we use the Authentication token inside local storage to refrain user from logging in in case the browser refresh. Remember the security mechanism here (Cookies vs Local storage)
 * https://academind.com/tutorials/localstorage-vs-cookies-xss
 *
 * @initToken - we do this in order to keep the user logged in regardless of the browser refresh by initializing the state with this value set in the local storage.
 *
 * @timeout - the whole firebase response token expires after an hour, so we go ahead and calculate the login timeout based on the time user logged in until the browser refresh or something.
 *
 * @useEffect - since our if(tokenData) is way up high and the function for logout lives down there, we used an effect to do it for us by using tokenData as dependancy.
 * @useCallBack - since we has our logoutHandler as dependancy for useEffect, this would create unnecessarey infiniti loop, and prevented it by using the callBack, only when needed.
 * **Did not add any dependancy since none of them used matters as dependancy.
 */

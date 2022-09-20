import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
	token: "",
	isLoggedIn: false,
	login: (_token) => {},
	logout: () => {},
});

const calculateRemaningTime = (expirationTime) => {
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(expirationTime).getTime();
	const remainingDuration = adjExpirationTime - currentTime;

	return remainingDuration;
};

const retrieveStoredToken = () => {
	const storedToken = localStorage.getItem("token");
	const storedExpirationTime = localStorage.getItem("expirationTime");

	const remainingTime = calculateRemaningTime(storedExpirationTime);
	if (remainingTime <= 60000) {
		localStorage.removeItem("token");
		localStorage.removeItem("expirationTime");
		return null;
	}

	return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
	const tokenData = retrieveStoredToken();
	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}
	const [token, setToken] = useState(initialToken);

	const userIsLoggedIn = !!token;

	const logoutHandler = useCallback(() => {
		setToken(null);
		localStorage.removeItem("token");
		localStorage.removeItem("expirationTime");
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);
	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem("token", token);
		localStorage.setItem("expirationTime", expirationTime);
		const remainingTime = calculateRemaningTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	useEffect(() => {
		logoutTimer = setTimeout(logoutHandler, tokenData.duration);
	}, [tokenData, logoutHandler]);

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	// console.log(contextValue);

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;

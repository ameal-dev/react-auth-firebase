import React, { useState } from "react";

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

export const AuthContextProvider = (props) => {
	const initalToken = localStorage.getItem("token");
	const [token, setToken] = useState(initalToken);

	const userIsLoggedIn = !!token;

	const logoutHandler = () => {
		setToken(null);
		localStorage.removeItem("token");
	};
	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem("token", token);
		const remainingTime = calculateRemaningTime(expirationTime);

		setTimeout(logoutHandler, remainingTime);
	};

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

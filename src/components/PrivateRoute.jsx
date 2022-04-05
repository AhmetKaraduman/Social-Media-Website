import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

const PrivateRoute = () => {
	// eslint-disable-next-line
	const { loggedIn, checkingStatus } = useAuthStatus();

	console.log(loggedIn);

	return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

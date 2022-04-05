import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";

function Navbar() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const auth = getAuth();
	const { loggedIn, checkingStatus } = useAuthStatus();

	useEffect(() => {
		setUser(auth.currentUser);
	}, [navigate, loggedIn, auth.currentUser]);

	return (
		<nav className="navbar">
			<div className="container">
				<ul>
					<li onClick={() => navigate("/")}>
						<p className="logo">Petbook</p>
					</li>
					<li>
						<ul className="navbarProfile">
							{user ? (
								<li
									className="navbarProfileUserName"
									onClick={() => navigate(`/profile/${auth.currentUser.uid}`)}
								>
									{user.displayName}
								</li>
							) : (
								<li onClick={() => navigate("/sign-in")}>Sign In</li>
							)}

							{user ? <ProfileAvatar /> : null}
						</ul>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;

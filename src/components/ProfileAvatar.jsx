import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

function ProfileAvatar() {
	// eslint-disable-next-line
	const { loggedIn, checkingStatus } = useAuthStatus();
	const [userProfile, setUserProfile] = useState(null);
	const navigate = useNavigate();
	const auth = getAuth();
	// eslint-disable-next-line
	const [userData, setUserData] = useState({
		name: auth.currentUser.displayName,
		userId: auth.currentUser.uid,
	});

	useEffect(() => {
		const fetchUser = async () => {
			const docRef = doc(db, "users", userData.userId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setUserProfile(docSnap.data());
			}
		};

		fetchUser();
		// eslint-disable-next-line
	}, [loggedIn]);
	return (
		<div
			className="profileAvatar"
			onClick={() => navigate(`/profile/${auth.currentUser.uid}`)}
		>
			{loggedIn && userProfile?.avatarImage ? (
				<img
					src={userProfile.avatarImage}
					alt="headerBackground"
					className="profileAvatarImage"
				/>
			) : (
				<FontAwesomeIcon
					icon={faUser}
					style={{ color: "#777", fontSize: "20px" }}
				/>
			)}
		</div>
	);
}

export default ProfileAvatar;

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { toast } from "react-toastify";

function ToolSection() {
	const auth = getAuth();
	const { loggedIn, checkingStatus } = useAuthStatus();
	const [profileName, setProfileName] = useState(null);
	const [user, setUser] = useState(null);

	const navigate = useNavigate();
	const param = useParams();

	useEffect(() => {
		const getUserFromUserID = async () => {
			const docRef = doc(db, "users", param.userId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setProfileName(docSnap.data().name);
			} else {
				console.log("No such document!");
			}
		};
		setUser(auth.currentUser);

		getUserFromUserID();
	}, [loggedIn, auth.currentUser, param.userId]);

	const signOut = () => {
		auth.signOut();
		navigate("/");
	};

	const toggleCreatePost = () => {
		document.querySelector(".createPostPage").classList.toggle("hide");
	};

	const toggleEditProfile = () => {
		document.querySelector(".editProfilePage").classList.toggle("hide");
	};

	return (
		<div className="toolSectionMain">
			<div className="toolSectionHeader">
				<h1 className="toolSectionHeaderName">{profileName}</h1>
			</div>
			<div className="tools">
				{user && user.uid === param.userId ? (
					<button className="btn createPost" onClick={toggleCreatePost}>
						Create Post
					</button>
				) : null}

				{user && user.uid === param.userId ? (
					<button className="btn editProfile" onClick={toggleEditProfile}>
						Edit Profile
					</button>
				) : null}
			</div>
			{user && user.uid === param.userId ? (
				<button className="btn logOut" onClick={signOut}>
					Log Out
				</button>
			) : null}
		</div>
	);
}

export default ToolSection;

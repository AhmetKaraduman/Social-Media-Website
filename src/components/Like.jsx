import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";

function Like({ likeUserId }) {
	const [likeUser, setLikeUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const getUsers = async () => {
			const docRef = doc(db, "users", likeUserId);
			const docSnap = await getDoc(docRef);

			setLikeUser(docSnap.data().name);
		};

		getUsers();
	}, []);

	const goToProfile = () => {
		navigate(`/profile/${likeUserId}`);
	};

	return (
		<div onClick={goToProfile} className="like-user-links">
			<p>{likeUser}</p>
		</div>
	);
}

export default Like;

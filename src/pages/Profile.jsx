import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import ToolSection from "../components/ToolSection";
import Post from "../components/Post";
import { db } from "../firebase.config";
import {
	doc,
	getDoc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "../components/CreatePost";
import EditProfile from "../components/EditProfile";
import ImageScreen from "../components/ImageScreen";

function Profile() {
	const auth = getAuth();
	// this one is from auth
	// eslint-disable-next-line
	const [user, setUser] = useState(null);
	// this one is from firebase
	const [userProfile, setUserProfile] = useState(null);
	// eslint-disable-next-line
	const { loggedIn, checkingStatus } = useAuthStatus();
	const [posts, setPosts] = useState(null);
	const [sourceImage, setSourceImage] = useState("");

	const param = useParams();

	useEffect(() => {
		setUser(auth.currentUser);

		const fetchUser = async () => {
			const docRef = doc(db, "users", param.userId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setUserProfile(docSnap.data());
			}
		};

		fetchUser();
		// eslint-disable-next-line
	}, [loggedIn, param.userId]);

	useEffect(() => {
		const fetchPosts = async () => {
			// Get reference
			const listingsRef = collection(db, "posts");

			// Create a query
			const q = query(
				listingsRef,
				where("userId", "==", param.userId),
				orderBy("timestamp", "desc"),
				limit(10)
			);

			// execute query
			const querySnap = await getDocs(q);

			const posts = [];

			querySnap.forEach((doc) => {
				posts.push({ id: doc.id, data: doc.data() });
			});

			setPosts(posts);
		};
		fetchPosts();
	}, [param.userId]);

	const imageScreen = (e) => {
		document.querySelector(".imageScreen").classList.toggle("hide");
		setSourceImage(e.target.src);
	};

	return (
		<div className="profile">
			<div className="container">
				<header className="profileHeader">
					<div className="headImage">
						{userProfile?.mainImage ? (
							<img
								src={userProfile.mainImage}
								alt="headerBackground"
								className="profileMainImage"
								onClick={imageScreen}
							/>
						) : (
							<FontAwesomeIcon
								icon={faUser}
								className="fontawesomeMainProfile"
							/>
						)}
					</div>

					<div className="headerProfileAvatar">
						{userProfile?.avatarImage ? (
							<img
								src={userProfile.avatarImage}
								alt="headerBackground"
								className="profileAvatarImage"
								onClick={imageScreen}
							/>
						) : (
							<FontAwesomeIcon
								icon={faUser}
								className="fontawesomeAvatarProfile"
							/>
						)}
					</div>
					<p className="headerProfileName">
						{userProfile ? userProfile?.name : null}
					</p>
				</header>

				{/* <div className="buttons">
					{user && user.uid === param.userId ? null : (
						<button className="btn follow">Follow</button>
					)}
				</div> */}

				<main className="profileMain">
					<div className="toolSection">
						<ToolSection />
					</div>
					<div className={`posts ${posts?.length === 0 ? "hide" : ""}`}>
						{posts
							? posts.map((post) => (
									<Post key={post.id} post={post} user={user} />
							  ))
							: null}
					</div>
				</main>
			</div>
			<div className="createPostPage hide">
				<CreatePost />
			</div>
			<div className="editProfilePage hide">
				<EditProfile />
			</div>
			<div className="imageScreen hide">
				{userProfile ? <ImageScreen image={sourceImage} /> : null}
			</div>
		</div>
	);
}

export default Profile;

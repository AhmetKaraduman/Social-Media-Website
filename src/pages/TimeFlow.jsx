import React from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { db } from "../firebase.config";
import Post from "../components/Post";

function TimeFlow() {
	const [posts, setPosts] = useState(null);
	const [user, setUser] = useState(null);
	// eslint-disable-next-line
	const { loggedIn, checkingStatus } = useAuthStatus();

	useEffect(() => {
		const auth = getAuth();
		setUser(auth.currentUser);
	}, [loggedIn]);

	useEffect(() => {
		const fetchPosts = async () => {
			// Set reference
			const docsRef = collection(db, "posts");

			// Create a query
			const q = query(docsRef, orderBy("timestamp", "desc"), limit(10));

			// execute query
			const querySnap = await getDocs(q);

			let posts = [];

			if (querySnap) {
				querySnap.forEach((doc) =>
					posts.push({ id: doc.id, data: doc.data() })
				);
			}

			setPosts(posts);
		};

		fetchPosts();
	}, []);

	return (
		<div className="posts">
			<div className="container">
				{posts
					? posts.map((post) => <Post key={post.id} post={post} user={user} />)
					: null}
			</div>
		</div>
	);
}

export default TimeFlow;

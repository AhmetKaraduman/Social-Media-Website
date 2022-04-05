import React from "react";
import Comment from "./Comment";
import { useState, useEffect } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import {
	doc,
	addDoc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	serverTimestamp,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function Post({ post }) {
	const auth = getAuth();
	const [comments, setComments] = useState(null);
	// eslint-disable-next-line
	const { loggedIn, checkingStatus } = useAuthStatus();
	const [newCommentData, setNewCommentData] = useState({
		comment: "",
		postId: "",
		userId: "",
		userName: "",
	});

	const { comment } = newCommentData;
	const navigate = useNavigate();
	const param = useParams();

	useEffect(() => {
		const fetchComments = async () => {
			try {
				// Set reference
				const commentsRef = collection(db, "comments");

				// Create a query
				const q = query(
					commentsRef,
					where("postId", "==", post.id),
					orderBy("timestamp", "desc"),
					limit(10)
				);

				// execute query
				const querySnap = await getDocs(q);

				const comments = [];

				querySnap.forEach((doc) => {
					comments.push({ id: doc.id, data: doc.data() });
				});

				setComments(comments.reverse());
			} catch (error) {
				console.log(error);
			}
		};

		fetchComments();
		// eslint-disable-next-line
	}, [loggedIn, newCommentData]);

	const textAreaChange = (e) => {
		setNewCommentData((newCommentData) => ({
			...newCommentData,
			[e.target.id]: e.target.value,
		}));
	};

	const sendComment = async () => {
		try {
			const copyNewCommentData = newCommentData;

			copyNewCommentData.postId = post.id;
			copyNewCommentData.userId = auth.currentUser.uid;
			copyNewCommentData.userName = auth.currentUser.displayName;
			copyNewCommentData.timestamp = serverTimestamp();

			setTimeout(() => {
				setNewCommentData((newCommentData) => ({
					...newCommentData,
					comment: "",
				}));
			}, 1000);
			// eslint-disable-next-line
			const docRef = await addDoc(
				collection(db, "comments"),
				copyNewCommentData
			);
			toast.success("Comment Posted");
		} catch (error) {
			console.log(error);
			toast.error("Failed To Send");
		}
	};

	const deletePost = async () => {
		try {
			console.log(post.id);
			const docRef = doc(db, "posts", post.id);
			await deleteDoc(docRef);
			navigate("/");
			toast.success("Post Deleted");
		} catch (error) {
			console.log(error);
			toast.error("Failed to delete post, try again please.");
		}
	};

	// const editPost = () => {
	// 	console.log("edit post");
	// };

	let date = "";
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const toDateTimes = (secs) => {
		const time = new Date(1970, 0, 1);
		time.setSeconds(secs);
		return time;
	};

	date = toDateTimes(post.data.timestamp.seconds);
	const now = (new Date().getTime() / 1000).toFixed(0);
	const year = 31556926;
	const sevenDays = 604800;
	const oneDay = 86400;
	const oneHour = 3600;

	let time = "";
	if (post.data.timestamp.seconds + oneHour >= +now) {
		const afterOneHour = +now - post.data.timestamp.seconds;
		time = `${(afterOneHour / 60).toFixed(0)} minutes ago`;
	} else if (post.data.timestamp.seconds + oneDay >= +now) {
		const afterOneDay = +now - post.data.timestamp.seconds;
		time = `${(afterOneDay / (60 * 60)).toFixed(0)} hour ago`;
	} else if (post.data.timestamp.seconds + sevenDays >= +now) {
		const afterSevenDays = +now - post.data.timestamp.seconds;
		time = `${(afterSevenDays / (60 * 60 * 24)).toFixed(0)} days ago`;
	} else if (post.data.timestamp.seconds + year <= +now) {
		time = `${date.getDate()}, ${
			months[date.getMonth()]
		} ${date.getFullYear()}`;
	} else {
		time = `${date.getDate()}, ${months[date.getMonth()]}`;
	}

	return (
		<div className="post">
			<div className="card">
				<div className="cardImg">
					<div
						className={`cardImage${
							post.data.image === "" || post.data.image.length === 0
								? "noImage"
								: ""
						}`}
					>
						{post.data.image === "" || post.data.image.length === 0 ? (
							""
						) : (
							<img src={post.data.image} alt="cardImg" />
						)}
					</div>
					<p className="cardAltBody">
						{" "}
						<span className="cardAltBodyUserName">
							<Link
								to={`/profile/${post.data.userId}`}
								style={{ color: "#fff", textDecoration: "none" }}
							>
								{post.data.userName}
							</Link>
						</span>
						<br />
						{post.data.body}
						<span className="postTime">{time}</span>
					</p>

					{loggedIn ? (
						auth.currentUser.uid === param.userId ? (
							<div className="buttons">
								<button className="btn delete" onClick={deletePost}>
									<FontAwesomeIcon icon={faTrash} />
								</button>
								{/* <button className="btn edit">
									<FontAwesomeIcon icon={faPencil} onClick={editPost} />
								</button> */}
							</div>
						) : null
					) : null}
				</div>
				<div className="cardCommentArea">
					{comments
						? comments.map((comment) => (
								<Comment key={comment.id} comment={comment} />
						  ))
						: null}
					<div className="commentInput">
						<textarea
							type="text"
							placeholder="Comment"
							minLength="5"
							maxLength="100"
							id="comment"
							value={comment}
							onChange={textAreaChange}
						/>
						<button className="btn" onClick={sendComment}>
							<FontAwesomeIcon icon={faAngleRight} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Post;

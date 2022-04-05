import React from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function CreatePost() {
	// eslint-disable-next-line
	const param = useParams();
	const auth = getAuth();
	const [postData, setPostData] = useState({
		body: "",
		images: "",
		userId: "",
		userName: "",
	});

	const user = auth.currentUser;
	const { body, images } = postData;
	const onMutate = (e) => {
		// Files
		if (e.target.files) {
			setPostData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}

		// Text/Booleans/Numbers
		if (!e.target.files) {
			setPostData((prevState) => ({
				...prevState,
				[e.target.id]: e.target.value,
			}));
		}
	};

	const toggleCreatePost = () => {
		document.querySelector(".createPostPage").classList.toggle("hide");
	};

	const sendPost = async () => {
		if (body.length < 10) {
			return toast.error("Post must be at least 10 character");
		}
		setPostData((prevState) => ({
			...prevState,
			userId: user.uid,
			userName: user.displayName,
		}));

		// const copyPostData = postData;
		// copyPostData.timestamp = serverTimestamp();

		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

				const storageRef = ref(storage, "images/" + fileName);
				const uploadTask = uploadBytesResumable(storageRef, image);

				// Listen for state changes, errors, and completion of the upload.
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
								break;
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						// Upload completed successfully, now we can get the download URL
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
		};

		const image = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			toast.error("Images not uploaded");
			return;
		});

		setPostData((prevState) => ({
			...prevState,
			userId: user.uid,
			userName: user.displayName,
		}));

		const copyPostData = {
			...postData,
			image,
			userId: user.uid,
			userName: user.displayName,
			timestamp: serverTimestamp(),
		};

		delete copyPostData.images;

		// eslint-disable-next-line
		const docRef = await addDoc(collection(db, "posts"), copyPostData);

		toggleCreatePost();
		window.location.reload();
	};

	return (
		<div className="createPostPageMain">
			<button className="btn back" onClick={toggleCreatePost}>
				Back
			</button>
			<div className="container">
				<form>
					<div className="formImage">
						<label htmlFor="image">Photo</label>
						<input
							type="file"
							name="image"
							id="image"
							className="formInputFile"
							onChange={onMutate}
							max="1"
							accept=".jpg, .png, .jpeg"
						/>
					</div>
					<div className="formBody">
						<label htmlFor="post">Post</label>
						<textarea
							name="body"
							id="body"
							className="formInputBody"
							value={body}
							onChange={onMutate}
							placeholder="What do you think?"
							minLength={10}
							maxLength={200}
						></textarea>
					</div>
				</form>
				<button className="btn sendPost" onClick={sendPost}>
					Post It
				</button>
			</div>
		</div>
	);
}

export default CreatePost;

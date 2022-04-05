import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function EditProfile() {
	const [images, setImages] = useState({
		mainImage: "",
		avatarImage: "",
	});

	const { mainImage, avatarImage } = images;
	const auth = getAuth();
	const user = auth.currentUser;
	const toggleCreatePost = () => {
		document.querySelector(".editProfilePage").classList.toggle("hide");
	};
	const onMutate = (e) => {
		setImages((prevState) => ({
			...prevState,
			[e.target.id]: e.target.files,
		}));
	};

	const updateProfile = async () => {
		console.log(images);

		const copyImages = images;
		console.log(copyImages);

		const storeImage = async (image) => {
			console.log(image);
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

		try {
			if (avatarImage !== "") {
				try {
					copyImages.avatarImage = await storeImage(avatarImage[0]);
				} catch (error) {
					console.log(error);
					toast.error("Images not uploaded");
					return;
				}
			} else {
				delete copyImages.avatarImage;
			}

			if (mainImage !== "") {
				try {
					copyImages.mainImage = await storeImage(mainImage[0]);
				} catch (error) {
					console.log(error);
					toast.error("Images not uploaded");
					return;
				}
			} else {
				delete copyImages.mainImage;
			}

			const docRef = doc(db, "users", user.uid);
			console.log(copyImages);
			await updateDoc(docRef, copyImages);

			toggleCreatePost();
			window.location.reload();
			toast.success("Pictures updated");
		} catch (error) {
			console.log(error);
			toast.error("Failed to update");
		}
	};

	return (
		<div className="createPostPageMain">
			<button className="btn back" onClick={toggleCreatePost}>
				Back
			</button>
			<div className="container">
				<form>
					<div className="formImage">
						<label htmlFor="image">Background Photo</label>
						<input
							type="file"
							name="mainImage"
							id="mainImage"
							className="formInputFile"
							onChange={onMutate}
							max="1"
							accept=".jpg, .png, .jpeg"
						/>
					</div>
					<div className="formImage">
						<label htmlFor="image">Profile Photo</label>
						<input
							type="file"
							name="avatarImage"
							id="avatarImage"
							className="formInputFile"
							onChange={onMutate}
							max="1"
							accept=".jpg, .png, .jpeg"
						/>
					</div>
				</form>
				<button className="btn sendPost" onClick={updateProfile}>
					Update
				</button>
			</div>
		</div>
	);
}

export default EditProfile;

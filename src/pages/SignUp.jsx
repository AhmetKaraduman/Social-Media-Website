import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faLock,
	faEye,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function SignUp() {
	const [visiblePassword, setVisiblePassword] = useState(false);
	const [formSignUpData, setFormSignUpdata] = useState({
		name: "",
		email: "",
		password: "",
		avatarImage: "",
		mainImage: "",
	});

	const { name, email, password } = formSignUpData;
	const navigate = useNavigate();

	const onChange = (e) => {
		setFormSignUpdata((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onClick = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			updateProfile(auth.currentUser, {
				displayName: name,
			});

			// set firebase data
			const docRef = doc(db, "users", user.uid);

			// setting form data
			const copyFormSignUpData = { ...formSignUpData };
			delete copyFormSignUpData.password;
			copyFormSignUpData.userRef = auth.currentUser.uid;
			copyFormSignUpData.timestamp = serverTimestamp();

			// save data
			await setDoc(docRef, copyFormSignUpData);

			updateProfile(auth.currentUser, {
				profileName: name,
			});

			toast.success("User successfully registered");
			navigate(`/profile/${auth.currentUser.uid}`);
		} catch (error) {
			toast.error("User failed to register successfully");
		}
	};

	const setVisible = () => {
		setVisiblePassword((prevState) => !prevState);
	};

	return (
		<section className="signInPage">
			<div className="container">
				<header>
					<p className="header signIn">Hello</p>
				</header>

				<main>
					<form>
						<div className="input">
							<FontAwesomeIcon icon={faUser} className="icon" />
							<input
								type="text"
								placeholder="Name"
								id="name"
								value={name}
								className="nameInput"
								onChange={onChange}
							/>
						</div>
						<div className="input">
							<FontAwesomeIcon icon={faEnvelope} className="icon" />
							<input
								type="email"
								placeholder="Email"
								id="email"
								value={email}
								className="emailInput"
								onChange={onChange}
							/>
						</div>
						<div className="input">
							<FontAwesomeIcon icon={faLock} className="icon" />
							<input
								type={visiblePassword ? "text" : "password"}
								placeholder="password"
								id="password"
								value={password}
								className="passwordInput"
								onChange={onChange}
							/>
							<FontAwesomeIcon
								icon={faEye}
								className="eye"
								onClick={setVisible}
								style={{ cursor: "pointer" }}
							/>
						</div>

						<button className="btn signIn" onClick={onClick}>
							Sign Up
						</button>

						<div className="link">
							<Link to="/sign-in" className="signUpLink">
								Sign-In Instead
							</Link>
						</div>
					</form>
				</main>
			</div>
		</section>
	);
}

export default SignUp;

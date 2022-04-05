import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function SignIn() {
	const [visiblePassword, setVisiblePassword] = useState(false);
	const [formSignInData, setFormSignUpdata] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formSignInData;
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
			// eslint-disable-next-line
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			// eslint-disable-next-line
			const user = userCredential.user;
			toast.success("logged-in");
			navigate("/");
		} catch (error) {
			console.log(error);
			toast.error("User e-mail/password does not match");
		}
	};

	const setVisible = () => {
		setVisiblePassword((prevState) => !prevState);
	};

	return (
		<section className="signInPage">
			<div className="container">
				<header>
					<p className="header signIn">Welcome back</p>
				</header>

				<main>
					<form>
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
						<div className="link">
							<Link to="/forgot-password" className="forgotPasswordLink">
								Forgot Password
							</Link>
						</div>

						<button className="btn signIn" onClick={onClick}>
							Sign In
						</button>

						<div className="link">
							<Link to="/sign-up" className="signUpLink">
								You don't have account? Let's SIGN UP
							</Link>
						</div>
					</form>
				</main>
			</div>
		</section>
	);
}

export default SignIn;

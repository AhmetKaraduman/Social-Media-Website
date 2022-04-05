import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TimeFlow from "./pages/TimeFlow";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<TimeFlow />} />
					<Route path="/profile/:userId" element={<Profile />} />
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
				</Routes>
				<ToastContainer autoClose={1000} />
			</Router>
		</>
	);
}
export default App;

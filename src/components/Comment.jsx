import React from "react";
import { Link } from "react-router-dom";

function Comment({ comment }) {
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

	date = toDateTimes(comment.data.timestamp.seconds);
	const now = (new Date().getTime() / 1000).toFixed(0);
	// console.log(date);
	// console.log(now);
	const year = 31556926;
	const sevenDays = 604800;
	const oneDay = 86400;
	const oneHour = 3600;

	let time = "";
	if (comment.data.timestamp.seconds + oneHour >= +now) {
		const afterOneHour = +now - comment.data.timestamp.seconds;
		time = `${(afterOneHour / 60).toFixed(0)} minutes ago`;
	} else if (comment.data.timestamp.seconds + oneDay >= +now) {
		const afterOneDay = +now - comment.data.timestamp.seconds;
		time = `${(afterOneDay / (60 * 60)).toFixed(0)} hour ago`;
	} else if (comment.data.timestamp.seconds + sevenDays >= +now) {
		const afterSevenDays = +now - comment.data.timestamp.seconds;
		time = `${(afterSevenDays / (60 * 60 * 24)).toFixed(0)} days ago`;
	} else if (comment.data.timestamp.seconds + year <= +now) {
		time = `${date.getDate()}, ${
			months[date.getMonth()]
		} ${date.getFullYear()}`;
	} else {
		time = `${date.getDate()}, ${months[date.getMonth()]}`;
	}

	return (
		<div className="comment">
			<Link
				to={`/profile/${comment.data.userId}`}
				style={{ color: "#333", textDecoration: "none" }}
			>
				<p className="commentOwner">{comment.data.userName}</p>
			</Link>
			<p className="commentBody">{comment.data.comment}</p>
			<small className="commentDate">{time}</small>
		</div>
	);
}

export default Comment;

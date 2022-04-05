import React from "react";

function ImageScreen({ image }) {
	const exitImageScreen = (e) => {
		if (e.target.classList.contains("onlyImage")) {
			document.querySelector(".imageScreen").classList.toggle("hide");
		}
	};

	return (
		<div className="onlyImage" onClick={exitImageScreen}>
			<img src={image} alt="" />
		</div>
	);
}

export default ImageScreen;

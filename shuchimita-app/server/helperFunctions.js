const getTimeLeft = (remainingTime) => {
	const seconds = Math.floor(remainingTime / 1000) % 60;
	const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
	const hours = Math.floor(remainingTime / (1000 * 60 * 60));

	return { seconds: seconds, minutes: minutes, hours: hours };
};

function getCurrentTimeUTCPlus6() {
	const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
	const utcPlus6Time = new Date().toLocaleString("en-US", options);
	const isoTime = new Date(utcPlus6Time).toISOString();
	const offset = "-06:00"; // UTC+6 offset
	return isoTime.slice(0, -1) + offset;
}

module.exports = {
	getTimeLeft,
	getCurrentTimeUTCPlus6,
};

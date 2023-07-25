const getTimeLeft = (remainingTime) => {
	const seconds = Math.floor(remainingTime / 1000) % 60;
	const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
	const hours = Math.floor(remainingTime / (1000 * 60 * 60));

	return { seconds: seconds, minutes: minutes, hours: hours };
};

module.exports = { getTimeLeft };

const createSupabaseClient = require("../supabase");
const helperFunctions = require("../helperFunctions");

// Initialize Supabase
const supabase = createSupabaseClient();

// TIME THRESHOLD (needs to be in millis)
const threshold = 5 * 60 * 1000; // 5 mins

/**
 * @memberof Server.js
 * @description Takes the RFID that is being scanned and checks if has been scanned before
 * @param {scannedId} scannedId - Id being scanned
 * @returns {Boolean} - returns true if id has been scanned or false if its the first time
 */
const checkRfid = async (scannedId) => {
	// const { scannedId, scanTime } = req.body;
	let { data: rfid_id, error } = await supabase
		.from("rfid_scanTime")
		.select("rfid_id")
		.eq("rfid_id", scannedId)
		.limit(1);

	console.log(rfid_id);
	if (error || rfid_id.length === 0) {
		return false;
	} else {
		return true;
	}
};

/**
 * @memberof Server.js
 * @description Gets the latest exisiting scan time of the RFID being scanned
 * @param {scannedId} scannedId - Id being scanned
 * @returns {Boolean} - returns the latest scan time, null if it doesnt exist
 */
const getLatestScanTime = async (scannedId) => {
	try {
		const { data, error } = await supabase
			.from("rfid_scanTime")
			.select("scan_time")
			.eq("rfid_id", scannedId)
			.eq("status", true)
			.order("scan_time", { ascending: false })
			.limit(1);
		if (error) {
			throw new Error("Error fetching latest scan time");
		}
		return data[0]?.scan_time;
	} catch (error) {
		throw new Error("An internal server error occurred");
	}
};

/**
 * @memberof Server.js
 * @description Inserts the scanned rfid along with the time and status
 * @param {scannedId} scannedId - Id being scanned
 * @param {scanTime} scanTime - The time sents from esp32
 * @param {status} status - The status of the scan depending on the "time" it will be true or false
 * @returns {Object} - returns the object which includes logs, scan status and the scan time
 */
const insertScanTimeAndRfid = async (scannedId, scanTime, status) => {
	try {
		const { data: id, error: scanError } = await supabase
			.from("rfid_scanTime")
			.insert([
				{
					status: status,
					rfid_id: scannedId,
					scan_time: scanTime,
				},
			])
			.select();

		if (scanError || !id) {
			throw new Error("Error inserting latest scan time");
		}

		return {
			scanStatus: id[0].status,
			scanTime: id[0].scan_time,
			logs: "Id has been logged",
		};
	} catch (scanError) {
		console.error("Error", scanError);
		throw new Error("Error inserting latest scan time");
	}
};

/**
 * @memberof Server.js
 * @description The function which processes the whole scanning procedure after esp32 calls the API
 * @param {scannedId} scannedId - Id being scanned
 * @param {scanTime} scanTime - The time sents from esp32
 * @returns {Object} - returns the object which includes logs, scan status, scan time and message for the user
 */
const processScan = async (scannedId, scanTime) => {
	// check if rfid has been scanned before
	const check = await checkRfid(scannedId);
	console.log("Scanned before? ", check);
	// if check is true then execute the following
	if (check) {
		// get the last scanned time
		const latestTime = await getLatestScanTime(scannedId);

		// get the time difference between last scanned time and scan time
		let timeDifference =
			new Date(scanTime).getTime() - new Date(latestTime).getTime();

		// if the difference is greater than
		if (timeDifference >= threshold) {
			const data = await insertScanTimeAndRfid(scannedId, scanTime, true);

			return {
				...data,
				lastScannedTime: latestTime,
				message: "Scan Successful!",
			};
		} else {
			const timeLeft = helperFunctions.getTimeLeft(threshold - timeDifference);

			const data = await insertScanTimeAndRfid(scannedId, scanTime, false);

			return {
				...data,
				lastScannedTime: latestTime,
				message:
					"Scan Time Out! Please come back in " +
					(timeLeft.hours === 0 ? "" : timeLeft.hours + " hours and ") +
					(timeLeft.minutes === 0 ? "" : timeLeft.minutes + " minutes and ") +
					(timeLeft.seconds === 0 ? "" : timeLeft.seconds + " seconds."),
			};
		}
	} else {
		const data = await insertScanTimeAndRfid(scannedId, scanTime, true);

		return { ...data, message: "Scan Successful!" };
	}
};

module.exports = {
	processScan,
};

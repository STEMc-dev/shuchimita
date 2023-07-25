const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const createSupabaseClient = require("./supabase");
const helperFunctions = require("./helperFunctions");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Initialize Supabase
const supabase = createSupabaseClient();
// Enable express for api calls
const app = express();
// Enable CORS for all routes
app.use(cors());
// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// TIME THRESHOLD (needs to be in millis)
const millis = 1000;
const threshold = 5 * 60 * millis;

var transporter = nodemailer.createTransport({
	service: process.env.NODEMAILER_SERVICE,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

app.get("/", async (req, res) => {
	res.send("Welcome to Shuchimita App");
});

app.post("/api/sendEmail", async (req, res) => {});

// API call for rgetting all registered user data
app.get("/api/getAll", async (req, res) => {
	let { data: student, error } = await supabase.from("student").select("*");
	if (error) {
		throw error;
	}
	res.status(200).json(student);
});

// API call for registering user. Rejects if user already exists
app.post("/api/register", async (req, res) => {
	try {
		// console.log(req.body);
		const { studentName, studentId, rfid, email } = req.body;

		const { data, error } = await supabase
			.from("student")
			.insert([
				{
					student_name: studentName,
					student_id: studentId,
					rfid_id: rfid,
					email: email,
				},
			])
			.select();

		if (error) {
			throw error;
		}

		// 		transporter.sendMail({
		// 			to: email,
		// 			from: process.env.NODEMAILER_USER,
		// 			subject: "Account Activation for BMC Discharge Module",
		// 			html: `
		// <p>Dear concerned,</p>
		// <p>Thank you for registering to the BMC Discharge Module</p>
		// <p>Your account will require to be activated via a link, provided below, where you will be asked to set your desired password</p>
		// <h5>Please click on this <a href="http://www.bmchms.com/api/doctors/activateAccount/${token}">link</a> to activate your account and login using the set credentials</h5>
		// `,
		// 	});

		res.status(200).json({ message: "Registration successful!", data: data });
	} catch (error) {
		console.error("Error during registration:", error);
		res
			.status(500)
			.json({ error: "Registration failed. Please try again later." });
	}
});

/* API call for when an ID is scanned. ESP32 will call this API to start the scan process
	and check for the scanStatus boolean from the returned response to enable/disable 
	scanning.
*/
app.post("/api/scanRfid", async (req, res) => {
	const { scannedId, scanTime } = req.body;

	try {
		// Query the 'rfids' table to get the RFID for the scanned ID
		const { data: userData, error: resultError } = await supabase
			.from("student")
			.select()
			.eq("rfid_id", scannedId)
			.single(); // Assuming there will be a single match for the ID

		if (resultError || !userData) {
			// Handle error and if RFID not found
			return res.status(404).json({ error: "No such RFID exists!" });
		} else {
			//start the scan proecess in the backend and wait for the response
			const scanInfo = await processScan(scannedId, scanTime);
			if (scanInfo.scanStatus) {
				return res.status(202).json({
					userData,
					scanInfo,
				});
			} else {
				return res.status(406).json({
					userData,
					scanInfo,
				});
			}
		}
	} catch (resultError) {
		console.error("Error while fetching RFID:", resultError);
		return res.status(500).json({ error: "An internal server error occurred" });
	}
});

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
					scan_time: new Date(scanTime).toISOString(),
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

			return { ...data, message: "Scan Successful!" };
		} else {
			const timeLeft = helperFunctions.getTimeLeft(timeDifference);

			const data = await insertScanTimeAndRfid(scannedId, scanTime, false);

			return {
				...data,
				message:
					"Failed! Please come back in " +
					timeLeft.hours +
					" hours and " +
					timeLeft.minutes +
					" minutes.",
			};
		}
	} else {
		const data = await insertScanTimeAndRfid(scannedId, scanTime, true);

		return { ...data, message: "Scan Successful!" };
	}
};


// const port = process.env.PORT || 3000;
// app.listen(port, () => {
// 	console.log(`Server running on port http://localhost:${port}`);
// });


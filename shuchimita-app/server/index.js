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



var transporter = nodemailer.createTransport({
	service: process.env.NODEMAILER_SERVICE,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

app.get("/", async (req, res) => {
	res.json("Hello");
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
			const scanInfo = await helperFunctions.processScan(scannedId, scanTime);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});

module.exports = { supabase };
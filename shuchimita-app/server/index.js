const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const createSupabaseClient = require("./supabase");
const helperFunctions = require("./helperFunctions");
const appController = require("./controllers/appController");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Initialize Supabase
const supabase = createSupabaseClient();
// Enable express for api calls
const app = express();
// Enable CORS for all routes
app.use(
  cors({
    origin: ["https://shuchimita.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
)
// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// var transporter = nodemailer.createTransport({
// 	service: process.env.NODEMAILER_SERVICE,
// 	auth: {
// 		user: process.env.NODEMAILER_USER,
// 		pass: process.env.NODEMAILER_PASS,
// 	},
// });

app.get("/", async (req, res) => {
  res.json("Hello! Welcome to Shuchimita server! (version 1.0.0)")
})

// API call for rgetting all registered user data
app.get("/api/getAll", async (req, res) => {
  let { data: student, error } = await supabase.from("student").select("*")
  if (error) {
    throw error
  }
  res.status(200).json(student)
})

// Login
app.post("/api/login", async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      res.status(400).json({ message: "Login failed!", data: data })
    }
    console.log(data)

    res.status(200).json({ ...data })
  } catch (error) {
    console.log(error)
  }
})

// API call for registering user. Rejects if user already exists
app.post("/api/register", async (req, res) => {
  try {
    // console.log(req.body);
    const { studentName, studentId, rfid, email } = req.body

    // Get the authorization token from the request headers
    const token = req.headers.authorization
    console.log("Authorization Token:", token)
    if (!token) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    const tokenParts = token.split(" ")
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const actualToken = tokenParts[1]

    // Verify the token and retrieve user information
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(actualToken)

    if (error) {
      console.error("Supabase getUser Error:", error)
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    console.log("User Object:", user)

    // Proceed with the registration since the user is authenticated
    const { data, error: insertError } = await supabase
      .from("student")
      .insert([
        {
          student_name: studentName,
          student_id: studentId,
          rfid_id: rfid,
          email: email,
        },
      ])
      .select()

    if (insertError) {
      throw insertError
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
    else {
      res.status(200).json({ message: "Registration successful!", data: data })
    }
  } catch (error) {
    console.error("Error during registration:", error)
    res
      .status(500)
      .json({ error: "Registration failed. Please try again later." })
  }
})

/* API call for when an ID is scanned. ESP32 will call this API to start the scan process
	and check for the scanStatus boolean from the returned response to enable/disable 
	scanning.
*/
app.post("/api/scanRfid", async (req, res) => {
	const { scannedId } = req.body;
	const scanTime = helperFunctions.getCurrentTimeUTCPlus6();
	// res.json(scanTime);
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
			const scanInfo = await appController.processScan(scannedId, scanTime);
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
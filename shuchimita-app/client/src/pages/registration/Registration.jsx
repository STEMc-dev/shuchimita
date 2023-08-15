import React, { useState } from "react";
import "./registration.styles.css";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../components/Button";
import TextField from "../../components/Textfield";
import Snackbar from "../../components/Snackbar";
import Header from "../../components/header/Header"
import { useNavigate } from "react-router-dom"

const Registration = ({ token }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [email, setEmail] = useState("")
  const [rfid, setRfid] = useState("")
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    type: "",
  })
  const [error, setError] = useState({
    nameError: false,
    idError: false,
    emailError: false,
    rfidError: false,
  })
  let isRequired = true

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    navigate("/")
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    // const { name, id, email } = this.state;
    const userData = { studentName, studentId, rfid, email }

    try {
      // Send user registration data to the backend API
      const response = await fetch(
        "https://shuchimita-backend.vercel.app/api/register",
        // "http://localhost:3000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.session.access_token}`,
          },
          body: JSON.stringify(userData),
        }
      )

      const data = await response.json()
      if (response.ok) {
        setAlert({
          ...alert,
          showAlert: true,
          message: "Registration Successful!",
          type: "success",
        })
        setStudentName("")
        setStudentId("")
        setEmail("")
        setRfid("")
        console.log(data)
      } else {
        console.log(data.error)
        setAlert({
          ...alert,
          showAlert: true,
          message: "There was a problem during registration.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error during registration:", error)
    }
    setLoading(false)
  }

  return (
    <>
      <Header handleLogout={handleLogout} dash={true} route={"/Registration"} />
      <div id="register">
        <Box className="box-register">
          <Snackbar alert={alert} setAlert={setAlert} />
          <div id="card-body">
            <div id="logo"></div>
            <p className="title-text">Welcome to Shuchimita!</p>
            <p id="sub-title">Please register to start</p>
            <form id="register-form" onSubmit={handleSubmit}>
              <Grid container spacing={3} direction={"column"}>
                <Grid item>
                  <TextField
                    name="name"
                    label={"Student Name"}
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onBlur={(e) =>
                      studentName === ""
                        ? setError({ ...error, nameError: true })
                        : setError({ ...error, nameError: false })
                    }
                    error={error.nameError}
                    helperText={error.nameError ? "Empty field" : ""}
                    required={isRequired}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="sid"
                    label={"Student ID"}
                    type="number"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onBlur={(e) =>
                      studentId === ""
                        ? setError({ ...error, idError: true })
                        : setError({ ...error, idError: false })
                    }
                    error={error.idError}
                    helperText={error.idError ? "Empty field" : ""}
                    required={isRequired}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="email"
                    label={"Email Address"}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) =>
                      email === ""
                        ? setError({ ...error, emailError: true })
                        : setError({ ...error, emailError: false })
                    }
                    error={error.emailError}
                    helperText={error.emailError ? "Empty field" : ""}
                    required={isRequired}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="rfid"
                    label={"RFID no."}
                    type="number"
                    value={rfid}
                    onChange={(e) => setRfid(e.target.value)}
                    onBlur={(e) =>
                      rfid === ""
                        ? setError({ ...error, rfidError: true })
                        : setError({ ...error, rfidError: false })
                    }
                    error={error.rfidError}
                    helperText={
                      error.rfidError ? "Empty field" : "*back of the ID card"
                    }
                    required={isRequired}
                  />
                </Grid>
              </Grid>
              <Grid item>
                {loading ? (
                  <CircularProgress style={{ marginTop: "50px" }} />
                ) : (
                  <Button
                    id="register-button"
                    value={"Register"}
                    type="submit"
                  />
                )}
              </Grid>
              {/* <Button
                color="secondary"
                variant="outlined"
                value={"Logout"}
                onClick={handleLogout}
              /> */}
            </form>
          </div>
          <div>
            <p id="tagLabel">
              <span>©</span> STEM Community, IUB.
            </p>
          </div>
        </Box>
      </div>
    </>
  )
}

export default Registration;

import React, { useState } from "react"
import "./login.styles.css"
import Box from "@mui/material/Box"
import { Grid } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "../../components/Button"
import TextField from "../../components/Textfield"
import Snackbar from "../../components/Snackbar"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
import logo from "../../assets/AgencyLogo.png"
import { useNavigate } from "react-router-dom"

const Login = ({ setToken }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    type: "",
  })
  const [error, setError] = useState({
    emailError: false,
    passwordError: false,
  })
  let isRequired = true

  // Handle login form submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const userData = { email, password }
    try {
      // Send user registration data to the backend API
      const response = await fetch(
        "https://shuchimita-backend.vercel.app/api/register",
        // "http://localhost:3000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setAlert({
          ...alert,
          showAlert: true,
          message: "Login Successful!",
          type: "success",
        })
        setEmail("")
        setPassword("")
        setToken({ ...data })
        navigate("/registration")
      } else {
        // console.log(data.error);
        setAlert({
          ...alert,
          showAlert: true,
          message: "Could not login.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error during registration:", error)
    }
    setLoading(false)
  }

  return (
    <Box className="box">
      <Snackbar alert={alert} setAlert={setAlert} />
      <div id="card-body">
        <div>
          <div id="header">
            <img src={logo} alt="Logo" />
            <p className="title-text">Admin Login</p>
          </div>
        </div>
        <p id="sub-title">Please login to start</p>
        <form id="register-form" onSubmit={handleSubmit}>
          <Grid container spacing={3} direction={"column"}>
            <Grid item>
              <TextField
                id="email"
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
                helperText={error.emailError ? "Empty field!" : ""}
                required={isRequired}
              />
            </Grid>
            <Grid item>
              <TextField
                id="password"
                name="password"
                label={"Password"}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) =>
                  password === ""
                    ? setError({ ...error, passwordError: true })
                    : setError({ ...error, passwordError: false })
                }
                error={error.passwordError}
                helperText={error.passwordError ? "Empty field!" : ""}
                required={isRequired}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress style={{ marginTop: "50px" }} />
            ) : (
              <Button id="login-button" value={"Login"} type="submit" />
            )}
          </Grid>
        </form>
      </div>
      <div>
        <p id="tagLabel">
          <span>©</span> STEM Community, IUB.
        </p>
      </div>
    </Box>
  )
}

export default Login

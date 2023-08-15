import React, { useState, useEffect } from "react";
import "./App.css"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Login, Registration, Dashboard } from "./pages/pages"
// import Login from "./pages/login/Login";
// import Registration from "./pages/registration/Registration";

const App = () => {
  const [token, setToken] = useState(null)
  const navigate = useNavigate() // Initialize useNavigate

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"))
      setToken(data)
    }
    console.log(token)
  }, [])

  useEffect(() => {
    // Use the useNavigate hook to handle redirection only if there's no token
    if (!sessionStorage.getItem("token")) {
      navigate("/")
    }
  }, [token, navigate])

  return (
    <div>
      <Routes>
        <Route exact path={"/"} element={<Login setToken={setToken} />} />
        {sessionStorage.getItem("token") ? (
          <>
            <Route
              exact
              path={"/registration"}
              element={<Registration token={token} />}
            />
            <Route
              exact
              path={"/dashboard"}
              element={<Dashboard token={token} />}
            />
          </>
        ) : (
          <Route exact path={"/"} element={<Login setToken={setToken} />} />
        )}
      </Routes>
    </div>
  )
}

export default App;

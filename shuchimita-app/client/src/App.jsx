import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, Registration } from "./pages/pages";

const App = () => {
  const [token, setToken] = useState(false);

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<Login setToken={setToken} />} />
        {token ? (
          <Route
            path={"/registration"}
            element={<Registration token={token} />}
          />
        ) : (
          <Route
            path="/registration"
            element={
              <div>
                <h1>404 Not Found!</h1>
              </div>
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default App;

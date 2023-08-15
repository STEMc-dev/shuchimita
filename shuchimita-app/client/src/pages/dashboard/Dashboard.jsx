import React from "react"
import Header from "../../components/header/Header"
import "./dashboard.styles.css"
import { Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Card from "../../components/card/Card"

const Dashboard = ({ token }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    navigate("/")
  }
  console.log("user: ", token)

  const data = [
    { deviceName: "Device 1", location: "DMK Level 3", pads: 30 },
    { deviceName: "Device 2", location: "Jubilee Level 2", pads: 50 },
    { deviceName: "Device 3", location: "Gym", pads: 80 },
    { deviceName: "Device 4", location: "Main Level 4", pads: 20 },
    { deviceName: "Device 5", location: "Lobby", pads: 73 },
    { deviceName: "Device 6", location: "Meds Room", pads: 10 },
  ]
  return (
    <Box>
      <Header handleLogout={handleLogout} route={"/Admin Dashboard"} />
      <div id="dashboard">
        {/* <p id="pageTitle">List of devices</p> */}
        <div id="gallery">
          {data.map((el) => {
            return <Card data={el} />
          })}
        </div>
      </div>
      <div id="footer">
        <p>
          <span>©</span> STEM Community, IUB.
        </p>
      </div>
    </Box>
  )
}

export default Dashboard

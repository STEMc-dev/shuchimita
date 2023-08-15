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
    { deviceName: "Device 1", pads: 30 },
    { deviceName: "Device 2", pads: 50 },
    { deviceName: "Device 3", pads: 80 },
    { deviceName: "Device 4", pads: 20 },
    { deviceName: "Device 5", pads: 73 },
    { deviceName: "Device 6", pads: 10 },
  ]
  return (
    <Box>
      <Header handleLogout={handleLogout} />
      <div id="dashboard">
        <h2>% of Pads in each device</h2>
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

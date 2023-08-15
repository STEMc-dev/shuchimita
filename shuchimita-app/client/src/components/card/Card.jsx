import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import "./card.styles.css"
import { Typography } from "@mui/material"
import HorizontalChart from "../HorizontalChart"
const Card = (props) => {
  return (
    <div className="card">
      <div id="device">
        <p style={{ fontSize: "20px" }}> {props.data.deviceName}: </p>
      </div>
      <div id="chart">
        <HorizontalChart data={props.data} />
      </div>
    </div>
  )
}

export default Card

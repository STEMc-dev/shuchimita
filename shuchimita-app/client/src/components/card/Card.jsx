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
        <p id="deviceName"> {props.data.deviceName}: </p>
        <p id="deviceLocation"> Location: {props.data.location}</p>
      </div>
      <div id="chart">
        <HorizontalChart data={props.data} />
      </div>
    </div>
  )
}

export default Card

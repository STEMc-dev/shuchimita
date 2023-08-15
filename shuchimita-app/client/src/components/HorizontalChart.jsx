// import "./styles.css"
import React from "react"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
} from "recharts"

const data = [
  {
    name: "",
    pads: 20,
  },
]

export default function App({ data }) {
  const dataArr = [data]
  return (
    <ResponsiveContainer height={140}>
      <ComposedChart
        layout="vertical"
        width={500}
        height={400}
        data={dataArr}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: -40,
        }}
      >
        <XAxis type="number" unit={"%"} domain={[0, 100]} />
        <YAxis hide={true} dataKey="-" type="category" scale="band" />
        <Tooltip />
        <Legend />
        {/* <Bar dataKey="pads" fill="#8884d8" background={{ fill: "#eee" }} /> */}
        <Bar
          dataKey="pads"
          barSize={30}
          fill="#912b6f"
          background={{ fill: "#eee" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function TextFields({ label, ...other }) {
	return (
		<TextField
			id="outlined-basic"
			autoComplete="off"
			label={label}
			variant="outlined"
			color="secondary"
			{...other}
		/>
	);
}

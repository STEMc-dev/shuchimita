import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function BasicButton({ value, ...other }) {
	return (
		<Stack
			spacing={2}
			direction="row"
			justifyContent="center"
			alignItems="center"
			marginTop={"50px"}
		>
			<Button
				style={{ borderRadius: "10px" }}
				size="large"
				variant="contained"
				{...other}
			>
				<span>{value}</span>
			</Button>
		</Stack>
	);
}

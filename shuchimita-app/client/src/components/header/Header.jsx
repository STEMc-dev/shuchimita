import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import "./header.styles.css"
import logo from "../../assets/AgencyLogo.png"
import SvgIcon from "@mui/material/SvgIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  )
}

export default function ButtonAppBar(props) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    console.log("arrived")
  }, [])

  return (
    <Box id="headerBox" sx={{ flexGrow: 1 }}>
      <AppBar className="header" position="static">
        <Toolbar className="header">
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            // sx={{ mr: 2 }}
            onClick={(e) => navigate("/dashboard")}
          >
            <img
              style={{ width: "30px", marginRight: "10px" }}
              src={logo}
              alt="Logo"
            />
            <Typography
              className="title-text"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Shuchimita
            </Typography>
          </IconButton>
          <Typography
            className="title-text"
            id="route"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {props.route}
          </Typography>
          <div>
            <div id="menuBtn">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MenuIcon color="secondary" />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  style={{ display: props.dash ? "none" : "" }}
                  onClick={(e) => {
                    navigate("/registration")
                  }}
                >
                  Registration
                </MenuItem>
                <MenuItem
                  style={{ display: props.dash ? "" : "none" }}
                  onClick={(e) => {
                    navigate("/dashboard")
                  }}
                >
                  Home
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    props.handleLogout()
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
            <div id="navBtn">
              <Button
                style={{ display: props.dash ? "none" : "" }}
                id="registerBtn"
                color="secondary"
                variant="contained"
                onClick={(e) => {
                  navigate("/registration")
                }}
              >
                Registration
              </Button>
              <Button
                style={{ display: props.dash ? "" : "none" }}
                id="registerBtn"
                color="secondary"
                variant="contained"
                size="small"
                onClick={(e) => {
                  navigate("/dashboard")
                }}
              >
                <HomeIcon />
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={(e) => {
                  props.handleLogout()
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

import React from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    Sidebar
  } from "react-pro-sidebar";
import { Link } from 'react-router-dom';

import { FaList, FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";


function Navbar() {
    return (
        <Sidebar style={{ backgroundColor: 'white', color: 'black' }}>
            <Menu>
                <MenuItem component={<Link to="/" />}> Home </MenuItem>
                <MenuItem component={<Link to="/notifications" />}> Notifications </MenuItem>
                <MenuItem component={<Link to="/messages" />}> Messages </MenuItem>
                <MenuItem component={<Link to="/profile" />}> Profile </MenuItem>
                <MenuItem component={<Link to="/signout" />}> Sign out </MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default Navbar;
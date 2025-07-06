import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    IoIosArrowForward,
    IoMdSettings,
    IoIosArrowBack,
} from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { FaChartLine } from "react-icons/fa";
import { LuCalendarSearch } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { PiStrategy } from "react-icons/pi";
import { SiCoinmarketcap } from "react-icons/si";
import { TbWorld } from "react-icons/tb";
import { FaRegNewspaper } from "react-icons/fa";
import "../styles/sidebar.css";
import logo from "../assets/logotemp.png";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <button
                className={`collapse-btn ${collapsed ? "collapsed-btn" : ""}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                <IoIosArrowBack
                    className={`arrow-toggle ${collapsed ? "rotated" : ""}`}
                />
            </button>

            {!collapsed && (
                <>
                    <Link to="/" className="logo">
                        <img src={logo} alt="Logo" />
                        <h2>Trading Hub</h2>
                    </Link>
                    <div className="menu">
                        {/* Products */}
                        <div className="submenu">
                            <div
                                className="submenu-label"
                                onClick={() => toggleMenu("products")}
                            >
                                <div className="submenu-title">
                                    <AiFillProduct />
                                    <span>Products</span>
                                </div>
                                <IoIosArrowForward
                                    className={`arrow ${openMenu === "products" ? "rotated" : ""
                                        }`}
                                />
                            </div>
                            <div
                                className={`submenu-items ${openMenu === "products" ? "open" : ""
                                    }`}
                            >
                                <Link to="/chart" className="menu-item">
                                    <FaChartLine />
                                    <span>SuperCharts</span>
                                </Link>
                                <Link to="/calendar" className="menu-item">
                                    <LuCalendarSearch />
                                    <span>Calendars</span>
                                </Link>
                            </div>
                        </div>

                        {/* === Community === */}
                        <div className="submenu">
                            <div
                                className="submenu-label"
                                onClick={() => toggleMenu("community")}
                            >
                                <div className="submenu-title">
                                    <FaPeopleGroup />
                                    <span>Community</span>
                                </div>
                                <IoIosArrowForward
                                    className={`arrow ${openMenu === "community" ? "rotated" : ""
                                        }`}
                                />
                            </div>

                            <div
                                className={`submenu-items ${openMenu === "community" ? "open" : ""
                                    }`}
                            >
                                <Link to="/ideas" className="menu-item">
                                    <FaRegLightbulb />
                                    <span>Trading ideas</span>
                                </Link>
                                <Link to="/scripts" className="menu-item">
                                    <PiStrategy />
                                    <span>Indicators and strategies</span>
                                </Link>
                            </div>
                        </div>

                        {/* === Market === */}
                        <div className="submenu">
                            <div
                                className="submenu-label"
                                onClick={() => toggleMenu("market")}
                            >
                                <div className="submenu-title">
                                    <SiCoinmarketcap />
                                    <span>Market</span>
                                </div>
                                <IoIosArrowForward
                                    className={`arrow ${openMenu === "market" ? "rotated" : ""}`}
                                />
                            </div>

                            <div
                                className={`submenu-items ${openMenu === "market" ? "open" : ""
                                    }`}
                            >
                                <Link to="/countries" className="menu-item">
                                    <TbWorld />
                                    <span>Countries</span>
                                </Link>
                                <Link to="/news" className="menu-item">
                                    <FaRegNewspaper />
                                    <span>News</span>
                                </Link>
                            </div>
                        </div>

                        <Link className="menu-item" to="/user">
                            <FaUser />
                            <span>Profile</span>
                        </Link>

                        <Link className="menu-item" to="/notifications">
                            <IoIosNotifications />
                            <span>Notifications</span>
                        </Link>
                        
                        <Link className="menu-item" to="/settings">
                            <IoMdSettings />
                            <span>Settings</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;

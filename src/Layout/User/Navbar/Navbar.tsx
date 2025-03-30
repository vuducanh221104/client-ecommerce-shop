"use client";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
const cx = classNames.bind(styles);

function Navbar() {
  return <div className={cx("navbar")}>Navbar</div>;
}

export default Navbar;

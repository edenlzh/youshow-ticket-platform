import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#f2f2f2", padding: "10px" }}>
      {/* 可根据需要写菜单或logo */}
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
      <Link to="/merchant" style={{ marginRight: "15px" }}>商户后台</Link>
      <Link to="/events" style={{ marginRight: "15px" }}>演出列表</Link>
      {/* 也可加更多链接 */}
    </div>
  );
};

export default NavBar;

import "./Navbar.css";
import logo from "../assets/codesage.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <img src={logo} className="navbar-logo" />
      <span className="navbar-title">CodeSage</span>
    </header>
  );
}

import "../CSS/Header.css";
import {Link} from "react-router-dom";

function Header() {
    return (
        <header>
            <div className="logo-conatiner">
                <img src="src/image/logo1.png" alt=""/>
            </div>
            <div className="menu">
                <div className="item"><Link to={"/"}> Home</Link></div>
                <div className="item"><Link to={"/service"}>Service</Link></div>
                <div className="item"><Link to={"/profile"}> Profile</Link></div>
            </div>
        </header>
    );
}

export default Header;
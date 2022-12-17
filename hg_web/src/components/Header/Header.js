import "./Header.css";
import Logo from "../../imgs/logo.png";
import Menu from "../Menu/Menu";
import { useNavigate } from "react-router-dom";

function Header({}) {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    const navegar = useNavigate();

    const homeBtn = () => {
        navegar("/");
    };

    return (
        <div id="Header">
            <button id="HeaderLogo" onClick={homeBtn}>
                <img src={Logo} alt="Logo do Site" />
                <span>HG dos cria</span>
            </button>

            <Menu />
        </div>
    );
}

export default Header;

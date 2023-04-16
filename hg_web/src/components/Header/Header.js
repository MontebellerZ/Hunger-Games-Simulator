import "./Header.css";
import Logo from "../../imgs/logo.png";
import Menu from "../Menu/Menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Header() {
    // const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    const { t } = useTranslation();

    const navegar = useNavigate();

    const homeBtn = () => {
        navegar("/");
    };

    return (
        <div id="Header">
            <button id="HeaderLogo" onClick={homeBtn}>
                <img src={Logo} alt="Logo do Site" />
                <span>{t("Jogos Vorazes")}</span>
            </button>

            <Menu />
        </div>
    );
}

export default Header;

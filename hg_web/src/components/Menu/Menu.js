import "./Menu.css";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Tradutor from "../../utils/Tradutor/Tradutor";

function Menu({}) {
    const [lang, setLang] = useState(Tradutor.getSelectedLang());

    const mudarLang = (lg) => {
        Tradutor.mudarLinguagem(lg);
        setLang(lg);
    };

    return (
        <div id="menu">
            <NavLink to={"/"} className={({ isActive }) => (isActive ? "menuItem menuItemAtivo" : "menuItem")}>
                {Tradutor.t("Home")}
            </NavLink>
            <NavLink to={"/novoJogo"} className={({ isActive }) => (isActive ? "menuItem menuItemAtivo" : "menuItem")}>
                {Tradutor.t("Novo Jogo")}
            </NavLink>
            <NavLink to={"/jogos"} className={({ isActive }) => (isActive ? "menuItem menuItemAtivo" : "menuItem")}>
                {Tradutor.t("Jogos")}
            </NavLink>
            <NavLink
                to={"/participantes"}
                className={({ isActive }) => (isActive ? "menuItem menuItemAtivo" : "menuItem")}
            >
                {Tradutor.t("Tributos")}
            </NavLink>

            <select
                value={lang}
                onChange={(e) => {
                    mudarLang(e.target.value);
                }}
            >
                {Tradutor.getLangs().map((lg) => (
                    <option value={lg} label={lg.toUpperCase()} />
                ))}
            </select>
        </div>
    );
}

export default Menu;

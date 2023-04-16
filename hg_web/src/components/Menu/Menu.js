import "./Menu.css";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next, { changeLanguage } from "i18next";
import linguagens from "../../utils/i18n/languages.json";

function Menu() {
    const { t } = useTranslation();

    const itens = [
        { label: t("Home"), to: "/" },
        { label: t("Novo Jogo"), to: "/novoJogo" },
        { label: t("Jogos"), to: "/jogos" },
        { label: t("Tributos"), to: "/participantes" },
    ];

    const mudarLang = (lg) => {
        setLang(lg);
        changeLanguage(lg);
    };

    const [lang, setLang] = useState(i18next.language);

    return (
        <div id="menu">
            {itens.map(({ label, to }, i) => (
                <NavLink
                    key={i}
                    to={to}
                    className={({ isActive }) => (isActive ? "menuItem menuItemAtivo" : "menuItem")}
                >
                    {label}
                </NavLink>
            ))}

            <select
                value={lang}
                onChange={(e) => {
                    mudarLang(e.target.value);
                }}
            >
                {linguagens.map(({ nome, code }, i) => (
                    <option key={i} value={code} label={nome} />
                ))}
            </select>
        </div>
    );
}

export default Menu;

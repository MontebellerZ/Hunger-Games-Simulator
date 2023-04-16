import { useEffect, useState } from "react";
import Requests from "../../../requests/Requests";
import "./Participantes.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Participantes() {
    const { t } = useTranslation();
    const navegar = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [searchPart, setSearchPart] = useState("");
    const [novoPart, setNovoPart] = useState();

    const selectPart = (part) => {
        navegar("/participantes/" + part.id);
    };

    /**
     *
     * @param {Event} e
     */
    const submitNewPart = (e) => {
        e.preventDefault();

        let nome = novoPart.nome || "";
        let sobrenome = novoPart.sobrenome || "";
        let nick = novoPart.nick || "";

        Requests.postParticipante(nome, sobrenome, nick)
            .then((res) => {
                let redirecionar = window.confirm(t("Deseja ser redirecionado ao perfil do novo Tributo?"));
                if (redirecionar) selectPart({ id: res });
                else setNovoPart();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateParts = () => {
        Requests.getParticipantes()
            .then(setParticipantes)
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (!novoPart) updateParts();
    }, [novoPart]);

    return (
        <div>
            <div>
                <h1>{t("Tributos existentes")}</h1>
                <div>
                    <input
                        type={"search"}
                        value={searchPart}
                        onChange={(e) => {
                            setSearchPart(e.target.value);
                        }}
                        placeholder={t("Pesquisar tributo")}
                    />
                    <div>
                        {participantes.map((p, i) => {
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        selectPart(p);
                                    }}
                                    title={`${p.nome} ${p.sobrenome}`}
                                >
                                    {p.nick}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div>
                {novoPart ? (
                    <div>
                        <form onSubmit={submitNewPart}>
                            <label>
                                <span>{t("Nome do tributo")}</span>
                                <input
                                    type={"text"}
                                    value={novoPart.nome || ""}
                                    onChange={(e) => {
                                        setNovoPart((np) => {
                                            return { ...np, nome: e.target.value };
                                        });
                                    }}
                                    placeholder={t("Nome do tributo")}
                                />
                            </label>

                            <label>
                                <span>{t("Sobrenome do tributo")}</span>
                                <input
                                    type={"text"}
                                    value={novoPart.sobrenome || ""}
                                    onChange={(e) => {
                                        setNovoPart((np) => {
                                            return { ...np, sobrenome: e.target.value };
                                        });
                                    }}
                                    placeholder={t("Sobrenome do tributo")}
                                />
                            </label>

                            <label>
                                <span>{t("Nick do tributo")}</span>
                                <input
                                    type={"text"}
                                    value={novoPart.nick || ""}
                                    onChange={(e) => {
                                        setNovoPart((np) => {
                                            return { ...np, nick: e.target.value };
                                        });
                                    }}
                                    placeholder={t("Nick do tributo")}
                                />
                            </label>

                            <p>{t("Edite a foto do Tributo na página de perfil")}</p>

                            <button type="submit">{t("Criar Tributo")}</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={() => {
                                setNovoPart({});
                            }}
                        >
                            {t("Criar novo Tributo")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Participantes;

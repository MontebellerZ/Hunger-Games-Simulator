import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Requests from "../../../requests/Requests";
import "./Participante.css";

function Participante() {
    const { t } = useTranslation();
    const urlParams = useParams();
    const navegar = useNavigate();

    const partId = urlParams.id;

    const [participante, setParticipante] = useState({});
    const [editing, setEditing] = useState(false);

    const getParticipante = () => {
        Requests.getParticipante(partId)
            .then((res) => {
                setParticipante(res);
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    alert(t("Usuário não encontrado. (id: id)", { id: partId }));
                    navegar("/participantes");
                }
            });
    };

    const submitEdit = (e) => {
        e.preventDefault();

        Requests.putParticipante(participante)
            .then(() => {
                setEditing(false);
                alert(t("Tributo alterado com sucesso"));
            })
            .catch((err) => {
                console.log(err);
                alert(t("Erro ao tentar editar o tributo. Recarregue a página e tente novamente."));
            });
    };

    const clickEdit = () => {
        setEditing(true);
    };

    const clickDelete = () => {
        let confirmacao = window.prompt(
            t("Digite o nick do tributo (nick) para confirmar e deletar", { nick: participante.nick })
        );

        if (confirmacao !== participante.nick) return;

        Requests.deleteParticipante(partId)
            .then((res) => {
                alert(t("Tributo apagado com sucesso"));
                navegar("/participantes");
            })
            .catch((err) => {
                console.log(err);
                alert(t("Erro ao tentar deletar o tributo. Recarregue a página e tente novamente."));
            });
    };

    let winRate10 = participante.partidas10 >= 1 ? (participante.vitorias10 / participante.partidas10) * 100 : 0;
    let winRate25 = participante.partidas25 >= 1 ? (participante.vitorias25 / participante.partidas25) * 100 : 0;
    let winRate50 = participante.partidas50 >= 1 ? (participante.vitorias50 / participante.partidas50) * 100 : 0;

    useEffect(getParticipante, [t, navegar, partId]);

    return (
        <div>
            <h1>{t("Tributo #id: nick", { id: partId, nick: participante.nick || "" })}</h1>

            <div>
                <form onSubmit={submitEdit}>
                    <label>
                        <span>{t("Nome do tributo")}</span>
                        <input
                            type={"text"}
                            placeholder={t("Nome do tributo")}
                            disabled={!editing}
                            value={participante.nome || ""}
                            onChange={(e) => {
                                setParticipante((part) => {
                                    return { ...part, nome: e.target.value };
                                });
                            }}
                        />
                    </label>

                    <label>
                        <span>{t("Sobrenome do tributo")}</span>
                        <input
                            type={"text"}
                            placeholder={t("Sobrenome do tributo")}
                            disabled={!editing}
                            value={participante.sobrenome || ""}
                            onChange={(e) => {
                                setParticipante((part) => {
                                    return { ...part, sobrenome: e.target.value };
                                });
                            }}
                        />
                    </label>

                    <label>
                        <span>{t("Nick do tributo")}</span>
                        <input
                            type={"text"}
                            placeholder={t("Nick do tributo")}
                            disabled={!editing}
                            value={participante.nick || ""}
                            onChange={(e) => {
                                setParticipante((part) => {
                                    return { ...part, nick: e.target.value };
                                });
                            }}
                        />
                    </label>

                    <div>
                        {editing ? (
                            <>
                                <button key={1} type="submit">
                                    {t("Salvar tributo")}
                                </button>
                            </>
                        ) : (
                            <>
                                <button key={2} type="button" onClick={clickEdit}>
                                    {t("Editar tributo")}
                                </button>
                                <button key={3} type="button" onClick={clickDelete}>
                                    {t("Apagar tributo")}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            <div>
                <h2>{t("Estatísticas")}</h2>

                <table>
                    <caption>{t("Partidas com 10 a 24 tributos:")}</caption>
                    <tbody>
                        <tr>
                            <th>{t("Partidas")}</th>
                            <td>{participante.partidas10 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Vitórias")}</th>
                            <td>{participante.vitorias10 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Abates")}</th>
                            <td>{participante.kills10 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Taxa de vitória")}</th>
                            <td>{winRate10.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <th>{t("Maior sequência de abates")}</th>
                            <td>{participante.kill_streak10 || 0}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <caption>{t("Partidas com 25 a 49 tributos:")}</caption>
                    <tbody>
                        <tr>
                            <th>{t("Partidas")}</th>
                            <td>{participante.partidas25 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Vitórias")}</th>
                            <td>{participante.vitorias25 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Abates")}</th>
                            <td>{participante.kills25 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Taxa de vitória")}</th>
                            <td>{winRate25.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <th>{t("Maior sequência de abates")}</th>
                            <td>{participante.kill_streak25 || 0}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <caption>{t("Partidas com 50 ou mais tributos:")}</caption>
                    <tbody>
                        <tr>
                            <th>{t("Partidas")}</th>
                            <td>{participante.partidas50 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Vitórias")}</th>
                            <td>{participante.vitorias50 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Abates")}</th>
                            <td>{participante.kills50 || 0}</td>
                        </tr>
                        <tr>
                            <th>{t("Taxa de vitória")}</th>
                            <td>{winRate50.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <th>{t("Maior sequência de abates")}</th>
                            <td>{participante.kill_streak50 || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Participante;

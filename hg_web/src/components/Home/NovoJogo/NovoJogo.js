import { useEffect, useState } from "react";
import "./NovoJogo.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Requests from "../../../requests/Requests";

function NovoJogo() {
    const { t } = useTranslation();

    const animatedComponents = makeAnimated();

    const [nome, setNome] = useState();
    const [selecionados, setSelecionados] = useState([]);

    const [participantes, setParticipantes] = useState([]);

    const submitNovoJogo = (e) => {
        e.preventDefault();

        Requests.postJogo(nome, selecionados).then((res) => {});
    };

    useEffect(() => {
        Requests.getParticipantes()
            .then((parts) => {
                let optionsParts = parts.map((p) => {
                    return {
                        label: `${p.nick} (${p.nome})`,
                        value: p.id,
                    };
                });
                setParticipantes(optionsParts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <form onSubmit={submitNovoJogo}>
                <input
                    type={"text"}
                    placeholder={t("Nome da Partida")}
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value);
                    }}
                />

                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={participantes}
                    value={selecionados}
                    onChange={setSelecionados}
                    placeholder={t("Selecione os participantes da partida")}
                />

                <input type={"submit"} value={t("Criar Arena")} />
            </form>
        </div>
    );
}

export default NovoJogo;

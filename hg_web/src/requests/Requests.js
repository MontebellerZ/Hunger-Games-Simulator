import Axios from "axios";

const linkBackend = "http://localhost:3001";

class Requests {
    static async checkToken(token) {
        return await Axios.get(linkBackend + "/checkToken", {
            headers: { "x-access-token": token },
        }).then((res) => res.data);
    }

    static async login(email, senha) {
        return await Axios.get(linkBackend + "/login", {
            params: { email, senha },
        }).then((res) => res.data);
    }

    static async getParticipantes() {
        return await Axios.get(linkBackend + "/participantes").then((res) => res.data);
    }

    static async postParticipante(nome, sobrenome, nick) {
        return await Axios.post(linkBackend + "/participante", {
            nome,
            sobrenome,
            nick,
        }).then((res) => res.data);
    }

    static async getParticipante(partId) {
        return await Axios.get(linkBackend + "/participantes/" + partId).then((res) => res.data);
    }

    static async putParticipante(part) {
        return await Axios.put(linkBackend + "/participante", part).then((res) => res.data);
    }

    static async deleteParticipante(partId) {
        return await Axios.delete(linkBackend + "/participantes/" + partId).then((res) => res.data);
    }

    static async postJogo(nome, participantes) {
        return await Axios.post(linkBackend + "/jogo", {
            nome,
            participantes,
        }).then((res) => res.data);
    }
}

export default Requests;

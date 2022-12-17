import Axios from "axios";

const linkBackend = "http://localhost:3001";

class Requests {
    static async checkToken(token) {
        return await Axios.get(linkBackend + "/checkToken", { headers: { "x-access-token": token } }).then(
            (res) => res.data
        );
    }

    static async login(email, senha) {
        return await Axios.get(linkBackend + "/login", { params: { email, senha } }).then((res) => res.data);
    }
}

export default Requests;

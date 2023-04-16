const emailNodemailer = "mntzgames@outlook.com";
const senhaNodemailer = "mntz@31415#";

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("./secret/hash_criptografia.json");

const app = express();
const PORT = process.env.PORT || 3001;

const connect = () => {
    const con = mysql.createConnection({
        host: "127.0.0.1",
        port: "3306",
        user: "hg_directy",
        password: "corvo",
        database: "hg_directy",
    });
    con.connect((err) => {
        if (err) console.log(err);
        else console.log("Conectado ao banco de dados.");
    });
    return con;
};

app.use(bodyParser.json({ limit: "2024mb" }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        type: "application/json",
        limit: "2024mb",
    })
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", ["Content-Type", "x-access-token"]);
    next();
});

function dateToString(datahora, formato = null) {
    let dia = datahora.getDate().toString().padStart(2, "0");
    let mes = (datahora.getMonth() + 1).toString().padStart(2, "0");
    let ano = datahora.getFullYear().toString().padStart(4, "0");
    let hora = datahora.getHours().toString().padStart(2, "0");
    let minuto = datahora.getMinutes().toString().padStart(2, "0");
    let segundo = datahora.getSeconds().toString().padStart(2, "0");

    switch (formato) {
        case "yyyy/mm/dd":
            return `${ano}/${mes}/${dia} ${hora}:${minuto}:${segundo}`;
        case "yyyy-mm-dd":
            return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

        case "dd/mm/yyyy":
            return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
        case "dd-mm-yyyy":
            return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;

        default:
            return `${ano}/${mes}/${dia} ${hora}:${minuto}:`;
    }
}

function codigoAleatorioAlphaNum(tamanho = 10) {
    let firstAscii = 32;
    let lastAscii = 127;

    let novaSenha = [];
    for (let i = 0; i < tamanho; i++) {
        novaSenha.push(Math.floor(Math.random() * (lastAscii - firstAscii - 1)) + firstAscii + 1);
    }

    return String.fromCharCode(...novaSenha);
}

function codigoAleatorioHex(tamanho = 10) {
    return crypto.randomBytes(Math.ceil(tamanho / 2)).toString("hex");
}

async function hashSenha(senha) {
    return await bcrypt.hash(senha, 8).catch((err) => {
        throw err;
    });
}

async function randomHashSenha(tamanho = 10) {
    let novaSenha = codigoAleatorioHex(tamanho);

    return {
        senha: novaSenha,
        hash: await hashSenha(novaSenha),
    };
}

function extractB64(data64) {
    // Extraindo a extensão do arquivo da string completa
    const extensao = data64.substring(data64.indexOf("/") + 1, data64.indexOf(";base64"));

    // Extraindo base64 da string completa
    const fileType = data64.substring("data:".length, data64.indexOf("/"));
    const regex = new RegExp(`^data:${fileType}\/${extensao};base64,`, "gi");

    return data64.replace(regex, "");
}

function createToken(email, senha) {
    return jwt.sign({ email, senha }, secret.hash, {
        expiresIn: "2h", // expires in 8h
    });
}

function validateToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
        res.status(400).send("Token não foi enviado na requisição.");
        return;
    }

    jwt.verify(token, secret.hash, (err, decoded) => {
        if (err) {
            res.status(401).send("Token de autenticação inválido.");
            return;
        }

        req.email = decoded.email;
        req.senha = decoded.senha;
        next();
    });
}

app.get("/teste", (req, res) => {
    res.send("testado");
});

app.get(`/login`, (req, res) => {
    let inputEmail = req.query.email;
    let inputSenha = req.query.senha;

    let con = connect();

    con.query("SELECT u.senha FROM usuarios AS u WHERE (?)=u.email", [inputEmail], (err, rows) => {
        if (!err) {
            if (rows.length === 1) {
                let hashSenha = rows[0].senha;

                bcrypt.compare(inputSenha, hashSenha, (err, resp) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Erro inesperado.");
                    } else {
                        if (resp) {
                            con.query(
                                `SELECT id, nome, email
                                        FROM usuarios AS u 
                                        WHERE '${inputEmail}'=u.email`,
                                (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send("Erro inesperado.");
                                    } else {
                                        let usuarioBanco = JSON.parse(JSON.stringify(rows[0]));
                                        usuarioBanco.token = createToken(inputEmail, inputSenha);
                                        res.send(usuarioBanco);
                                    }
                                }
                            );
                        } else {
                            res.status(404).send("Login ou senha inválidos.");
                        }
                    }
                });
            } else if (rows.length < 1) {
                res.status(404).send("Login ou senha inválidos.");
            } else {
                res.status(500).send("Erro inesperado.");
            }
        } else {
            console.log(err);
            res.status(500).send("Erro inesperado.");
        }
    });

    con.end();
});

app.get(`/checkToken`, validateToken, (req, res) => {
    let inputEmail = req.email;
    let inputSenha = req.senha;

    con.query(
        `SELECT u.senha
            FROM usuarios AS u 
            WHERE '${inputEmail}'=u.email`,
        (err, rows) => {
            if (!err) {
                if (rows.length === 1) {
                    let hashSenha = rows[0].senha;

                    bcrypt.compare(inputSenha, hashSenha, (err, resp) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Erro inesperado.");
                        } else {
                            if (resp) {
                                con.query(
                                    `SELECT id, nome, email
                                        FROM usuarios AS u 
                                        WHERE '${inputEmail}'=u.email`,
                                    (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send("Erro inesperado.");
                                        } else {
                                            let usuarioBanco = JSON.parse(JSON.stringify(rows[0]));
                                            usuarioBanco.token = createToken(inputEmail, inputSenha);
                                            res.send(usuarioBanco);
                                        }
                                    }
                                );
                            } else {
                                res.status(404).send("Sua senha foi alterada. Por favor, faça o login novamente.");
                            }
                        }
                    });
                } else if (rows.length < 1) {
                    res.status(404).send("Email não existe mais.");
                } else {
                    res.status(500).send("Erro inesperado.");
                }
            } else {
                console.log(err);
                res.status(500).send("Erro inesperado.");
            }
        }
    );
});

app.get(`/requerirSenha`, (req, res) => {
    try {
        let email = req.query.email;

        randomHashSenha(12).then(({ hash: hashAleatorio, senha: novaSenha }) => {
            con.query(
                `UPDATE usuarios AS u 
                    SET u.senha='${hashAleatorio}'
                    WHERE u.email='${email}'`,
                (err, rows) => {
                    if (!err) {
                        if (rows.affectedRows === 1) {
                            let transporter = nodemailer.createTransport({
                                service: "Outlook365",
                                auth: {
                                    user: emailNodemailer,
                                    pass: senhaNodemailer,
                                },
                            });

                            let mailOptions = {
                                from: emailNodemailer,
                                to: email,
                                subject: "Redefinição de Senha - HG",
                                html: `
                                        <p>Seu pedido de redefinição de senha foi atendido.</p>
                                        <p>Nova senha: <b>${novaSenha}</b></p>
                                    `,
                            };

                            transporter.sendMail(mailOptions, (err) => {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log(`Email enviado para: ${email}`);
                                    res.send("Senha alterada com sucesso!");
                                }
                            });
                        } else {
                            res.status(404).send("Nenhum email relacionado encontrado.");
                        }
                    } else {
                        throw err;
                    }
                }
            );
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro inesperado, contate o administrador do sistema.");
    }
});

app.put(`/alterarSenha`, validateToken, (req, res) => {
    try {
        let email = req.body.email;

        hashSenha(req.body.novaSenha).then((hashNovaSenha) => {
            con.query(
                `UPDATE usuarios AS u 
                    SET u.senha='${hashNovaSenha}'
                    WHERE u.email='${email}'`,
                (err, rows) => {
                    if (!err) {
                        if (rows.affectedRows === 1) {
                            let transporter = nodemailer.createTransport({
                                service: "Outlook365",
                                auth: {
                                    user: emailNodemailer,
                                    pass: senhaNodemailer,
                                },
                            });

                            let mailOptions = {
                                from: emailNodemailer,
                                to: email,
                                subject: "Alteração de Senha - HG",
                                html: `
                                <p>Sua senha foi alterada com sucesso.</p>
                            `,
                            };

                            transporter.sendMail(mailOptions, (err) => {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log(`Email enviado para: ${email}`);
                                    res.send("Senha alterada com sucesso!");
                                }
                            });
                        } else {
                            res.status(404).send("Nenhum email relacionado encontrado.");
                        }
                    } else {
                        throw err;
                    }
                }
            );
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro inesperado, contate o administrador do sistema.");
    }
});

app.post("/jogo", (req, res) => {
    try {
        let con = connect();

        let nome = req.body.nome;
        let participantes = req.body.participantes;

        if (nome.length < 4) {
            res.status(400).send("Nome precisa ser uma string com pelo menos 4 caracteres");
            return;
        }

        if (!Array.isArray(participantes) || participantes.length < 10 || participantes.length > 100) {
            res.status(400).send(
                "Lista de participantes precisa ser um array com pelo menos 10 posições e no máximo 100"
            );
            return;
        }

        let queryNovoJogo = "INSERT INTO jogos (nome, qtd_participantes) VALUES (?, ?)";

        con.query(queryNovoJogo, [nome, participantes.length], (err, rows) => {
            if (err) throw err;

            let insertedGameId = rows.insertId;

            if (Number.isNaN(insertedGameId)) {
                res.status(500).send("Erro inesperado");
            }

            let queryParticipantesJogo = "INSERT INTO participantes_jogo (jogo_id, participante_id) VALUES ?";

            let participantesArgument = participantes.map((p) => {
                return [insertedGameId, p];
            });

            con.query(queryParticipantesJogo, [participantesArgument], (err, rows) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.send(rows);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post("/participante", (req, res) => {
    try {
        let nomeParticipante = req.body.nome;
        let sobrenomeParticipante = req.body.sobrenome;
        let nickParticipante = req.body.nick;

        let con = connect();

        if (!nomeParticipante) {
            res.status(401).send("Nome precisa ser uma ou mais palavras");
            return;
        }

        let queryNovoParticipante = "INSERT INTO participantes (nome, sobrenome, nick) VALUES (?, ?, ?)";

        con.query(queryNovoParticipante, [nomeParticipante, sobrenomeParticipante, nickParticipante], (err, rows) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(401).send("Combinação de nome e sobrenome já existente.");
                    return;
                }

                res.status(500).send(err);
                return;
            }

            if (rows.affectedRows !== 1) {
                res.status(500).send("Erro inesperado");
                return;
            }

            let insertId = rows.insertId;

            if (Number.isNaN(insertId)) {
                res.status(500).send("Erro inesperado");
                return;
            }

            res.send(insertId.toString());
        });

        con.end();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/participantes", (req, res) => {
    try {
        let con = connect();

        let queryGetParticipantes = `
            SELECT 
                id, 
                nome, 
                sobrenome, 
                nick, 
                foto
            FROM 
                participantes 
            ORDER BY
                nick;
            `;

        con.query(queryGetParticipantes, (err, rows) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.send(rows);
        });

        con.end();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/participantes/:id", (req, res) => {
    try {
        let partId = req.params.id;

        if (isNaN(partId)) {
            res.status(400).send("Id do participante deve ser um número");
            return;
        }

        let con = connect();

        let queryGetParticipantes = `
            SELECT 
                id,
                nome,
                sobrenome,
                nick,
                foto,
                partidas10,
                vitorias10,
                kills10,
                kill_streak10,
                partidas25,
                vitorias25,
                kills25,
                kill_streak25,
                partidas50,
                vitorias50,
                kills50,
                kill_streak50
            FROM 
                participantes 
            WHERE
                id = (?);
            `;

        con.query(queryGetParticipantes, [partId], (err, rows) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (rows.length !== 1) {
                res.status(404).send("Id enviado não corresponde a nenhum participante");
                return;
            }

            res.send(rows[0]);
        });

        con.end();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.put("/participante", (req, res) => {
    try {
        let { id: partId, nome, sobrenome, nick, foto } = req.body;

        if (isNaN(partId)) {
            res.status(400).send("Id do participante deve ser um número");
            return;
        }

        let con = connect();

        let queryGetParticipantes = `
            UPDATE
                participantes
            SET
                nome = (?),
                sobrenome = (?),
                nick = (?),
                foto = (?)
            WHERE
                id = (?)
            `;

        con.query(queryGetParticipantes, [nome, sobrenome, nick, foto, partId], (err, rows) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (rows.affectedRows !== 1) {
                res.status(404).send("Id enviado não corresponde a nenhum participante");
                return;
            }

            res.send();
        });

        con.end();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.delete("/participantes/:id", (req, res) => {
    try {
        let partId = req.params.id;

        if (isNaN(partId)) {
            res.status(400).send("Id do participante deve ser um número");
            return;
        }

        let con = connect();

        let queryGetParticipantes = `
            DELETE FROM
                participantes
            WHERE
                id = ?
            `;

        con.query(queryGetParticipantes, [partId], (err, rows) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (rows.affectedRows !== 1) {
                res.status(404).send("Id enviado não corresponde a nenhum participante");
                return;
            }

            res.send();
        });

        con.end();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// setInterval(() => {
//     con.query(`SELECT 1`, (err, rows) => {
//         // console.log("Preventing disconnect.");
//     });
// }, 60000);

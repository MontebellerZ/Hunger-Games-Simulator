CREATE DATABASE IF NOT EXISTS hg_directy;
USE hg_directy;

CREATE TABLE IF NOT EXISTS usuarios(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS participantes(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL,
    sobrenome VARCHAR(40) DEFAULT "",
    nick VARCHAR(40) UNIQUE NOT NULL,
    foto BLOB DEFAULT NULL,
    partidas10 INT NOT NULL DEFAULT 0,
    vitorias10 INT NOT NULL DEFAULT 0,
    kills10 INT NOT NULL DEFAULT 0,
    kill_streak10 INT NOT NULL DEFAULT 0,
    partidas25 INT NOT NULL DEFAULT 0,
    vitorias25 INT NOT NULL DEFAULT 0,
    kills25 INT NOT NULL DEFAULT 0,
    kill_streak25 INT NOT NULL DEFAULT 0,
    partidas50 INT NOT NULL DEFAULT 0,
    vitorias50 INT NOT NULL DEFAULT 0,
    kills50 INT NOT NULL DEFAULT 0,
    kill_streak50 INT NOT NULL DEFAULT 0,
    UNIQUE `unique_index`(`nome`, `sobrenome`)
);

CREATE TABLE IF NOT EXISTS jogos(
	id INT PRIMARY KEY AUTO_INCREMENT,
    criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nome VARCHAR(255) DEFAULT NULL,
    qtd_participantes INT NOT NULL
);

CREATE TABLE IF NOT EXISTS participantes_jogo(
	id INT PRIMARY KEY AUTO_INCREMENT,
    jogo_id INT NOT NULL,
    participante_id INT NOT NULL,
    vitoria BOOLEAN NOT NULL DEFAULT FALSE,
    kills INT NOT NULL DEFAULT 0,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
);

/*
ALTER TABLE participantes MODIFY foto BLOB DEFAULT NULL AFTER nick;
ALTER TABLE participantes ADD partidas25 INT NOT NULL DEFAULT 0;
ALTER TABLE participantes RENAME COLUMN kill_streak TO kill_streak10;

DESCRIBE participantes;

DROP TABLE participantes;
DROP TABLE participantes_jogo;

ALTER TABLE `table_name` DROP FOREIGN KEY `id_name_fk`;

SELECT * FROM jogos;
SELECT * FROM participantes;
SELECT * FROM usuarios;

DELETE FROM jogos WHERE id>0;
DELETE FROM participantes WHERE id>0;
DELETE FROM participantes_jogo WHERE id>0;

UPDATE participantes SET nick = "MontebellerZ" WHERE id=1;

INSERT INTO usuarios VALUES(0, "Filipe Montebeller", "vyatrhjar@gmail.com", "1234");

CREATE USER 'hg_directy'@'localhost' IDENTIFIED WITH mysql_native_password BY 'corvo';
GRANT ALL PRIVILEGES ON hg_directy.* TO 'hg_directy'@'localhost';
FLUSH PRIVILEGES;

DROP DATABASE hg_directy;
*/


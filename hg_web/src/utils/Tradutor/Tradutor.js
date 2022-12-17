const langs = {
    pt: require("./Dicionario/pt.json"),
    en: require("./Dicionario/en.json"),
};

class Tradutor {
    static lang = "pt";

    /**
     * Retorna a linguagem selecionada atualmente
     * @returns string correspondente à linguagem selecionada
     */
    static getSelectedLang() {
        return this.lang;
    }

    /**
     * Retorna todas as linguagens disponíveis no dicionário
     * @returns vetor de strings com todas as linguagens disponíveis
     */
    static getLangs() {
        return Object.keys(langs);
    }

    /**
     * Checks if the specified language is available on the dictionary
     * @param {string} lg key to the dictionary
     * @returns true if available, false otherwise
     */
    static verificarLinguagem(lg) {
        return this.getLangs().includes(lg);
    }

    /**
     * Changes the language that the dictionary is actually using
     * @param {string} lg key to change the dictionary language into
     * @returns true if the language was available and changed, false otherwise
     */
    static mudarLinguagem(lg) {
        if (!this.verificarLinguagem(lg)) return false;

        this.lang = lg;
        return true;
    }

    /**
     * Gets the word/string in the current set language
     * @param {string} chave key to return the translated word/string
     * @returns the word/string translated
     */
    static t(chave) {
        let traducao = langs[this.lang][chave];
        return traducao ? traducao : chave;
    }
}

export default Tradutor;

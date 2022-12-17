/**
 * @typedef {Object} Acao
 * @property {string} texto - texto da ação
 * @property {number} participantes - quantidade de participantes da ação
 */

/**
 * @typedef {Object} Acoes
 * @property {Acao[]} inicio - vetor de ações do turno "inicio"
 * @property {Acao[]} dia - vetor de ações do turno "dia"
 * @property {Acao[]} noite - vetor de ações do turno "noite"
 * @property {Acao[]} banquete - vetor de ações do turno "banquete"
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

/**
 * Start browser and page references, sets up the game configs and proceeds to the initial game page
 * @returns browser and page references
 * @author Filipe Montebeller Rocha
 */
async function start() {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const pags = await browser.pages();
    const page = pags[0];

    await page.goto("http://brantsteele.net/hungergames/reaping.php");

    const [iAm13OrOlder] = await page.$x(
        "//a[contains(text(), 'I am 13 years or older. I have read and understand these terms.')]"
    );

    if (iAm13OrOlder) {
        await iAm13OrOlder.click();

        await page.waitForNavigation();
    }

    const [editCast] = await page.$x("//a[contains(., 'Edit Cast')]");

    await editCast.click();

    await page.waitForNavigation();

    await page.evaluate(() => {
        for (let i = 0; i < 24; i++) {
            let id = (i + 1).toString().padStart(2, "0");
            let input = document.getElementById(`cusTribute${id}`);
            input.value = id;
        }

        document.getElementsByClassName("MakeEvictedNames")[0].click();
        document.getElementsByClassName("MakeEvictedSkip")[0].click();
    });

    const submitEditCast = await page.waitForSelector("input[type='submit']");

    await submitEditCast.click();

    await page.waitForNavigation();

    return { browser, page };
}

/**
 *
 * @param {puppeteer.ElementHandle<Element>} getContent
 * @returns text in element
 */
async function readElementText(getContent) {
    return await getContent.evaluate((el) => el.innerHTML);
}

/**
 *
 * @param {puppeteer.Page} page
 */
async function readActionLines(page, startLine = 0, endLine = -1) {
    const getContent = await page.waitForSelector("#content");

    const contentText = await readElementText(getContent);

    const contentLines = contentText
        .replace(/(<strong>|<font color="fb8200">|<\/font>|<\/strong>)/g, "")
        .split("<br>")
        .slice(startLine, endLine)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    return contentLines;
}

/**
 *
 * @param {puppeteer.Browser} browser
 * @param {puppeteer.Page} page
 */
async function play(browser, page, runs = 1) {
    let acoes = {
        inicio: [],
        dia: [],
        noite: [],
        banquete: [],
    };

    for (let i = 0; i < runs; i++) {
        let horaInicio = new Date();

        const [proceedTheReaping] = await page.$x("//a[contains(., 'Proceed.')]");

        await proceedTheReaping.click();

        await page.waitForNavigation();

        while (true) {
            let titleElement = (await page.$x("//div[@id='title']"))[1];
            let titleText = await readElementText(titleElement);

            if (titleText.includes("Statistics")) break;

            let actionTime;
            let startLine = 0;

            switch (true) {
                case titleText.includes("The Bloodbath"):
                    actionTime = "inicio";
                    startLine = 1;
                    break;
                case titleText.includes("Day"):
                    actionTime = "dia";
                    break;
                case titleText.includes("Night"):
                    actionTime = "noite";
                    break;
                case titleText.includes("The Feast"):
                    actionTime = "banquete";
                    startLine = 1;
                    break;
                // case titleText.includes("Arena Event"):
            }

            if (actionTime) acoes[actionTime].push(...(await readActionLines(page, startLine)));

            let [proceedRound] = await page.$x("//a[contains(., 'Proceed.')]");

            await proceedRound.click();

            await page.waitForNavigation();
        }

        const [simulateAgain] = await page.$x("//a[contains(., 'Simulate Again!')]");

        await simulateAgain.click();

        await page.waitForNavigation();

        console.log(
            `${i + 1}/${runs} -> (${Math.round(((i + 1) / runs) * 10000) / 100}%)\t\t${
                (new Date() - horaInicio) / 1000
            }s`
        );
    }

    return acoes;
}

/**
 *
 * @param {string[]} linhas
 * @returns
 */
function getDiferentes(linhas) {
    return linhas
        .map((l) => {
            let lSplit = l.split(" ").filter((l) => l.length > 0);

            let ps = [];

            for (let i = 0; i < lSplit.length; i++) {
                let lsi = lSplit[i].replace(/[,.'a-zA-Z]/g, "");

                if (lsi.length <= 0 || isNaN(lsi)) {
                    continue;
                }

                let f = ps.findIndex((p) => p === lsi);

                if (f < 0) {
                    ps.push(lsi);
                    lSplit[i] = lSplit[i].replace(lsi, `\${p${ps.length - 1}}`);
                } else {
                    lSplit[i] = lSplit[i].replace(lsi, `\${p${f}}`);
                }
            }

            let texto = lSplit.join(" ");

            if (texto === "${p0} and ${p1} fight ${p2} and ${p3}. ${p2} and ${p4} survive.") {
                console.log("encontrado:", l);
            }

            return { texto: { en: texto }, participantes: ps.length };
        })
        .filter((l, i, v) => l.texto.en.length > 0 && v.findIndex((lv) => lv.texto.en === l.texto.en) === i)
        .sort((a, b) => a.texto.en.localeCompare(b.texto.en));
}

/**
 *
 * @returns {Acoes}
 */
function getJson() {
    return JSON.parse(fs.readFileSync("./acoes.json"));
}

/**
 *
 * @param {Acoes} acoesPlay
 */
function writeActionsJson(acoesPlay) {
    const acoesJson = getJson();

    const playInicio = getDiferentes(acoesPlay.inicio);
    const playDia = getDiferentes(acoesPlay.dia);
    const playNoite = getDiferentes(acoesPlay.noite);
    const playBanquete = getDiferentes(acoesPlay.banquete);

    const allInicio = [...acoesJson.inicio, ...playInicio].filter(
        (p, i, v) => v.findIndex((pv) => pv.texto.en === p.texto.en) === i
    );
    const allDia = [...acoesJson.dia, ...playDia].filter(
        (p, i, v) => v.findIndex((pv) => pv.texto.en === p.texto.en) === i
    );
    const allNoite = [...acoesJson.noite, ...playNoite].filter(
        (p, i, v) => v.findIndex((pv) => pv.texto.en === p.texto.en) === i
    );
    const allBanquete = [...acoesJson.banquete, ...playBanquete].filter(
        (p, i, v) => v.findIndex((pv) => pv.texto.en === p.texto.en) === i
    );

    const newInicio = allInicio.sort((a, b) => a.texto.en.localeCompare(b.texto.en));
    const newDia = allDia.sort((a, b) => a.texto.en.localeCompare(b.texto.en));
    const newNoite = allNoite.sort((a, b) => a.texto.en.localeCompare(b.texto.en));
    const newBanquete = allBanquete.sort((a, b) => a.texto.en.localeCompare(b.texto.en));

    let acoes = {
        inicio: newInicio,
        dia: newDia,
        noite: newNoite,
        banquete: newBanquete,
    };

    console.log(
        "Resumo:",
        Object.entries(acoes)
            .map((e) => `${e[0]}: ${e[1].length}`)
            .join(",\t")
    );

    fs.writeFileSync("./acoes.json", JSON.stringify(acoes, null, 4));
}

async function main() {
    let runs = 2;

    let { browser, page } = await start();

    let acoes = await play(browser, page, runs);

    await browser.close();

    writeActionsJson(acoes);
}

main();

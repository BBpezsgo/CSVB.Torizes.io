const sharp = require('sharp')
const fs = require('fs');
const path = require('path');

/**
 * @param {string} input
 * @param {string} output
 */
function GenerateMetadata(input, output) {
    return new Promise(async (resolve, reject) => {
        const metadata = await sharp(input).metadata()
        if (!metadata) { reject('Bruh'); return }

        /** @type {import('./src/card-metadata')} */
        const yes = {
            width: metadata.width,
            height: metadata.height,
            extension: path.extname(input).replace('.', ''),
        }
        fs.writeFileSync(output, JSON.stringify(yes), 'utf8')
        resolve(null)
    })
}

(async () => {
    /** @type {{ [id: string]: import('./src/articles').Article }} */
    const articles = JSON.parse(fs.readFileSync('./docs/database/articles.json', 'utf8'))
    for (const articleId in articles) {
        const articleFolder = `./docs/articles/${articleId}`
        if (fs.existsSync(`${articleFolder}/card.jpg`))
        { await GenerateMetadata(`${articleFolder}/card.jpg`, `${articleFolder}/card.json`) }
        else if (fs.existsSync(`${articleFolder}/card.png`))
        { await GenerateMetadata(`${articleFolder}/card.png`, `${articleFolder}/card.json`) }
    }
})()
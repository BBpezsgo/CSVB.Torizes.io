const fs = require("fs")
const pngToJpeg = require('png-to-jpeg')

/**
 * @param {string} input
 * @param {string} output
 * @returns {Promise<void>}
 */
function ConvertImage(input, output) {
    return new Promise((resolve, reject) => {
        const buffer = fs.readFileSync(input)

        const converter = pngToJpeg({ quality: 100 })
        if (typeof converter === 'function') {
            converter(buffer)
                .then(data => {
                    fs.writeFileSync(output, data)
                    resolve()
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
        } else {
            console.error('wtf')
            reject(new Error('wtf'))
        }
    })
}

(async () => {
    /** @type {{ [id: string]: import('./src/articles').Article }} */
    const articles = JSON.parse(fs.readFileSync('./docs/database/articles.json', 'utf8'))
    for (const articleId in articles) {
        const articleFolder = `./docs/articles/${articleId}`
        if (fs.existsSync(`${articleFolder}/card.png`))
        {
            await ConvertImage(`${articleFolder}/card.png`, `${articleFolder}/card.jpg`)
        }
    }
})()
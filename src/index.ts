import { Article } from './articles'
import * as HTTP from './http'
import * as Utilities from './utilities'

declare global {
    interface Window {
        
    }
}

function EscapeHtml(unsafe: string)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

async function LoadArticle(articleId: string) {
    console.log(`Article \"${articleId}\" is loading ...`)
    const article = articles[articleId]
    
    Utilities.TemplateAsyncRaw(`articles/${articleId}`, { })
        .then(element => {
            Utilities.GetElement('article').outerHTML = element
            console.log(`Article \"${articleId}\" loaded`)
        })
        .catch(console.error)
    
    if (article.ImageSources) {
        const imageSourcesConatiner = Utilities.GetElement('image-sources')
        for (const imageId in article.ImageSources) {
            const imageSource = article.ImageSources[imageId]
            if (typeof imageSource === 'object') {
                const newElement = document.createElement('li')
                newElement.innerHTML = `<a href="${imageSource.Url.replace('"', '\\"')}" target="_blank">${EscapeHtml(imageSource.Label)}</a>`
                imageSourcesConatiner.appendChild(newElement)
            } else {
                const newElement = document.createElement('li')
                newElement.innerHTML = EscapeHtml(imageSource)
                imageSourcesConatiner.appendChild(newElement)
            }
        }
    }
}

const articles = JSON.parse(HTTP.Get(Utilities.BasePath() + 'database/articles.json')) as { [article: string]: Article }

async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length - 1]

    const articlesList = Utilities.GetElement('articles-list') as HTMLUListElement
    articlesList.innerHTML = ''

    for (const articleId in articles) {
        const article = articles[articleId] as Article
        const newElement = document.createElement('li')
        newElement.innerHTML = `<a href="${Utilities.BasePath()}articles/base.html#${articleId}">${article.Name}</a>`
        articlesList.appendChild(newElement)
    }

    window.addEventListener('hashchange', (e) => {
        const uri = new URL(e.newURL)
        LoadArticle(uri.hash.replace('#', '').trim())
    })

    if (window.location.pathname.endsWith('/articles/base.html')) {
        LoadArticle(window.location.hash.replace('#', '').trim())
    }
}

document.addEventListener('DOMContentLoaded', () => { Main() })

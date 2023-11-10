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

function ShowArticleList() {
    const articlesList = Utilities.GetElement('articles-list') as HTMLElement
    articlesList.innerHTML = ''

    for (const articleId in articles) {
        const article = articles[articleId] as Article
        const newElement = document.createElement('div')
        newElement.classList.add('card')
        let htmlBuilder = ''
        htmlBuilder += `<a href="${Utilities.BasePath()}articles/base.html#${articleId}" class="hidden-link">`
        htmlBuilder += `<div class="card-top" id="card1-top">`
        htmlBuilder += `<div class="card-theme">${article.Group}</div>`
        htmlBuilder += `<div class="card-image"><img src="./img/cards/${articleId}.jpg"></div>`
        htmlBuilder += `</div>`
        htmlBuilder += `<div class="card-bottom" id="card1-bottom">`
        htmlBuilder += `<div class="card-year" id="card1-year">2023</div>`
        htmlBuilder += ` <div class="card-name" id="card1-name"><h1>${article.Name}</h1></div>`
        htmlBuilder += `</div>`
        htmlBuilder += `</a>`
        newElement.innerHTML = htmlBuilder
        articlesList.appendChild(newElement)
    }
}

async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length - 1]

    try {
        ShowArticleList()
    } catch (error) {
        console.warn(error)
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

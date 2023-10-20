import { Article } from './articles'
import * as HTTP from './http'
import * as Utilities from './utilities'

declare global {
    interface Window {
        
    }
}

async function LoadArticle(article: string) {
    console.log(`Article \"${article}\" is loading ...`)
    Utilities.TemplateAsyncRaw(`articles/${article}`, { })
        .then(element => {
            Utilities.GetElement('article').outerHTML = element
            console.log(`Article \"${article}\" loaded`)
        })
        .catch(console.error)
}

async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length - 1]

    const articles = JSON.parse(HTTP.Get('/database/articles.json'))

    const articlesList = Utilities.GetElement('articles-list') as HTMLUListElement
    articlesList.innerHTML = ''

    for (const articleId in articles) {
        const article = articles[articleId] as Article
        const newElement = document.createElement('li')
        newElement.innerHTML = `<a href="/articles/base.html#${articleId}">${article.Name}</a>`
        articlesList.appendChild(newElement)
    }

    window.addEventListener('hashchange', (e) => {
        const uri = new URL(e.newURL)
        LoadArticle(uri.hash.replace('#', '').trim())
    })

    if (window.location.pathname === '/articles/base.html') {
        LoadArticle(window.location.hash.replace('#', '').trim())
    }
}

document.addEventListener('DOMContentLoaded', () => { Main() })

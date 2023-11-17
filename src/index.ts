import { Article } from './articles'
import * as HTTP from './http'
import * as Utilities from './utilities'
import * as Timeline from './timeline'
import * as Time from './big-date'

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
    
    const titleSpan = Utilities.TryGetElement('article-title')
    if (titleSpan) {
        titleSpan.textContent = article.Name
    }

    document.title = `${article.Name} - Törizés`
    
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

type Range<T> = { start: T, end: T }

const articleTimelineLookup: { dates: string[], ranges: string[] } = {
    dates: [],
    ranges: [],
}

const articleTimeline: { points: Timeline.TimelinePoint[], ranges: Timeline.TimelineInterval[] } = {
    points: [],
    ranges: [],
}

for (const articleId in articles) {
    const article = articles[articleId]
    const time = article.Time
    if (typeof time === 'string') {
        const pointTime = Time.Parse(time)

        articleTimelineLookup.dates.push(articleId)
        articleTimeline.points.push({
            date: pointTime,
            label: article.Name,
        })
    } else {
        const start = Time.Parse(time.Start)
        const end = Time.Parse(time.End)
        const rangeTime = { start, end }
        
        articleTimelineLookup.ranges.push(articleId)
        articleTimeline.ranges.push({
            interval: rangeTime,
            label: article.Name,
        })
    }
}

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

function OnTimelineDateClick(index: number) {
    const articleId = articleTimelineLookup.dates[index]
    OnTimelineArticleClick(articleId)
}

function OnTimelineRangeClick(index: number) {
    const articleId = articleTimelineLookup.ranges[index]
    OnTimelineArticleClick(articleId)
}

function OnTimelineArticleClick(articleId: string) {
    console.log('Clicked on article', articleId)
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

    if (Utilities.TryGetElement('lineCont')) {
        console.log('Show timeline')
        Timeline.Show(articleTimeline.points, articleTimeline.ranges, OnTimelineDateClick, OnTimelineRangeClick)
    }
}

document.addEventListener('DOMContentLoaded', () => { Main() })

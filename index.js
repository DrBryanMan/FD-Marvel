import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import * as Template from './templates.js'

const router = new Navigo('/', { hash: true })

router
    .on('/articles/characters/:character', ({ data }) => {
        renderPage('characters', data.character)
    })
    .on('/articles/comics/:comics', ({ data }) => {
        const comics_name = data.comics.split(' Том')[0] // Дивовижна Людина-павук
        let vol = data.comics.split('Том ')[1] // 1_1 або 1
        let issue
        if (vol.length > 1) {
            [vol, issue] = vol.split(' ')
            console.log(vol, issue)
            renderPageData('issue', data.comics, comics_name, vol, issue)
        } else {
            renderPageData('comics', data.comics, comics_name, vol)
        }
    })
    .resolve()

async function loadFile(path) {
    console.log(path)
    try {
        const response = await fetch(path)
        if (!response.ok) throw new Error('Файл не найден')
        return await response.text()
    } catch (error) {
        console.error('Ошибка загрузки файла:', error)
        return null
    }
}

async function loadData(category, pagename, comics_name, vol, issue) {
    let jsonPath
    let mdPath
    if (vol) {
        if (issue) {
            mdPath = `/articles/comics/${comics_name}/${comics_name} Том ${vol} ${issue}.md`
        } else {
            mdPath = `/articles/comics/${comics_name}/${comics_name} Том ${vol}.md`
        }
        jsonPath = `/articles/comics/${comics_name}/${comics_name} Том ${vol}.json`
    } else {
        jsonPath = `/articles/${category}/${pagename}.json`
        mdPath = `/articles/${category}/${pagename}.md`
    }
    
    const [jsonData, markdownContent] = await Promise.all([
        loadFile(jsonPath),
        loadFile(mdPath)
    ])
    return [jsonData, markdownContent]
}

function creatPageHeader(pagename, comics_name, vol, issue) {
    const page = document.getElementById('page')
    const pageHeader = document.createElement('div')
    pageHeader.id = 'pageHeader'
    pageHeader.innerHTML = `
        <div>Категорії: ${comics_name}</div>
        <h1>${pagename}</h1>
        <h2><i>${pagename}</i></h2>
        <hr>
    `
    page.prepend(pageHeader)
}

async function renderPageData(category, pagename, comics_name, vol, issue) {
    console.log('comics_name:', comics_name)
    let [ pageData, pageContent ] = await loadData(category, pagename, comics_name, vol, issue)
    pageData = JSON.parse(pageData)
    page.innerHTML = '<p>Завантаження...</p>'

    if (pageContent) {
        page.innerHTML = marked.parse(pageContent)
    } else {
        page.innerHTML = '<p>Інформація відсутня.</p>'
    }
    switch (category) {
        case 'comics':
            Template.Comics(pageData, pagename, comics_name, vol)
            Template.ComicsList(pageData, pagename, comics_name, vol)
            break
            
            case 'issue':
            Template.Issue(pageData, pagename, comics_name, vol, issue)
            break
    }
    creatPageHeader(pagename, comics_name, vol, issue)
}

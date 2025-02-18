function formatDate(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatMonthYear(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
}

export function Character(data, pagename) {
    const infoboxDiv = document.createElement('div')
    infoboxDiv.className = 'character-infobox infobox'

    infoboxDiv.innerHTML = `
        <h3>${data.title || 'Нет заголовка'}</h3>
        <p><strong>Автор:</strong> ${data.author || 'Неизвестен'}</p>
        <p><strong>Дата:</strong> ${data.date || 'Не указана'}</p>
        <p><strong>Описание:</strong> ${data.description || 'Нет описания'}</p>
    `
    return infoboxDiv
}

// Додайте цю функцію для перевірки існування файлу
async function checkFileExists(path) {
    try {
        const response = await fetch(path)
        return response.ok
    } catch (error) {
        return false
    }
}

export async function ComicsList(data, pagename, comics_name, vol) {
    const comicsList = document.createElement('div')
    comicsList.className = 'comics-list'
    page.append(comicsList)
    const issues = data[vol]
    
    // Створюємо масив промісів для перевірки всіх файлів
    // const checkPromises = issues.map(issue => {
    //     const mdPath = `/articles/comics/${comics_name}/${comics_name} Том ${vol} ${issue.id}.md`
    //     return checkFileExists(mdPath)
    // })
    
    // Створюємо елементи з урахуванням результатів перевірки
    issues.forEach((issue, index) => {
        const div = document.createElement('div')
        div.className = 'issue-box'
        
        // Додаємо клас 'non-existent' якщо файл не існує
        if (!issue.cover) {
            div.classList.add('non-existent')
        }

        div.innerHTML = `
            <div class='issue-cover' >
                <img src="https://images.wikia.nocookie.net/marveldatabase/images/thumb/${issue.cover}/160px-.">
                <a href="#/articles/comics/${pagename} ${issue.id}" data-navigo>#${issue.id}</a>
                <span class='issue-dates'>${formatMonthYear(issue.publication).replace(/^./, match => match.toUpperCase()) || ''}</span>
            </div>
            <span class='issue-title'>«${issue.story_title.split('; ')[0] || 'Невідомо'}»</span>
        `
        comicsList.appendChild(div)
    })
}

export function Comics(data, pagename, vol) {
    const infoboxDiv = document.createElement('div')
    // const info = data[vol].info
    infoboxDiv.className = 'comics-infobox infobox'

    infoboxDiv.innerHTML = `
        <section class='pi-image pi-item'>
            <img src="https://images.wikia.nocookie.net/marveldatabase/images/thumb/0/09/Amazing_Spider-Man_%281963%29a.png/270px-.">
        </section>
        <section class="pi-group">
            <section>
                <div class="pi-data">
                    <h3 class="pi-data-label">Видавництво:</h3>
                    <div class="pi-data-value"><a class="new" title="Marvel Comics (такої сторінки не існує)" data-uncrawlable-url="L3VrL3dpa2kvTWFydmVsX0NvbWljcz9hY3Rpb249ZWRpdCZyZWRsaW5rPTE=">Marvel Comics</a></div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Українською:</h3>
                    <div class="pi-data-value">Невідомо</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Тип:</h3>
                    <div class="pi-data-value">Тривала</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Появи:</h3>
                    <div class="pi-data-value">Невідомо</div>
                </div>
            </section>
            <section>
                <div class="pi-data">
                    <h3 class="pi-data-label">Статус:</h3>
                    <div class="pi-data-value">Завершена</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Період публікації:</h3>
                    <div class="pi-data-value">Липень '97—Лютий '09</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Випусків:</h3>
                    <div class="pi-data-value">500 + 30 щорічників та 195 збірників</div>
                </div>
            </section>
        </section>
    `
    page.prepend(infoboxDiv)
}

export function Issue(data, pagename, comics_name, vol, issue) {
    const infoboxDiv = document.createElement('div')
    infoboxDiv.className = 'issue-infobox infobox'
    const info = data[vol][issue]
    console.log('issue:', vol, issue)
    const img = `https://images.wikia.nocookie.net/marveldatabase/images/thumb/${info.cover}/270px-./`
    
    infoboxDiv.innerHTML = `
        <section class='pi-image pi-item'>
            <img src='${img}'>
        </section>
        <section class="pi-group">
            <section>
                <h3 class="pi-header">Загальна інформація</h3>
                <div class="pi-group-2">
                    <div class="pi-data-value">${formatDate(info.release) || ''}</div>
                    <div class="pi-data-value">${formatMonthYear(info.publication).replace(/^./, match => match.toUpperCase()) || ''}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Головний редактор:</h3>
                    <div class="pi-data-value">${info.editor_chief || 'Невідомо'}</div>
                </div>
            </section>
            <section>
                <h3 class="pi-header">Творці</h3>
                <div class="pi-data">
                    <h3 class="pi-data-label">Сюжет:</h3>
                    <div class="pi-data-value">${info.writer || 'Невідомо'}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Малюнок:</h3>
                    <div class="pi-data-value">${info.penciler || 'Невідомо'}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Туш:</h3>
                    <div class="pi-data-value">${info.inker || 'Невідомо'}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Колір:</h3>
                    <div class="pi-data-value">${info.colorist || 'Невідомо'}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Шрифт:</h3>
                    <div class="pi-data-value">${info.letterer || 'Невідомо'}</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Редактор:</h3>
                    <div class="pi-data-value">${info.editor || 'Невідомо'}</div>
                </div>
            </section>
        </section>
        
    `
    page.prepend(infoboxDiv)
}
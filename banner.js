function banner(root, key, title, link, updateInterval) {

    const bannerElement = document.createElement("div");
    bannerElement.classList.add('banner');

    const renderBody = () => {

        if (!bannerElement.querySelector('.banner__body')) {
            bannerElement.innerHTML = `<div class="banner__header"><a href="${link}">${title}</a></div><div class="banner__body">Загрузка...</div>`
        }

        const date = new Date(Date.now() - 60 * 1000 * 60)

        const year = date.getFullYear();
        const mouth = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes() < 10 ? "00" : +date.getMinutes().toString()[0] - 1 + "0";

        const url = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?key=${key}&indicators=100,101,102,103&time_begin=${year}-${mouth}-${day}+${hour}:${minutes}:00&time_interval=10min&sites=4203`


        fetch(url).then(res => res.text()
            .then(xml => {
                const parser = new DOMParser();
                const parsered = parser.parseFromString(xml, "application/xml");
                const nodes = parsered.querySelectorAll("aggvalue")

                const temp = +nodes[nodes.length - 1].querySelector('avg').innerHTML;
                const windSpeed = +nodes[nodes.length - 2].querySelector('avg').innerHTML
                const direction = nodes[nodes.length - 3].querySelector('avg').innerHTML;
                const humidity = nodes[nodes.length - 4].querySelector('avg').innerHTML


                const wind = windSpeed < 0.3 ? 'Штиль' : `${directionText(direction)}, ${windSpeed.toFixed(1)} м/с`

                bannerElement.querySelector('.banner__body').innerHTML = `
                    <div class="banner__info">
                        <div class="banner__temperaure">${temp.toFixed(1)} &#8451;</div>
                        <div class="info__footer">
                            <div>${humidity} %</div>
                            <div>${wind}</div>
                        </div>
                    </div>
                    <div class="banner__arrow">
                        <object width="80px" type="image/svg+xml" data="bg.svg"></object>
                        ${+windSpeed < 0.3 ? '' : `<object width="80px" type="image/svg+xml" data="arrow.svg"
                        style = "transform: rotate(${360 - direction}deg);" ></object >`}
                    </div > `
            }));
    }

    root.appendChild(bannerElement)
    renderBody()

    setInterval(() => {
        renderBody()
    }, updateInterval)
}

function directionText(value) {
    if (value >= 0 && value < 22)
        return "С"
    if (value >= 22 && value < 45)
        return "ССВ"
    if (value >= 45 && value < 67)
        return "СВ"
    if (value >= 67 && value < 90)
        return "ВВС"
    if (value >= 90 && value < 112)
        return "В"
    if (value >= 112 && value < 135)
        return "ВЮВ"
    if (value >= 135 && value < 157)
        return "ЮВ"
    if (value >= 157 && value < 180)
        return "ЮЮВ"
    if (value >= 180 && value < 202)
        return "Ю"
    if (value >= 202 && value < 225)
        return "ЮЮЗ"
    if (value >= 225 && value < 247)
        return "ЮЗ"
    if (value >= 247 && value < 270)
        return "ЗЮЗ"
    if (value >= 270 && value < 292)
        return "З"
    if (value >= 292 && value < 315)
        return "ЗСЗ"
    if (value >= 315 && value < 337)
        return "СЗ"
    if (value >= 337 && value < 360)
        return "ССЗ"
    if (value == 360)
        return "С"
}

const bannerContainer = document.querySelector('#bannerContainer');

banner(bannerContainer, '654hblgm9gl8367h', "Метеостанция ИВМ СО РАН", "https://thelemoh.github.io/temperature/", 10000)

function banner(root, key, title, link, updateInterval) {

    const bannerElement = document.createElement("div");
    bannerElement.classList.add('banner');
    bannerElement.addEventListener('click', () => {
        document.location = 'https://thelemoh.github.io/temperature/'
    })

    const renderBody = () => {

        if (!bannerElement.querySelector('.banner__body')) {
            bannerElement.innerHTML = `<div class="banner__body">Загрузка...</div>`
        }
       

        const date = new Date(Date.now() - 60 * 1000 * 60)

        const year = date.getFullYear();
        const mouth = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes() < 10 ? "00" : +date.getMinutes().toString()[0] - 1 + "0";

        console.log(day);

        const url = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?key=${key}&indicators=100,101,102,103&time_begin=${year}-${mouth}-${day}+${hour}:${minutes}:00&time_interval=10min&sites=4203`

        fetch(url).then(res => res.text()
            .then(xml => {
                const parser = new DOMParser();
                const parsered = parser.parseFromString(xml, "application/xml");
                const nodes = parsered.querySelectorAll("aggvalue")

                const time = nodes[nodes.length - 1].getAttribute('time')

                let humidity, direction, windSpeed, temp;

                let timeIterator = nodes.length - 1;
                while (timeIterator >= 0) {
                    if (time === nodes[timeIterator].getAttribute('time')) {
                        switch (nodes[timeIterator].getAttribute('indicator')) {
                            case '100': humidity = nodes[timeIterator].querySelector('avg').innerHTML; break;
                            case '101': direction = +nodes[timeIterator].querySelector('avg').innerHTML; break;
                            case '102': windSpeed = +nodes[timeIterator].querySelector('avg').innerHTML; break;
                            case '103': temp = +nodes[timeIterator].querySelector('avg').innerHTML; break;

                            default:
                                break;
                        }
                        timeIterator--;
                    }
                    else {
                        break;
                    }
                }

                /* const temp = +nodes[nodes.length - 1].querySelector('avg').innerHTML;
                const windSpeed = +nodes[nodes.length - 2].querySelector('avg').innerHTML
                const direction = +nodes[nodes.length - 3].querySelector('avg').innerHTML;
                const humidity = nodes[nodes.length - 4].querySelector('avg').innerHTML */

                const wind = windSpeed < 0.3 ? 'Штиль' : `${directionText(direction)}, ${windSpeed.toFixed(1)} м/с`

                bannerElement.querySelector('.banner__body').innerHTML = `
                    <div class="banner__info">
                        <div class="banner__temperaure">${temp.toFixed(1)} &deg;C</div>
                        <div class="banner__humidity">${humidity}%</div>
                        <div class="banner__humidity">${wind}</div>
                    </div>
                    <div class="banner__arrow">
                        <img width="67px" src="bg.svg"></img>
                        ${+windSpeed < 0.3 || !direction ? '' : `<img width="67px" src="arrow.svg"
                        style = "transform: rotate(${180 + directionRound(direction)}deg);"></img>`}
                    </div > `
            }));
    }


    /*   <div class="info__footer">
      <div>${humidity}%</div>
      <div>${wind}</div>
  </div> */

    root.appendChild(bannerElement)
    renderBody()

    /*  setInterval(() => {
         renderBody()
     }, updateInterval) */
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
    if (!value) {
        return "-"
    }
}

function directionRound(value) {
    if (value >= 0 && value < 11.25)
    return 0
    if (value >= 11.25 && value < 33.75)
    return 22.5
    if (value >= 33.75 && value < 56.25)
    return 45
    if (value >= 56.25 && value < 78.75)
    return 67.5
    if (value >= 78.75 && value < 101.25)
    return 90
    if (value >= 101.25 && value < 123.75)
    return 112.5
    if (value >= 123.75 && value < 146.25)
    return 135
    if (value >= 146.25 && value < 168.75)
    return 157.5
    if (value >= 168.75 && value < 191.25)
    return 180
    if (value >= 191.25 && value < 213.75)
    return 202.5
    if (value >= 213.75 && value < 236.25)
    return 225
    if (value >= 236.25 && value < 258.75)
    return 247.5
    if (value >= 258.75 && value < 281.25)
    return 270
    if (value >= 281.25 && value < 303.75)
    return 292.5
    if (value >= 303.75 && value < 326.25)
    return 315
    if (value >= 326.25 && value < 348.75)
    return 337.5
    if (value >= 348.75)
    return 0
    }

const bannerContainer = document.querySelector('#bannerContainer');

banner(bannerContainer, '654hblgm9gl8367h', "Метеостанция", "https://thelemoh.github.io/temperature/", 10000)

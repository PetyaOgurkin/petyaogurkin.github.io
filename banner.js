function banner(root, key, title, link, linkTitle, updateInterval) {

    const bannerElement = document.createElement("div");
    bannerElement.classList.add('banner');

    const renderBody = () => {

        const date = new Date(Date.now() - 60 * 1000 * 60)

        const year = date.getFullYear();
        const mouth = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes() < 10 ? "00" : +date.getMinutes().toString()[0] - 1 + "0";

        const url = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?key=${key}&indicators=99,103&time_begin=${year}-${mouth}-${day}+${hour}:${minutes}:00&time_interval=10min&sites=4203`


        fetch(url).then(res => res.text()
            .then(xml => {
                const parser = new DOMParser();
                const parsered = parser.parseFromString(xml, "application/xml");
                const nodes = parsered.querySelectorAll("aggvalue")

                const temp = nodes[nodes.length - 1].querySelector('avg').innerHTML;
                const presure = nodes[nodes.length - 2].querySelector('avg').innerHTML

                bannerElement.querySelector('.banner__body').innerHTML = `<p>Температура: ${Math.round(temp)} &#8451;</p><p>Давление: ${Math.round(presure)} мм рт. ст.</p>`
            }));
    }

    const header = `<div class="banner__header"><h3>${title}</h3></div>`;
    const body = `<div class="banner__body">${renderBody()}</div>`;
    const footer = `<div class="banner__footer"><a href="${link}">${linkTitle}</a></div>`;

    bannerElement.innerHTML = header + body + footer;

    root.appendChild(bannerElement)

    setInterval(() => {
        renderBody()
    }, updateInterval)
}

const bannerContainer = document.querySelector('#bannerContainer');

banner(bannerContainer, '654hblgm9gl8367h', "Погода в Академгородке", "https://thelemoh.github.io/temperature/", "Узнать больше", 10000)

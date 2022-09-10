let countryCardsContainer = document.querySelector('.country-cards-container')
const url = 'https://restcountries.com/v3.1/all'
let regionFilter = document.querySelector('.region')
let spinner = document.querySelector('.lds-roller')
let countriesObject
let detailCountry
let searchInput = document.querySelector('.search-input')

let detailPage = document.querySelector('.detail-page')
let searchContainer = document.querySelector('.search-container')

let themeSwitcherElement = document.querySelector('.theme-switcher')
let body = document.querySelector('.body')
regionFilter.addEventListener('input',async()=>{
    if(regionFilter.value === 'All'){
        countryCardsContainer.innerHTML = null
        spinner.style.display = 'block'
        let res = await fetch(url)
        let data = await res.json()
        countriesObject = data
        spinner.style.display = 'none'
        countriesObject.map(item=>{
            makeCardElements(
                item
            )
        })
    }else if(regionFilter.value !== 'All'){
        countryCardsContainer.innerHTML = null
        spinner.style.display = 'block'
        let res = await fetch(`https://restcountries.com/v3.1/region/${regionFilter.value}`)
        let data = await res.json()
        countriesObject = data
        spinner.style.display = 'none'
        countriesObject.map(item=>{
            makeCardElements(
                item
            )
        })
    }
})


searchInput.addEventListener('input',async()=>{
    regionFilter.value = "All"
    spinner.style.display = 'block'
    let res = await fetch(`https://restcountries.com/v3.1/name/${searchInput.value}`)
    let data = await res.json()
    countriesObject = data
    countryCardsContainer.textContent = null
    if(countriesObject === null) return
    spinner.style.display = 'none'
    countriesObject.map(item=>{
        makeCardElements(
            item
        )
    })
})

if(searchInput.value === '' || searchInput.value === null){
    spinner.style.display = 'block'
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        countryCardsContainer.innerHTML = null
        countriesObject = data
        spinner.style.display = 'none'
        countriesObject.map(item=>{
            makeCardElements(
                item
            )
        })
    }).catch(err=>{
    })
}

function back(){
    detailPage.style.display = 'none'
    countryCardsContainer.style.display = 'flex'
    searchContainer.style.display = 'flex'
}



function makeCardElements(item){
    
    let cardContainer = document.createElement('div')
    cardContainer.classList.add('country-card')

    let flagImage = document.createElement('img')
    flagImage.classList.add('flag')
    flagImage.src = item.flags.png

    let cardContent = document.createElement('div')
    cardContent.classList.add('country-card-content')

    let countryName = document.createElement('h1')
    countryName.classList.add('country-name')
    countryName.textContent = item.name.common

    let countryPopulation = document.createElement('div')
    countryPopulation.innerHTML = `<span>Population:</span>${parseFloat(item.population).toLocaleString()}`

    let countryRegion = document.createElement('div')
    countryRegion.innerHTML = `<span>Region:</span>${item.region}`

    let countryCapital = document.createElement('div')
    countryCapital.innerHTML = `<span>Capital:</span>${item.capital[0]}`

    cardContainer.addEventListener('click',async()=>{
        let res = await fetch(`https://restcountries.com/v3.1/name/${item.name.common}`)
        let data = await res.json()
        detailPage.innerHTML = ''
        detailCountry = data
        spinner.style.display = 'none'
        makeDetailPage(item)
    })


    cardContent.appendChild(countryName)
    cardContent.appendChild(countryPopulation)
    cardContent.appendChild(countryRegion)
    cardContent.appendChild(countryCapital)
    cardContainer.appendChild(flagImage)
    cardContainer.appendChild(cardContent)
    countryCardsContainer.appendChild(cardContainer)
}


function makeDetailPage(item){
      
    countryCardsContainer.style.display = 'none'
    detailPage.style.display = 'grid'
    searchContainer.style.display = 'none'

    let languages = []
    for (const key in item.languages) {
        languages.push( item.languages[key] )
    }
    languages = languages.join(', ')

    let currency

    for(const key in item.currencies){
        currency = item.currencies[key].name
    }

    let nativeName = Object.values(item.name.nativeName)[0].common
    let borderCounteries
    if(item.borders){
        borderCounteries = item.borders.map(border=>{
            return(
                `<div>${border}</div>`
            )
        })
        borderCounteries = borderCounteries.join('')
    }else{
        borderCounteries = 'this country is not bordered with any country'
    }



    detailPage.innerHTML = 
    `
        <div onclick='back()' class="back">
            <span class="material-symbols-outlined">
            keyboard_backspace
            </span>
            <p>Back</p>
        </div>
        <img class="flag" src="${item.flags.png}" alt="flag">
        <div class="information">
            <div class="country-name">${item.name.common}</div>
            <div class="left">
                <div><span>Native Name:</span> ${nativeName}</div>
                <div><span>Population:</span> ${parseFloat(item.population).toLocaleString()}</div>
                <div><span>Region:</span> ${item.region}</div>
                <div><span>Sub Region:</span> ${item.subregion}</div>
                <div><span>Capital:</span> ${item.capital[0]}</div>
            </div>
            <div class="right">
                <div><span>Top Level Domain:</span> ${item.tld}</div>
                <div><span>Currencies:</span> ${currency}</div>
                <div><span>Languages:</span> ${languages}</div>
            </div>
            <div class="border-countries">
                <h1>Border Countries:</h1>
                <div class="countries">
                    ${borderCounteries}
                </div>
            </div>
        </div>
    </div>
    `
}
themeSwitcherElement.addEventListener('click',themeSwitcher)
let darkmode = false
function themeSwitcher(){
    body.classList.toggle('dark-mode')
    if(darkmode === true){
        this.children[0].textContent = 'dark_mode'
        this.children[1].textContent = 'Dark Mode'
        darkmode = false
    }
    else if(darkmode === false){
        this.children[0].textContent = 'light_mode'
        this.children[1].textContent = 'Light Mode' 
        darkmode = true
    }
}
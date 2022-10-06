
//Burger
const burgerBtn = document.querySelector('.header__burger')
const burgerMenu = document.querySelector('.burger-menu')
const paggination = document.querySelector('#fp-nav')

burgerBtn.addEventListener('click', function () {
    burgerBtn.classList.toggle('header__burger--active')
    burgerMenu.classList.toggle('burger-menu--active')
    paggination.style.visibility == 'hidden' ? paggination.style.visibility = 'visible' : paggination.style.visibility = 'hidden'
})

//Modals 


const projects = document.querySelectorAll('.projects__item')
const projectsModals = document.querySelectorAll('.modal-pages__item')
const closeBtn = document.querySelectorAll('.modal-pages__close')

for (let i = 0; i < projects.length; i++) {
    projects[i].addEventListener('click', function () {
        projectsModals[i].classList.add('modal-pages__item--active')
        projectsModals[i].addEventListener('wheel', function (e) {
            e.stopPropagation()
        })
    })
}

const closeWindow = () => {
    projectsModals.forEach(modal => {
        modal.classList.remove('modal-pages__item--active')
    })
}
closeBtn.forEach(btn => {
    btn.addEventListener('click', closeWindow)
})

window.addEventListener('click', function (e) {
    e.target.classList.contains('modal-pages__item--active') ? closeWindow() : null
})



//Languages


const switcherLanguagesContainer = document.querySelector('.header__lang-menu')
document.querySelector('.header__lang-selected a').addEventListener('click', (e) => {
    e.preventDefault()
})
const lanugages = switcherLanguagesContainer.querySelectorAll('li')

lanugages.forEach(item => {
    if (item.closest('.header__lang-selected')) {
        return
    }

    item.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        const newSelectetLanguage = document.createElement('li')
        itemLink = document.createElement('a')
        itemLink.textContent = item.querySelector('a').textContent
        itemLink.classList.add(item.querySelector('a').classList[0])
        newSelectetLanguage.append(itemLink)
        document.querySelector('.header__lang-selected').textContent = ''
        document.querySelector('.header__lang-selected').append(newSelectetLanguage)
        changeUrlLanguage()
    })
})

const changeUrlLanguage = () => {
    const language = document.querySelector('.header__lang-selected li a').textContent.toLowerCase()
    location.href = window.location.pathname + '#' + language
    location.reload()
}

const allLanguages = ['eng', 'ru']

const changeLanguage = () => {
    const getHash = window.location.hash
    const hash = getHash.substr(1).toLowerCase()
    if (!allLanguages.includes(hash)) {
        location.href = window.location.pathname + '#eng'
        location.reload()
    }
    const selectedLanugage = document.querySelector('.header__lang-selected li')
    selectedLanugage.textContent = ''
    const actualLanugage = document.createElement('a')
    actualLanugage.classList.add(hash)
    actualLanugage.textContent = hash.toUpperCase()
    selectedLanugage.append(actualLanugage)


    document.querySelector('.translate-name').textContent = locales['name'][hash]

    for (let key in locales) {
        const item = document.querySelector('.translate-' + key)
        if (item) {
            item.textContent = locales[key][hash]
        }

    }

}
changeLanguage()


//theme sWitcher

const switcher = document.querySelector('#checkbox')

switcher.addEventListener('change',()=>{
    document.querySelector('#section0').classList.toggle('dark')
    document.querySelector('.mainpage__title h1').classList.toggle('dark')
    document.querySelector('.mainpage__title h2').classList.toggle('dark')
    document.querySelector('.mainpage__cycle').classList.toggle('dark')
    document.querySelector('#section1').classList.toggle('dark')
    document.querySelector('#section2').classList.toggle('dark')
    document.querySelector('#section3').classList.toggle('dark')
})
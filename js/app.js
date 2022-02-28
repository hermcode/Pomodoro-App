
let tasks = []
let time = 0
let timer = null
let timerBreak = null
let current = 0

const createNewTaskBTN = document.querySelector('#create-task')
const divForm = document.querySelector('.form')
const formCloseBtn = document.querySelector('#form-close-btn')

const form = document.querySelector('#form')
const itTask = document.querySelector('#itTask')
const bAdd = document.querySelector('#bAdd')
const taskName = document.querySelector('#time #taskName')


function loadEventListeners() {

    form.addEventListener('submit', e => {
        e.preventDefault()
        divForm.style.display = "none"

        if(itTask.value !== '') {
            createTask(itTask.value)
            itTask.value = ''
            renderTasks()
        }
    })

    createNewTaskBTN.addEventListener('click', e => {
        e.preventDefault()
        divForm.style.display = "grid"
    })
    
    formCloseBtn.addEventListener('click', e => {
        divForm.style.display = "none"
    })

}

loadEventListeners()

function createTask(value) {

    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    }

    tasks.push(newTask)
}

function renderTasks() {
    const htmlTasks = tasks.map(task => {

        return `
            <div class="task">
                <p class="title">${ task.title.length > 20 
                        ? task.title.substr(0,20) + '...'
                        : task.title
                    }</p>
                
                ${
                    task.completed
                    ? `<span class="done">Done</span>` 
                    : `<button class="start-btn" data-id=${task.id}>Start</button>` 
                }
               
            </div>
        `
    })

    const tasksContainer = document.querySelector('#tasks')
    tasksContainer.innerHTML = htmlTasks.join('')

    const startButtons = document.querySelectorAll('.task .start-btn')

    startButtons.forEach(startButton => {
        startButton.addEventListener('click', () => {

            if(!timer) {
                startButtonHandler(startButton.getAttribute('data-id'))
                startButton.textContent = 'In progress...'
            }
        })
    })
}

function startButtonHandler(id) {

    time = 10
    current = id

    const taskIndex = tasks.findIndex(task => task.id === id)
    
    taskName.textContent = tasks[taskIndex].title

    timer = setInterval(() => {
        timerHandler(id)
    }, 1000)
}

function timerHandler(id) {

    time--
    renderTime()

    if(time === 0) {
        markCompleted(id)
        clearInterval(timer)
        taskName.textContent = ""
        timer = null
        renderTasks()
        startBreak()
    }
}

function markCompleted(id) {

    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks[taskIndex].completed = true
}

function startBreak() {

    time = 5 * 60

    taskName.textContent = "Break"
    timerBreak = setInterval(timerBreakHandler, 1000)
}


function timerBreakHandler() {

    time--
    renderTime()

    if(time === 0) {
        clearInterval(timerBreak)
        current = null;
        timerBreak = null
        taskName.textContent = ""
        renderTasks()
    }

}

function renderTime() {

    const timeDiv = document.querySelector('#time #value')
    const minutes = parseInt(time / 60)
    const seconds = parseInt(time % 60)

    timeDiv.textContent = `
        ${minutes < 10 ? "0" : ""}${minutes}:
        ${seconds < 10 ? "0" : ""}${seconds}
    `
}
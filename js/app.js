const TODO_FORM = document.getElementById('todo-form')
const TODO_INPUT = document.getElementById('todo-inp')
const TODO_LIST = document.getElementById('todo-list')
const TODO_LENGTH = document.getElementById('todo-all')
const TODO_IMPORTANT_LENGTH = document.getElementById('todo-important')
const MODAL = document.getElementById('modal')
const SORT_SELECT = document.getElementById('todo-select')

class TodoLocalStorage {
  constructor() {
    this.keyName = 'tasks'
  }

  getLocalStorageData() {
    const tasks = localStorage.getItem(this.keyName)
    if (tasks) {
      return JSON.parse(tasks)
    }
    return []
  }

  addLocalStorageData(obj) {
    const tasks = this.getLocalStorageData()
    tasks.push(obj)
    localStorage.setItem(this.keyName, JSON.stringify(tasks))
  }

  removeLocalStorageData(id) {
    const tasks = this.getLocalStorageData()
    const index = tasks.findIndex(item => item.id === id)
    tasks.splice(index, 1)
    localStorage.setItem(this.keyName, JSON.stringify(tasks))
  }

  addImportantStatus(id) {
    const tasks = this.getLocalStorageData()
    const index = tasks.findIndex(item => item.id === id)
    tasks[index].important = !tasks[index].important
    localStorage.setItem(this.keyName, JSON.stringify(tasks))
  }

  updateLocalStorageData(tasks) {
    localStorage.setItem(this.keyName, JSON.stringify(tasks))
  }
}

const todoLocalStorage = new TodoLocalStorage()

class Modal {
  render(msg) {
    const item = document.createElement('div')
    item.classList.add('modal__item', 'modal__item--hide')
    item.innerHTML = `<div class="modal__item-body">
          <img class="modal__img" src="./img/done.png">
          <span class="modal__text">${msg}</span>
       </div>`

    MODAL.appendChild(item)
    setTimeout(() => {
      item.classList.remove('modal__item--hide')
    }, 200);

    setTimeout(() => {
      this.remove()
    }, 2000);
  }

  remove() {
    const item = document.querySelector('.modal__item')
    item.classList.add('modal__item--hide')
    setTimeout(() => {
      item.remove()
    }, 200);
  }
}

const modal = new Modal()

class Todo {
  constructor() {
    this.render()
    this.updateUi()
    TODO_FORM.addEventListener('submit', this.createTask.bind(this))
    TODO_LIST.addEventListener('click', this.actionTask.bind(this))
    SORT_SELECT.addEventListener('change', this.sortTasks.bind(this))
  }

  createTask(e) {
    e.preventDefault()

    const todoTitle = TODO_INPUT.value
    if (todoTitle) {
      const taskId = todoLocalStorage.getLocalStorageData().length
      const task = {
        id: taskId,
        title: todoTitle,
        important: false,
      }
      todoLocalStorage.addLocalStorageData(task)

      modal.render('Task created!')
      this.render()
      TODO_INPUT.value = ""
    }
  }

  render() {
    const tasks = todoLocalStorage.getLocalStorageData()
    let html = ""
    let importantClass = ""
    tasks.forEach(({ id, title, important }) => {
      if (important) importantClass = "item-important"

      html += `
      <li class="todo__item ${importantClass}" data-id="${id}">
      <button class="todo__item-btn todo__item-important">!</button>
          <span class="todo__item-title">${title}</span>
          <button class="todo__item-btn todo__item-delete"></button>
        </li>`

      importantClass = ""
    })
    TODO_LIST.innerHTML = html
    this.updateUi()
  }

  actionTask(e) {
    // Delete current task
    if (e.target.classList.contains('todo__item-delete')) {
      const parent = e.target.parentElement
      const id = +parent.dataset.id

      parent.classList.add('todo__item--hide')
      setTimeout(() => {
        parent.remove()
      }, 300);

      // remove task inner localStorage
      todoLocalStorage.removeLocalStorageData(id)
      this.updateUi()
      modal.render('Task removed!')
    }

    if (e.target.classList.contains('todo__item-important')) {
      const parent = e.target.parentElement
      const id = +parent.dataset.id

      parent.classList.toggle('item-important')
      todoLocalStorage.addImportantStatus(id)
      this.updateUi()
      modal.render('Task status changed!')
    }
  }

  sortTasks(e) {
    const tasks = todoLocalStorage.getLocalStorageData()

    const sortActions = {
      increasing: (a, b) => a.title.localeCompare(b.title),
      decreasing: (a, b) => b.title.localeCompare(a.title),
      important: (a, b) => b.important - a.important,
    }

    const sortedTasks = tasks.sort(sortActions[e.target.value]);
    todoLocalStorage.updateLocalStorageData(sortedTasks)
    this.render()
  }

  updateUi() {
    const tasks = todoLocalStorage.getLocalStorageData()
    const importantTasks = tasks.filter(task => task.important)

    if (tasks.length === 0) {
      TODO_LIST.innerHTML = `<li class="todo__item todo__item--msg">There are no tasks...</li>`
    }

    TODO_LENGTH.textContent = tasks.length
    TODO_IMPORTANT_LENGTH.textContent = importantTasks.length
  }
}

const todo = new Todo()

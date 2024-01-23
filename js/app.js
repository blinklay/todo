const TODO_FORM = document.getElementById('todo-form')
const TODO_INPUT = document.getElementById('todo-inp')
const TODO_LIST = document.getElementById('todo-list')
const TODO_LENGTH = document.getElementById('todo-all')

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

}

const todoLocalStorage = new TodoLocalStorage()

class Todo {
  constructor() {
    this.render()
    this.updateUi()
    TODO_FORM.addEventListener('submit', this.createTask.bind(this))
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

      this.render()
    }
  }

  render() {
    const tasks = todoLocalStorage.getLocalStorageData()
    let html = ""
    tasks.forEach(({ id, title }) => {
      html += `
      <li class="todo__item">
          <span class="todo__item-title">${title}</span>
          <button class="todo__item-btn todo__item-delete"></button>
        </li>`
    })
    TODO_LIST.innerHTML = html
    this.updateUi()
  }

  updateUi() {
    const tasks = todoLocalStorage.getLocalStorageData()
    TODO_LENGTH.textContent = tasks.length
  }
}

const todo = new Todo()
let taskItems = []
const taskInput = document.querySelector('.task-input')
const dateInput = document.querySelector('.date-input')
const addButton = document.querySelector('.add-button');
const completedTasksDiv = document.querySelector('.completed-tasks')
const uncompletedTasksDiv = document.querySelector('.uncompleted-tasks')


window.onload = ()=>{
    let storageTaskItems = localStorage.getItem('taskItems')
    if(storageTaskItems !== null){
        taskItems = JSON.parse(storageTaskItems)
    }

    render()
}

addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const dateValue = dateInput.value;
    const targetDate = new Date(dateValue);
    const currentDate = new Date();

    const timeDifference = targetDate.getTime() - currentDate.getTime();
    remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); 
    if(remainingDays < 0){
        remainingDays = 'past the due date'
    }else{
        remainingDays = `${remainingDays} day`
    }
        
    if (taskText) {
        addTask(taskText, dateValue, remainingDays);
        taskInput.value = '';
        dateInput.value = '';
        taskInput.focus();
    }
});

// Add task
function addTask(text, date, remainingDays){
    taskItems.push({
        id: Date.now(),
        text,
        date,
        remainingDays,
        completed: false,
    })
    console.log(taskItems)

    saveAndRender()
}

// Remove task
function removeTask(id){
    taskItems = taskItems.filter(task => task.id !== Number(id))
    saveAndRender()
}

// Mark as completed
function markAsCompleted(id){
    taskItems = taskItems.filter(task =>{
        if(task.id === Number(id)){
            task.completed = true
        }
        return task
    })

    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id){
    taskItems = taskItems.filter(task =>{
        if(task.id === Number(id)){
            task.completed = false
        }

        return task
    })

    saveAndRender()
}

// Save in localstorage
function save(){
    localStorage.setItem('taskItems', JSON.stringify(taskItems))
}

// Render
function render(){
    let unCompletedTasks = taskItems.filter(item => !item.completed)
    let completedTasks = taskItems.filter(item => item.completed)

    completedTasksDiv.innerHTML = ''
    uncompletedTasksDiv.innerHTML = ''

    if(unCompletedTasks.length > 0){
        unCompletedTasks.forEach(task =>{
            uncompletedTasksDiv.append(createTaskElement(task))
        })
    }else{
        uncompletedTasksDiv.innerHTML = `<div class='empty'>No uncompleted task</div>`
    }

    if(completedTasks.length > 0){
        completedTasksDiv.innerHTML = `<div class='completed-title'>Completed (${completedTasks.length} / ${taskItems.length})</div>`
        completedTasks.forEach(task =>{
            completedTasksDiv.append(createTaskElement(task))
        })
    }
}

// Save and render
function saveAndRender(){
    save()
    render()
}

// Create task list item
function createTaskElement(task){

    // Create task list container
    const taskDiv = document.createElement('div')
    taskDiv.setAttribute('data-id', task.id)
    taskDiv.className = 'task-item'

    // Create task item text
    const taskTextSpan = document.createElement('span')
    taskTextSpan.innerHTML = task.text

    // Checkbox
    const taskInputCheckbox = document.createElement('input')
    taskInputCheckbox.type = 'checkbox'
    taskInputCheckbox.checked = task.completed
    taskInputCheckbox.onclick = (e) =>{
        let id = e.target.closest('.task-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    // Delete button
    const taskRemoveBtn = document.createElement('a')
    taskRemoveBtn.href = '#'
    taskRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M18 6l-12 12"></path>
                                    <path d="M6 6l12 12"></path>
                                </svg>`
    taskRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.task-item').dataset.id
        removeTask(id)
    }

    // Remaining text
    const remainingTextSpan = document.createElement('span')
    remainingTextSpan.className = 'remainingText'
    remainingTextSpan.innerHTML = `Time Remaining : ${task.remainingDays}`
    
    taskTextSpan.prepend(taskInputCheckbox)
    taskDiv.appendChild(taskTextSpan)
    taskDiv.appendChild(remainingTextSpan)
    taskDiv.appendChild(taskRemoveBtn)

    return taskDiv
}


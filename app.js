//  Selecting all elements 
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondarCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // All event listeners 
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondarCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);

}

//                          All Todos Clear

function clearAllTodos(e) {

    if (confirm("Are you sure you want to delete all ?")) {
        // clearing todos from the interface

        /*it is slow method*/ // todoList.innerHTML = "";


        /* quick method : */
        while (todoList.firstElementChild != null) {

            todoList.removeChild(todoList.firstElementChild);

        }

        //  Deleting from Local Storage
        localStorage.removeItem("todos");
    }

}

//                             Filtering

function filterTodos(e) {
    // console.log(e.target.value); -- to know the entered value

    const filterValue = e.target.value.toLowerCase(); //all of them will be written in lower case so that there is no case sensitivity
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase(); // We use it to get text content

        if (text.indexOf(filterValue) === -1) {
            // could not find
            listItem.setAttribute("style", "display : none !important"); // The reason for writing "!important" is that the Bootstrap technology we use sees "display : block".
        } else {
            listItem.setAttribute("style", "display : block");
        }
    });
}

//                     Deleting Todos from the interface

function deleteTodo(e) {

    // console.log(e.target); //used to know where you clicked

    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo has been deleted successfully...")
    }

}

//             Deleting Todos from Storage  

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();
    todos.forEach(function(todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); // I can delete value from array.
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

//                     Adding Todos on page load

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo) {
        addTodoToUI(todo);
    });
}

function addTodo(e) {

    const newTodo = todoInput.value.trim(); //  trim removes blanks at the beginning and at the end

    if (newTodo === "") {

        /*  <div class="alert alert-danger" role="alert">
         This is a danger alert—check it out!
     </div> */
        showAlert("danger", "Please enter a todo..");
    } else {
        addTodoToUI(newTodo);
        addTodoStorage(newTodo); // Storage 
        showAlert("success", "Todo added successfully");
    }


    e.preventDefault();
}

function getTodosFromStorage() { // Getting Todos from Storage
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

//                                 Storage 
function addTodoStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}


//                                 Show Alert 
function showAlert(type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // setTimeOut
    setTimeout(function() {
        alert.remove();
    }, 1500)

}

function addTodoToUI(newTodo) { // It will add the String value as a list item to the UI

    /*
    <li class="list-group-item d-flex justify-content-between">
            Todo 1
            <a href = "#" class ="delete-item">
                <i class = "fa fa-remove"></i>
            </a>

        </li>
*/

    //                      Creating a List Item 
    const listItem = document.createElement("li");
    // console.log(listItem);

    // Link creation  
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";

    // Text Node
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Adding a Todo List List Item
    todoList.appendChild(listItem);

    // In order for the input to be empty after the insertion process
    todoInput.value = "";

}
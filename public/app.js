
window.onload = function() {
  
  // Display the todo items.
  todoDB.open(refreshTodos);
  
  
  // Get references to the form elements.
  var newTodoForm = document.getElementById('myDIV');
  var newTodoInput = document.getElementById('myInput');
  
  
  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var text = newTodoInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the todo item.
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    // Reset the input field.
    newTodoInput.value = '';
    
    // Don't send the form.
    return false;
  };
  
}

// Update the list of todo items.
function refreshTodos() {  
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('myUL');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("data-id", todo.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = todo.text;
      
      li.appendChild(span);
      
      todoList.appendChild(li);
      
      // TODO: Setup an event listener for the checkbox.
      // hint: you have to get the id of the clicked element, and then call the deleteTodo function on that element
      checkbox.addEventListener('click', function (e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      })
    }

  });
}





window.onload = function() {
  
  // Display the shopping items.
  shoppingDB.open(refreshShoppings);
  
  
  // Get references to the form elements.
  var newShoppingForm = document.getElementById('myDIV');
  var newShoppingInput = document.getElementById('myInput');
  
  
  // Handle new shopping item form submissions.
  newShoppingForm.onsubmit = function() {
    // Get the shopping text.
    var text = newShoppingInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the shopping item.
      shoppingDB.createShopping(text, function(shopping) {
        refreshShoppings();
      });
    }
    
    // Reset the input field.
    newShoppingInput.value = '';
    
    // Don't send the form.
    return false;
  };
  
}

// Update the list of shopping items.
function refreshShoppings() {
  shoppingDB.fetchShoppings(function(shoppings) {
    var shoppingList = document.getElementById('myUL');
    shoppingList.innerHTML = '';
    
    for(var i = 0; i < shoppings.length; i++) {
      // Read the shopping items backwards (most recent first).
      var shopping = shoppings[(shoppings.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "shopping-checkbox";
      checkbox.setAttribute("data-id", shopping.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = shopping.text;
      
      li.appendChild(span);
      
      shoppingList.appendChild(li);

      // hint: you have to get the id of the clicked element, and then call the deleteShopping function on that element
      checkbox.addEventListener('click', function (e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        shoppingDB.deleteShopping(id, refreshShoppings);
      })
    }

  });
}




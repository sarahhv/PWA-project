var shoppingDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('shoppings', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('shopping')) {
        db.deleteObjectStore('shopping');
      }

      // Create a new datastore.
      var store = db.createObjectStore('shopping', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = tDB.onerror;
  };


  /**
   * Fetch all of the shopping items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the shopping items.
   */
  tDB.fetchShoppings = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['shopping'], 'readwrite');
    var objStore = transaction.objectStore('shopping');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var shoppings = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(shoppings);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      shoppings.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  };


  /**
   * Create a new shopping item.
   * @param {string} text The shopping item.
   */
    tDB.createShopping = function(text, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['shopping'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('shopping');

    // Create a timestamp for the shopping item.
    var timestamp = new Date().getTime();

    // Create an object for the shopping item.
    var shopping = {
      'text': text,
      'timestamp': timestamp
    };

    // Create the datastore request.
    var request = objStore.put(shopping);

    // Handle a successful datastore put.
    request.onsuccess = function (e) {
      // Execute the callback function.
      callback(shopping);
    }

    // Handle errors.
    request.onerror = tDB.onerror;

  };


  /**
   * Delete a shopping item.
   * @param {int} id The timestamp (id) of the shopping item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  tDB.deleteShopping = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['shopping'], 'readwrite');
    var objStore = transaction.objectStore('shopping');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the tDB object.
  return tDB;
}());

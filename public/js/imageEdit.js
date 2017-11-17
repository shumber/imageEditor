
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  getCommands()
  .then(function(json) {
    console.log(json)
    var imageManipulationControls = document.getElementById("imageControl");
    var controlButtonsContainer = document.createElement('div');
    controlButtonsContainer.setAttribute('name', 'controlButtonsContainer' );
    imageManipulationControls.appendChild(controlButtonsContainer);
    for (var i = 0; i < json.length; i++) {
      var controlButton = document.createElement('button');
      controlButton.innerHTML = json[i];
      console.log(controlButton.innerHTML);
      controlButton.addEventListener("click", eval(json[i]));
      controlButtonsContainer.appendChild(controlButton);
    }
      /*
      var controlButtonCrop = document.createElement('button');
      var controlButtonResize = document.createElement('button');
      var controlButtonRotate = document.createElement('button');

      controlButtonCrop.innerHTML = "Crop";
      controlButtonResize.innerHTML = "Resize";
      controlButtonRotate.innerHTML = "Rotate";

      controlButtonCrop.addEventListener("click", crop);
      controlButtonResize.addEventListener("click", resize);
      controlButtonRotate.addEventListener("click", rotate);
      imageManipulationControls.appendChild(controlButtonsContainer);
      controlButtonsContainer.appendChild(controlButtonCrop);
      controlButtonsContainer.appendChild(controlButtonResize);
      controlButtonsContainer.appendChild(controlButtonRotate);
      */
  })
  //.catch(function(e) {
  //  throw e;
  //});


  function Crop(){
    var instructions = document.getElementById("instructions");
    instructions.innerHTML = "Provide the following paramaters:";
    var imageControl = document.getElementById("imageControl");
    imageControl.innerHTML = '';
    var parameters = document.createElement('div');
    parameters.setAttribute('name', 'parameters' );
    var height = document.createElement('input');
    height.placeholder = "enter crop height in pixels";
    var width = document.createElement('input');
    width.placeholder = "enter crop width in pixels";
    var x = document.createElement('input');
    x.placeholder = "enter x coordinate";
    var y = document.createElement('input');
    y.placeholder = "enter y coordinate";

    imageControl.appendChild(height);
    imageControl.appendChild(width);
    imageControl.appendChild(x);
    imageControl.appendChild(y);



  }
  function Resize(){}
  function Rotate(){}

});

function getCommands() {
  return fetch('/api/image/commands')
    .then(function(response) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
      }

      return response.json();
    })
    .then(function(json) {
      return json.commands;
    });
}

function getBookmarks() {
  return fetch('/api/bookmarks')
      .then(function(response) {
          if (response.status !== 200) {
              return Promise.reject(new Error(response.statusText));
          }

          return response.json();
      })
      .then(function(json) {
          return json.bookmarks;
      });
}

function updateBookmarks(bookmarks) {
  var bookmarksContainer = document.getElementById('bookmarks');

  // empty bookmarks container
  bookmarksContainer.innerHTML = '';

  for (var i = 0; i < bookmarks.length; i++) {
      var bookmark = document.createElement('div');
      var documentUrl = document.createElement('a');
      var deleteButton = document.createElement('button');
      documentUrl.innerHTML = bookmarks[i];
      documentUrl.setAttribute('href', bookmarks[i]);
      deleteButton.innerHTML = "remove";
      deleteButton.setAttribute('name', 'remove');
      deleteButton.addEventListener("click", deleteBookmark);
      deleteButton.setAttribute('data-bookmarkIndex', i)
      deleteButton.setAttribute('enabled', '');
      bookmark.appendChild(documentUrl);
      bookmark.appendChild(deleteButton);

      bookmarksContainer.appendChild(bookmark);
  }
}

function deleteBookmark(index) {
  var currentButtonIndex = this.getAttribute('data-bookmarkIndex')
  console.log(currentButtonIndex)
  return fetch('/api/bookmarks/'+ currentButtonIndex, {
      method: 'DELETE'
  })
  .then(function(response) {
      if (response.status !== 200) {
          return Promise.reject(new Error(response.statusText));
      }
  })
  
  .then(getBookmarks)
  .then(function(bookmarks) {
      updateBookmarks(bookmarks);
  })
  .catch(function(e) {
      throw e;
  });
}

function addBookmark(form) {
  var bookmarkData = new FormData(form);

  return fetch('/api/bookmarks', {
      method: 'POST',
      body: bookmarkData
  })
      .then(function(response) {
          if (response.status !== 200) {
              return Promise.reject(new Error(response.statusText));
          }
      });
}


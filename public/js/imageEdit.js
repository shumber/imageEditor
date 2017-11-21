
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  var loadImageForm = document.getElementById('add-image');
  loadImageForm.addEventListener("submit", function(event) {
    event.preventDefault();
    postForm(loadImageForm, '/api/image')
      .then(displayImage)
      .then(displayCommands)
        
      .catch(function(e) {
          throw e;
      });
  });
});


function displayImage() {
  var imageDisplay = document.getElementById('image');
  imageDisplay.innerHTML = '';
  var image = document.createElement('img');
  image.setAttribute('src', '/images/doodle.png');
  imageDisplay.appendChild(image);
}


function displayCommands() {
  getCommands()
  .then(function(json) {
    console.log(json)
    var instructions = document.getElementById('instructions');
    instructions.innerHTML = 'Select an operation from below:';
    var imageManipulationControls = document.getElementById("imageControl");
    imageManipulationControls.innerHTML = '';
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
    var resetContainer = document.getElementById('reset');
    resetContainer.innerHTML = '';
    reset();
  });
}

function reset() {
  var route = 'api/image/reset';
  var resetContainer = document.getElementById('reset');
  var resetButton = document.createElement('button');
  resetButton.setAttribute = 
  resetButton.innerHTML = 'Reset Image';
  resetButton.addEventListener("click", function() {
    postForm('none', route)
    .then(displayImage)
    .then(displayCommands)
  });
  resetContainer.appendChild(resetButton);
}


function Crop(){
  var route = '/api/image/crop';
  var cropForm = document.createElement('form');
  cropForm.setAttribute('id', 'cropParams');
  cropForm.setAttribute('action', '/api/image/crop');
  cropForm.setAttribute('method', 'POST');
  var submitButton = document.createElement('input');
  submitButton.setAttribute('value', 'Process');
  submitButton.setAttribute('type', 'submit');
  var instructions = document.getElementById("instructions");
  instructions.innerHTML = "Provide the following paramaters:";
  var imageControl = document.getElementById("imageControl");
  imageControl.innerHTML = '';
  var height = document.createElement('input');
  height.placeholder = "enter crop height in pixels";
  height.setAttribute('name', 'height');
  height.setAttribute('type', 'text');
  var width = document.createElement('input');
  width.placeholder = "enter crop width in pixels";
  width.setAttribute('name', 'width');
  width.setAttribute('type', 'text');
  var x = document.createElement('input');
  x.placeholder = "enter x coordinate";
  x.setAttribute('name', 'x');
  x.setAttribute('type', 'text');
  var y = document.createElement('input');
  y.placeholder = "enter y coordinate";
  y.setAttribute('name', 'y');
  y.setAttribute('type', 'text');
  imageControl.appendChild(cropForm);
  var cropformId = document.getElementById('cropParams')
  cropformId.appendChild(height);
  cropformId.appendChild(width);
  cropformId.appendChild(x);
  cropformId.appendChild(y);
  cropformId.appendChild(submitButton);
  cropForm.addEventListener("submit", function(event) {
    event.preventDefault();
    postForm(cropForm, route)
    .then(displayImage)
  });
}

function Rotate() {
  var route = '/api/image/rotate';
  var rotateForm = document.createElement('form');
  rotateForm.setAttribute('id', 'rotateParams');
  rotateForm.setAttribute('action', route);
  rotateForm.setAttribute('method', 'POST');
  var submitButton = document.createElement('input');
  submitButton.setAttribute('value', 'Process');
  submitButton.setAttribute('type', 'submit');
  var instructions = document.getElementById("instructions");
  instructions.innerHTML = "Provide the following paramaters:";
  var imageControl = document.getElementById("imageControl");
  imageControl.innerHTML = '';

  var degrees = document.createElement('input');
  degrees.placeholder = "enter degrees of rotation";
  degrees.setAttribute('name', 'degrees');
  degrees.setAttribute('type', 'text');

  var BGcolor = document.createElement('input');
  BGcolor.placeholder = "enter color (blue, green...)";
  BGcolor.setAttribute('name', 'bgColor');
  BGcolor.setAttribute('type', 'text');

  imageControl.appendChild(rotateForm);
  rotateForm.appendChild(degrees);
  rotateForm.appendChild(BGcolor);
  rotateForm.appendChild(submitButton);
  rotateForm.addEventListener("submit", function(event) {
    event.preventDefault();
    postForm(rotateForm, route)
    .then(displayImage)
  }); 
}

function Resize() {
  var route = '/api/image/resize';
  var resizeForm = document.createElement('form');
  resizeForm.setAttribute('id', 'resizeParams');
  resizeForm.setAttribute('action', route);
  resizeForm.setAttribute('method', 'POST');
  var submitButton = document.createElement('input');
  submitButton.setAttribute('value', 'Process');
  submitButton.setAttribute('type', 'submit');
  var instructions = document.getElementById("instructions");
  instructions.innerHTML = "Provide the following paramaters:";
  var imageControl = document.getElementById("imageControl");
  imageControl.innerHTML = '';

  var x = document.createElement('input');
  x.placeholder = "enter x dimension";
  x.setAttribute('name', 'x');
  x.setAttribute('type', 'text');

  var y = document.createElement('input');
  y.placeholder = "enter y dimension";
  y.setAttribute('name', 'y');
  y.setAttribute('type', 'text');

  var aspect = document.createElement('input');
  aspect.placeholder = "Maintain spect? 1 for yes, 0 for no";
  aspect.setAttribute('name', 'aspect');
  aspect.setAttribute('type', 'text');

  imageControl.appendChild(resizeForm);
  resizeForm.appendChild(x);
  resizeForm.appendChild(y);
  resizeForm.appendChild(aspect);
  resizeForm.appendChild(submitButton);
  resizeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    postForm(resizeForm, route)
    .then(displayImage)
  }); 

  
}


function postForm(form, route) {
  if (form == 'none') {
    return fetch(route, {
      method: 'POST',
      body: ''
    })
      .then(function(response) {
          if (response.status !== 200) {
              return Promise.reject(new Error(response.statusText));
          }
      });
  } else {
    var data = new FormData(form);
  
    return fetch(route, {
        method: 'POST',
        body: data
    })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
        });
  }
}

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
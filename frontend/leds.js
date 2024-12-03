function leds() {
  var jqScript = document.createElement('script');
  jqScript.type = 'text/javascript';
  jqScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
  jqScript.addEventListener('load', () => {
    console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
    // use jQuery below
    $('<div/>').attr('id','mainDiv').appendTo('body');
    // $('#mainDiv').append('<div>Hello, Stack Overflow users</div>');
    // buildButtons();
    var bsStyles = document.createElement('link');
    bsStyles.type = 'text/css';
    bsStyles.rel = 'stylesheet';
    bsStyles.href = 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css';
    document.head.appendChild(bsStyles);
    var bsScript = document.createElement('script');
    bsScript.type = 'text/javascript';
    bsScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js';
    bsScript.addEventListener('load', () => {

    });
    document.head.appendChild(bsScript);
  });
  document.head.appendChild(jqScript);

  let ledState = {
    0: 'off',
    1: 'off',
    2: 'off',
    3: 'off',
    4: 'off',
    5: 'off',
    6: 'off',
    7: 'off'
  };
  $.get('/api/ledsalloff');
  for(let i = 0; i < 8; i++) {
    $('#mainDiv').append('<p>PIN ' + i + ' is ' + ledState[i] + ' </p>');
    $('#mainDiv').append('<p><button class="btn btn-info">Turn ' + ledState[i] === 'off' ? 'ON' : 'OFF' + '</button></p>');
  }
}

function buttonClick(buttonIndex) {
  $.get('/api/led' + buttonIndex + '/' + ledState[i] === 'off' ? 'on' : 'off');
  ledState[i] = ledState[i] === 'off' ? 'on' : 'off';
}

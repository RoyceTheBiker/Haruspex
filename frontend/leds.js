
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
    document.head.appendChild(bsScript);
    var bsTheme = document.createElement('link');
    bsTheme.type = 'text/css';
    bsTheme.rel = 'stylesheet';
    bsTheme.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css';
    document.head.appendChild(bsTheme);
    var bsTheme = document.createElement('link');
    bsTheme.type = 'font/woff';
    bsTheme.rel = 'stylesheet';
    bsTheme.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff';
    document.head.appendChild(bsTheme);
    var bsTheme = document.createElement('link');
    bsTheme.type = 'font/woff';
    bsTheme.rel = 'stylesheet';
    bsTheme.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2';
    document.head.appendChild(bsTheme);

    bsScript.addEventListener('load', () => {      
      $.get('/api/ledsalloff');
      for(let i = 0; i < 8; i++) {
        $('#mainDiv').append('<p id="pinState' + i + '">PIN ' + i + ' is ' + ledState[i] + ' </p>');
        $('#mainDiv').append('<p><button id="button_' + i + '" class="btn btn-info"></button></p>');
        let newText = '<i class="bi bi-lightbulb"></i>Turn ' + (ledState[i] === 'off' ? 'ON' : 'OFF');
        $('#button_' + i).html(newText);
        $('#button_' + i).click( () => buttonClick(i));
      }
    });
  });
  document.head.appendChild(jqScript);
}

function buttonClick(buttonIndex) {
  console.log('button click');
  $.get('/api/led/' + (ledState[buttonIndex] === 'off' ? 'on' : 'off') + '/' + buttonIndex);
  ledState[buttonIndex] = ledState[buttonIndex] === 'off' ? 'on' : 'off';
  $('#pinState' + buttonIndex).html('PIN ' + buttonIndex + ' is ' + (ledState[buttonIndex] === 'off' ? 'off' : 'on'));
  $('#button_' + buttonIndex).html('<i class="bi bi-lightbulb"></i>Turn ' + (ledState[buttonIndex] === 'off' ? 'ON' : 'OFF'));
}

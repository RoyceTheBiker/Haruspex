function haruspex() {
  var jqScript = document.createElement('script');
  jqScript.type = 'text/javascript';
  jqScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
  jqScript.addEventListener('load', () => {
    console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
    // use jQuery below
    $('<div/>').attr('id','mainDiv').appendTo('body');
    $('#mainDiv').load(CdnHost + '/haruspex.html');
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
}

// function buildButtons() {
//   for(let i = 0; i < 8; i++) {
//     $('#mainDiv').append('<p>PIN ' + i + ' - State off</p>');
//     $('#mainDiv').append('<p><a href="/' + 1 + '/on"><button class="btn btn-info">ON</button></a></p>');
//   }
// }

function buttonClick(buttonName) {
  $.get('/api/' + buttonName);
}

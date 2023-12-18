$(document).ready(function() {
    if (document.addEventListener) { // IE >= 9; other browsers
        document.addEventListener('contextmenu', function(e) {
            alert("Tu a fait un clique"); //here you draw your own menu
            e.preventDefault();
        }, false);
    } else { // IE < 9
        document.attachEvent('oncontextmenu', function() {
            alert("Tu a fait un clique");
            window.event.returnValue = false;
        });
    }
})
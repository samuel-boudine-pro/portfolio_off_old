$(document).ready(function() {
    // var d = new Date();
    // var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    // var hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    // var fullDate = date + ' ' + hours;
    // console.log(fullDate);


    var d = new Date();
    var date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    var heure = d.getHours();
    var minute = d.getMinutes();
    var seconde = d.getSeconds();
    var f = function() {
        if (seconde < 59)
            seconde++;
        else {
            minute++;
            seconde = 00;
        }
        if (minute > 59) {
            heure++;
            minute = 0;
        }
        var fullhours = heure + ":" + minute + ":" + seconde
        var fulldate = date;
        $("#horloge").text(fulldate + ' ' + fullhours);
        setTimeout(f, 1000);
    }
    setTimeout(f, 1000);


})
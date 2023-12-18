var full_screen_bool = false

// $(function() {
$(".window").draggable({
    containment: "#modal_os",
    cursor: "move",
    scroll: false
});


$(".window_widen").on("click", function() {
    var window = $(this).parent().parent().parent().parent().attr('id');
    ///////////////////////////////////////////
    var window_position = $("#" + window).position();
    // alert("id parents" + window + " et le Top: " + window_position.top + " Left: " + window_position.left);
    ////////////////////////////////////////
    /////////////////////////////////////////////////////////
    if (full_screen_bool === true) {
        $('#container_view').css({ "height": "calc(100% - 120px)", })
        $('.deskop_deco').css({
            "display": "block",
        });
        $('.window').css({
            "display": "block",
            "z-index": "1"
        });
        $('#' + window).css({
            "width": "calc(100% - 20%)",
            "height": "calc(100% - 110px)",
            "margin": "0px",
            "top": "20px",
            "left": "20px",
            "z-index": "10"
        })
        $('.navbar').css({
            "display": "block",
        });

        $('.taskBar').css({
            "display": "block",
        });


        full_screen_bool = false;
    } else {
        $('.window').css({
            "display": "none",
        });
        $('#' + window).css({
            "width": "100%",
            "height": "100%",
            "margin": "0px",
            "top": "0",
            "left": "0",
            "display": "block",
        })
        $('.navbar').css({
            "display": "none",
        });
        $('.deskop_deco').css({
            "display": "none",
        });
        $('.taskBar').css({
            "display": "none",
        });

        $('#container_view').css({ "height": "100%", })
        full_screen_bool = true

    }
});

//////////////////////////////////////////////////////////////////
$(".menu_os_Full").on("click", function() {
    var task_id = this.id.substring(8);
    //console.log(task_id)
    if ($('#window_' + task_id).css('display') == 'none') {
        console.log(task_id + " est block")
        $('#window_' + task_id).css({
            "display": "block"
        })
        $('.window').removeClass('active')
        $('#window_' + task_id).addClass('active')

    } else {
        if ($('#window_' + task_id).hasClass('active')) {
            console.log(task_id + " est none")
            $('#window_' + task_id).css({
                "display": "none"
            })
            $('.window').removeClass('active')
        } else {
            $('.window').css({
                "z-index": "1"
            })
            $('#window_' + task_id).css({
                "z-index": "10"
            })
            $('.window').removeClass('active')
            $('#window_' + task_id).addClass('active')
        }
    }
})

$(".window_close").on("click", function() {
    var window = $(this).parent().parent().parent().parent().attr('id');
    console.log(window)
    if (full_screen_bool === true) {
        $('.navbar').css({
            "display": "block",
        });
        $('.deskop_deco').css({
            "display": "block",
        });
        $('.window').css({
            "display": "block",
        });
        $('.taskBar').css({
            "display": "block",
        });
        full_screen_bool = false
    }
    $("#" + window).css({
        "display": "none"
    })
})


$(".window").resizable({
    containment: "#container_view"
});


////////////////////////////////////////////////////////////////////

//console.log($('#container_view .window').length) //recuperer le nombre de fenetre ouverte 

////////////////////////////////////////////////////////////////////

// function Calculator() {
//     that = this,
//         this.field = "input#number",
//         this.button = "#body .buttons",
//         this.init = false,

//         this.run = function() {
//             $(this.buttons_calcular).click(function() {
//                 var value = $(this).html();

//                 if (that.init == false) {
//                     $(that.field).val("");
//                     that.init = true;
//                 }

//                 if (value != "=")
//                     $(that.field).val($(that.field).val() + value);

//                 that.dispatcher(value);
//             });
//         },

//         this.dispatcher = function(value) {
//             if ($(this.field).val().indexOf("/") != -1)
//                 this.operation(value, "/");
//             if ($(this.field).val().indexOf("*") != -1)
//                 this.operation(value, "*");
//             if ($(this.field).val().indexOf("-") != -1)
//                 this.operation(value, "-");
//             if ($(this.field).val().indexOf("+") != -1)
//                 this.operation(value, "+");
//         },

//         this.operation = function(value, symbol) {
//             var numbers = $(this.field).val().split(symbol),
//                 result;

//             if (symbol == "/")
//                 result = numbers[0] / numbers[1];
//             else if (symbol == "*")
//                 result = numbers[0] * numbers[1];
//             else if (symbol == "-")
//                 result = numbers[0] - numbers[1];
//             else if (symbol == "+")
//                 result = parseFloat(numbers[0]) + parseFloat(numbers[1]);

//             result = Math.round((result) * 100) / 100;

//             if (numbers.length > 1) {
//                 if (value == "=")
//                     $(this.field).val(result);
//                 else if (numbers.length > 2)
//                     $(this.field).val(result + symbol);
//             }
//         };
// }

// $(function() {
//     $(".window").resizable();
// });
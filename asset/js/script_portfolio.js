// JavaScript Document

$(document).ready(function() {
    $(window).scroll(function() {
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
            console.log('sup a 20');
        } else {
            $('.navbar').removeClass("sticky");
            console.log('inferrieur a 20');
        }
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

    //Script slide

    $('.scroll-up-btn').click(function() {
        $('html').animate({ scrollTop: 0 });
    })

    // toggle Menu/navbar

    $('.menu-btn').click(function() {
        $('.navbar .menu').toggleClass('active');
        $('.menu-btn i').toggleClass('active');
    });

    // Script typing animation 

    var typed = new Typed(".typing", {
        strings: ["Developpeur", "Designer", "Portraitriste", "Youtuber"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    })

    var typed = new Typed(".typing-2", {
        strings: ["Developpeur", "Designer", "Portraitriste", "Youtuber"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    })

    // owl carousel 
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
            },
            600: {
                items: 2,
                nav: false,
            },
            1000: {
                items: 3,
                nav: false,
            }
        }
    })

    const sr = ScrollReveal()

    sr.reveal('#home', {
        origin: 'bottom',
        duration: 1000
    });

    sr.reveal('#services', {
        origin: 'bottom',
        scale: 0.5,
        duration: 1000,
        reset: true
    });
    sr.reveal('#skills', {
        origin: 'bottom',
        scale: 0.5,
        duration: 1000,
        reset: true
    });
    sr.reveal('.right', {
        origin: 'bottom',
        scale: 0.5,
        duration: 1000,
        reset: true
    }, 500);
    sr.reveal('.left', {
        origin: 'bottom',
        scale: 0.5,
        duration: 1000,
        reset: true
    });
    sr.reveal('footer', {
        origin: 'bottom',
        scale: 0.5,
        duration: 1000,
        reset: true
    });

})
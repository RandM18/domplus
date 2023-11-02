jQuery(function ($) {
    $('.burger').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active');
    });

    const mainheadSwiper = new Swiper("#mainhead-slider", {
        loop: true,
        pagination: {
            el: "#mainhead-slider-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: "#mainhead-slider-next",
            prevEl: "#mainhead-slider-prev",
        },
    });
    const featuresSwiper = new Swiper("#features-slider", {
        loop: true,
        pagination: {
            el: "#features-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: "#features-next",
            prevEl: "#features-prev",
        },
    });
    const newsSwiper = new Swiper("#news-slider", {
        // loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: "#news-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: "#news-next",
            prevEl: "#news-prev",
        },
        breakpoints: {
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });


    $(".faq__item_btn").on('click', function(e){
        e.preventDefault();
        let item = $(this).closest('.faq__item').toggleClass('active');
    });
    
});
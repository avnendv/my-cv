$(function () {
    $(window).scroll(function(){
        if ($('html,body').scrollTop() > $(window).height()/10) {
            $('.arrow-top').removeClass('d-none');
        } else {
            $('.arrow-top').addClass('d-none');
        }
        // console.log($('html,body').scrollTop() + "-" + $(window).height())
    })

    $('.text-vertical-center .bi-mouse').click(function(){
        $('html,body').animate({scrollTop: $('#education').offset().top},600);
    })
    
    $('.arrow-top svg').click(function(){
        $('html,body').animate({scrollTop: 0},600);
    })
})
$(function () {
    $(window).scroll(function(){
        if ($('html,body').scrollTop() > $(window).height()) {
            $('.arrow-top').removeClass('d-none');
            console.log('true');
        } else {
            $('.arrow-top').addClass('d-none');
            console.log('false');
        }
    })

    $('.text-vertical-center .bi-mouse').click(function(){
        $('html,body').animate({scrollTop: $('#education').offset().top},600);
    })
    
    $('.arrow-top svg').click(function(){
        $('html,body').animate({scrollTop: 0},600);
    })
})
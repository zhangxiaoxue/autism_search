/**
 * Created by zhangxiaoxue on 11/1/15.
 */

$(function(){

    NProgress.configure({ showSpinner: false });
    NProgress.configure({ minimum: 0.1 });
    $(document)
        .ajaxStart(function() {
            NProgress.start();
        })
        .ajaxComplete(function(event, request, settings) {
            NProgress.done();
        });

    //loading bar effect
    if($('#cd-google-map').length){
        google.load("maps", "3", {other_params:'signed_in=true&libraries=places', callback: function(){

            //init
            autismMap.serviceTypeId = 1;
            autismMap.serviceType = 'State Key Resources';

            autismMap.init(hideLoadingLayer);
            addEventListener();
        }});

        function hideLoadingLayer(){
            $(".preloader-icon").delay(400).fadeOut("slow", function(){
                $(".preloader").fadeOut();
            });
        }

        function addEventListener(){
            $('.panel').on('click', '.close', function(e){
                e.preventDefault();
                $('.panel').fadeOut('fast');
                $('#cd-zoom-in, #cd-zoom-out, #cd-my-location').css('marginLeft', 10);
            });

            $('.modal').on('click', '.close', function(e){
                e.preventDefault();
                $('.modal').fadeOut();
            });
        }
    }

});

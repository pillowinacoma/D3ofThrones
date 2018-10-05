$(document).ready(function() {
    //TextBox of number relation inspector

    var nav = $("nav");
    var arrow = $('.fleche');
    var disp = $("#display");

    jQuery('#nbrelations').keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });


    // Hide/Show nav
    $('#cash2').click(function() {

        

        if(arrow.hasClass("flecheRotate")){
            nav.animate({width:'toggle'},350);

            arrow.animate({
                left: "16em",
            });
            arrow.removeClass("flecheRotate"); 
            disp.animate({left: "15.5em",});             
            setTimeout(function(){
                $("nav *").fadeIn(100);
            }, 300);     
        }else{
            $("nav *").fadeOut(100);
            setTimeout(function(){
                nav.animate({width:'toggle'},350);
                arrow.animate({
                    left: "1em",
                });
                arrow.addClass("flecheRotate");
                disp.animate({left: "0em",});            
            }, 100);                
        }

    });

});
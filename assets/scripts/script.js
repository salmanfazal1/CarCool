$(document).ready(function(){
    $("button.main").click(function() {
        $("article#profile").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.login").click(function() {
        $("article#profile").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.about").click(function() {
        $("article#about").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.aboutback").click(function() {
        $("article#about").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.listing").click(function(){
        $("article#listing").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.listingback").click(function(){
        $("article#listing").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.reserve").click(function(){
        $("article#listing").toggleClass("hidden");
        $("article#profile").toggleClass("hidden");
    });
    $("button.interest").click(function(){
        $("article#listing").toggleClass("hidden");
        $("article#profile").toggleClass("hidden");
    });
    $("button.signup").click(function(){
        $("article#main").toggleClass("hidden");
        $("article#signupmain").toggleClass("hidden");
    });
    $("button.carcool").click(function(){
        $("article#signupcool").toggleClass("hidden");
        $("article#signupmain").toggleClass("hidden");
    });
    $("button.carrule").click(function(){
        $("article#signuprule").toggleClass("hidden");
        $("article#signupmain").toggleClass("hidden");
    });
    $("button.coolfinish").click(function(){
        //var data = JSON.stringify($('#carcooler').serializeArray());
        var data = $('#carcooler').serializeArray();
        var json = {};
        $.each(data, function(){
            json[this.name] = this.value;
        })
        //console.log(data);
        $.post('carcoolersignup', JSON.stringify(json), function(data){
            if (data == 1 ) {
                    $("article#signupcool").toggleClass("hidden");
                    $("article#profile").toggleClass("hidden");
            }/*else if(data == 2){

            }*/
        })

    });
    $("button.rulefinish").click(function(){
        //var data = JSON.stringify($('#carruler').serializeArray());
        var data = $('#carcooler').serializeArray();
        var json = {};
        $.each(data, function(){
            json[this.name] = this.value;
        })
        $.post('carrulersignup', JSON.stringify(json), function(data){
            if (data == 1){
                $("article#signuprule").toggleClass("hidden");
                $("article#profile").toggleClass("hidden");
            }
        })
        
    });
});

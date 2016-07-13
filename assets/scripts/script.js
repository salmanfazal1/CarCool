$(document).ready(function(){
    $("button.main").click(function() {
        $("article#profile").toggleClass("hidden");
        $("article#main").toggleClass("hidden");
    });
    $("button.profile").click(function() {
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
});

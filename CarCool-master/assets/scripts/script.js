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
});

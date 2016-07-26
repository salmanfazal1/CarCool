$(document).ready(function(){
        //button to show all listings
     $("button#showlistings").click(function() {
        $("p#createdmsg").toggleClass("hidden");
        $("button#backtomenu").toggleClass("hidden");
        $("article#create_listing").toggleClass("hidden");
        
        var $listings = ("#list_listings");
        
        $.ajax({
            type: 'GET',
            url: 'carcool/listings', //working on this still
            success: function(listings){
                $.each(listings, function(i, listing){
                    $listings.append('<li>' + listing.name + ' owned by ' + listing.username + '<li>');
                    });
            },
            error: function(){
                alert('error loading listings');
            }
            
            
            });
    });
     
     //button to create new listing
     $("button#createlisting").on('click', function() {
        
        $("p#createdmsg").toggleClass("hidden");
        $("button#backtomenu").toggleClass("hidden");
        $("article#create_listing").toggleClass("hidden");
        
        var $listings = ("#list_listings");
        
        //create variable in json format
        var listing = {
            name: $("p#carname").val(),
            license: $("p#license").val(),
            seats: $("p#seats").val(),
            ac: $("p#ac").val(),
            auto: $("p#auto").val(),
            price: $("p#price").val()
        };
        
        
        //need to brush up on this
        $.ajax({
            type: 'POST',
            url: 'carcool/addlisting',
            data: listing,
            success: function(newlisting){
                $listings.append('<li>' + newlisting.name + ' owned by ' + newlisting.username + '<li>');
            },
            error: function(){
                alert('error creating listing');
            }
            
            });
        
        
        
        
        
     });
     
     
        
        
        
    
    
    
    
    
    });
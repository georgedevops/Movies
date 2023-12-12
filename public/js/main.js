/**********************************************************************************
 * 
 *  ITE5315 – Project* I declare that this assignment is my own work in accordance with 
 * Humber Academic Policy.* No part of this assignment has been copied manually or electronically 
 * from any other source* (including web sites) or distributed to other students.** 
 * Group member 
 * Name:George Devid John Thekkineth__ Student IDs: _NO1547325___ 
 * Name:Keziah Thomas__ Student IDs: _N01541155___ 
 * Date: __12th December________************************************
 * *********************************************/
// Wait for document to be ready
$(document).ready(function(){
    // Add listener for id
    $(".delete-book").on("click", function(e){
        // Get id when button clicked
        $target = $(e.target);
        const id = $target.attr("data-id");
        // Send request to expresss with DELETE method
        $.ajax({
            type: "DELETE",
            url: "/book/" + id,
            success: function(response){
                // Show book deleted and redirect
                alert("Deleting Book");
                window.location.href="/";
            },
            error: function(err){
                console.log(err);
            }
        })
    })
});

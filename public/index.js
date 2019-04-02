
  
  $(document).ready(function(){
   
        $('.tabs').tabs();
      
        
     
        $('.parallax').parallax();


        $('.modal').modal();
        
      });
 


    //   $(".scrape").on("click", function(){
    //       alert("Articles have been scraped")

    //        $.ajax("/scrape", {
    //         type: "POST",
    //        }).then(function(){
               
    //        });
          
    //   });

  $(".favorite").on("click", function(){
     
    var id = $(this).attr("data-id");
      console.log(id);
     

      $.ajax("/articles/" + id, {
        type: "PUT",
        
      }).then(
        function() {
      });
      location.reload();
    });

  
$(".newNote").on("submit", function(event){

    event.preventDefault();

    var id = $(this).attr("data-id");
    
    console.log(id);
    
    var newNote = {
        body: $("."+id).val()
    }
    console.log(newNote)
    
    $.ajax("/note/" + id , {
        method: "POST",
        data: newNote
}).then(function(data){
      console.log(data);
     
});
location.reload();
});

$(".deletescrape").on("click", function(event) {
    

    // Send the DELETE request.
    $.ajax("/delete", {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted all articles");
        // Reload the page to get the updated list
        
      });
      location.reload();
  });

  $(".deletenote").on("click", function(){
     var id =  $(this).attr("data-id");
      $.ajax("/deleteNote/" + id, {
          type: "DELETE"
      }).then(function(){
          console.log("deleted this note " + id)
      });
      location.reload()
  });


//   $("#getnote").on("click", function(){
//     var id = $(this).attr("data-id");
//       $.ajax("/notes/" + id, {
//           type: "GET"
//       }).then(function(data){
//           console.log(data);
//       });
//   });

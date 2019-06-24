// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // $scope variables
    $scope.loadingClass = "show";
    $scope.formData = {
      author: {
        name:"",
        id:"",
        nickname:""
      },
      post_title:"",
      post_content:""
    };


    console.log('location');
    console.log($window.location.pathname);

    var blogID = ($window.location.pathname.split('/')[$window.location.pathname.split('/').length-1]);

    // query for blog
    $http.get('/blog/find/'+blogID).success(function(data) {
        console.log('Got blog ');
        console.log(data);
        $scope.formData = data;
        $scope.loadingClass = "";


    })
    .error(function(data) {
        console.log('Error: ' + data);
    });




    $scope.saveBlog = ()=>{
      console.log('Submit');
      console.log($scope.formData);
      $scope.loadingClass = "show";

      $scope.formData.blogID = blogID;

      $http.post('../blog/edit/', $scope.formData).success(function(data) {
          console.log('Success Post');
          console.log('Ready for refresh');
          if (data.message == "success") {
            $window.location.href = "../blog";
          }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    };

    $scope.cancel = ()=>{
      $scope.loadingClass = "show";
      $window.location.href = "../blog";
    };




   //--------------------------------------
   // Search bar
   var searchNow = function() {
     // Declare variables
     var input, filter, table, tr, td, i;
     input = document.getElementById("search_field");
     // input = $scope.searchField;
     filter = input.value.toUpperCase();
     table = document.getElementById("data_table");
     tr = table.getElementsByTagName("tr");
     // Loop through all table rows, and hide those who don't match the search query
     for (i = 1; i < tr.length; i++) {
       // Hide Row and if it matches any query, show it
       tr[i].style.display = "none";
       // Try Name Field
       td = tr[i].getElementsByTagName("td")[3];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Nickname Field
       td = tr[i].getElementsByTagName("td")[4];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Email Field
       td = tr[i].getElementsByTagName("td")[5];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Email Field
       td = tr[i].getElementsByTagName("td")[6];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
     }
   }
   // End Search Bar
   //--------------------------------------



   //Search Bary Change
   $scope.searchUpdate = function() {
     console.log('Searching...');
     searchNow();
   };









}

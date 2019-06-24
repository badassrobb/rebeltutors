// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // $scope variables
    $scope.blogList = [];
    $scope.loadingClass = "show";
    $scope.deleteBlogID = "";
    $scope.deleteModal = "";

    // when landing on the page, get purhcases and show them
    $http.get('/tutor/blog/list')
        .success(function(data) {
            $scope.blogList = data;
            $scope.loadingClass = "";
            console.log('Blogs');
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    //

    // Edit blog
    $scope.editBlog = (blogIndex)=>{
      console.log('edit');
      $scope.loadingClass = "show";
      // console.log(('./editblog/'+$scope.blogList[blogIndex]._id));
      $window.location.href = ('./editblog/'+$scope.blogList[blogIndex]._id);
    };


    // confifm delete
    $scope.confirmDelete = (blogIndex)=>{
      $scope.deleteBlogID = blogIndex;
      $scope.deleteModal = "show";
    };

    $scope.closeDeleteModal = ()=>{
      $scope.deleteModal = "";
    }

    // Delete blog
    $scope.deleteBlog = ()=>{

      $scope.loadingClass = "show";
      $http.post('./blog/delete/'+$scope.blogList[$scope.deleteBlogID]._id).success(function(data) {
          console.log('deleted successfully');
          if (data.message == "success") {
            $window.location.reload();
          }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

    };

    // Delete blog
    $scope.addBlog = ()=>{
      $scope.loadingClass = "show";
      $window.location.href = ('./newblog');
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

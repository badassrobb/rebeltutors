// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // $scope variables
    $scope.loadingClass = "";
    $scope.formData = {
      post_title:"",
      post_content:"",
      creationDate:""
    };



    $scope.submitBlog = ()=>{
      console.log('Submit');
      console.log($scope.formData);
      $scope.loadingClass = "show";

      $http.post('./blog/new', $scope.formData).success(function(data) {
          console.log('Success Post');
          console.log('Ready for refresh');
          if (data.message == "success") {
            $window.location.href = ('./blog');
          }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

    };


}

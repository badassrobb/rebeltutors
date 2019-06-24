// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // $scope variables
    $scope.blogList = [];
    $scope.loadingClass = "show";

    $scope.blog = {};

    $scope.limitContent = 4;

    console.log($window.location.pathname);

    var blogID = ($window.location.pathname.split('/')[$window.location.pathname.split('/').length-1]);
    // when landing on the page, get purhcases and show them
    $http.get('/blog/find/'+blogID)
        .success(function(data) {
            $scope.blog = data;
            $scope.loadingClass = "";
            console.log('Blog');
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });



    // read blog now
    $scope.back = ()=>{
      $scope.loadingClass = "show";
      $window.location.href = ("/blog");
    };


}

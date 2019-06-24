// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){

    //Sentry
    Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2@sentry.io/304594').install();

    // $scope variables
    $scope.emailForm = {
      emailAddress: 1
    };
    $scope.loadingClass = "";
    $scope.successClass = "";

    $scope.sendEmail = ()=>{

      $scope.loadingClass = "show";

      // post data to emailer
      $http.post('./emailer', $scope.emailForm)
          .success(function(data) {
            console.log('SUCCESS');
            $scope.loadingClass = "";
            $scope.successClass = "show";
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
}

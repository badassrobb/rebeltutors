// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){

    //Sentry
    Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2@sentry.io/304594').install();

    $scope.errorMessage = "";
    $scope.successModalClass = "";
    $scope.errorMessageCount = 0;

    // - - - - - - - - - - - - - - - - -
    // submit form
   $scope.submitForm = function() {
     console.log('SUBMIT');
     var body = {
       email: String($scope.email).toLowerCase()
     }

     // post to server for reset
     $http.post('/tutor/forgotPassword', body)
         .success(function(data) {
           // clear the form so our user is ready to enter another
             console.log('RESULTS');
             console.log(data);
             if (data.message == "success") {
               console.log('Success');
               // $window.location.href = './login';
               $scope.successModalClass = "show";
             }
             else {
               $scope.errorMessage = "No User Found."

               if ($scope.errorMessageCount == 1) {
                 $scope.errorMessage = "Still No User Found."
               }
               else if ($scope.errorMessageCount == 2) {
                 $scope.errorMessage = "Seriously, No User Found."
               }
               else if ($scope.errorMessageCount == 3) {
                 $scope.errorMessage = "What is your problem?"
               }
               else if ($scope.errorMessageCount == 4) {
                 $scope.errorMessage = "Contact Tech support."
               }
               $scope.errorMessageCount += 1;
             }
         })
         .error(function(data) {
             console.log('Error: ' + data);
         });
   };

   // - - - - - - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - - - - - - -
   $scope.loginLink = ()=>{
     $window.location.href = "./login"
   };



}

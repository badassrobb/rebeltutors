// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){

    //Sentry
    Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2@sentry.io/304594').install();


    $scope.errorMessage = "";
    // - - - - - - - - - - - - - - - - -
    // submit form
    // - - - - - - - - - - - - - - - - -
   $scope.submitForm = function() {
     console.log('SUBMIT');
     var body = {
       email: String($scope.email).toLowerCase(),
       password: $scope.password
     }
     console.log(body);
     
     console.log(body.email);

     $http.post('/tutor/login', body)
         .success(function(data) {
           // clear the form so our user is ready to enter another
             console.log('RESULTS');
             console.log(data);
             if (data.message=="success") {
               console.log('SUCCESS');
               console.log('REDIRECT NOW');
               $window.location.href = '/tutor/tutoring';
             }
             else {
               $scope.errorMessage = data.message;
             }
         })
         .error(function(data) {
             console.log('Error: ' + data);
         });
   };
}

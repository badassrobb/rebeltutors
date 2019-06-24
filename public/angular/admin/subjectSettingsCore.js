// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // $scope variables
    $scope.subjects = [];
    $scope.fullSubjectList = [];

    // Loading Modal Show Class
    // Set to 'show' to have loading modal display
    $scope.loadingClass = "show";

    // - - - - - - - - -
    // When landing on the page, get the sujbect listings
    // $http.get('/references/subjects')
    $http.get('/references/fullSubjectListAutofill')
        .success(function(data) {
            // $scope.subjectCategories = data;
            $scope.subjects = data;
            console.log(data);
            $scope.loadingClass = "hide";

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // - - - - - - - - -
    // When landing on the page, get the tutor Subjects list
    $http.get('/references/fullSubjectList')
        .success(function(data) {
            console.log( data );
            $scope.fullSubjectList = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    // Trigger enter to submit term button
    // Get the input field
    var input = document.getElementById("addSearchTerm");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("addSubject").click();
      }
    });


    // Add Subject
    // - - - - - - - - - - - - - - - - - - - - - -
     $scope.addSubject = function() {
         $scope.loadingClass = "show";
         console.log($scope.subjects);
         $scope.subjects.push( $scope.searchTerm );
         // Save to server
         $http.post("/references/subjectList/add"+$scope.searchTerm)
             .success(function(response) {
                 $window.location.reload();
                 // $scope.loadingClass = "hide";
             })
             .error(function(data) {
                 console.log('Error: ' + data);
             });
           //complete http post

         // Clear subject field
         $scope.searchTerm = "";
     };
     // - - - - - - - - - - - - - - - - - - - - - -

     // Remove Subject
     // - - - - - - - - - - - - - - - - - - - - - -
    $scope.removeSubject = function(searchTerm) {
      $scope.loadingClass = "show";
      console.log(searchTerm);
      // $scope.subjects.sort().splice(searchTerm,1);
      // Save to server
      $http.post("/references/subjectList/remove", {remove:searchTerm})
          .success(function(response) {
              $window.location.reload();
              // $scope.loadingClass = "hide";
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
        //complete http post
    };
    // - - - - - - - - - - - - - - - - - - - - - -

    // Confirm Subject
    // - - - - - - - - - - - - - - - - - - - - - -
     $scope.confirmSubject = function(searchTerm) {
         $scope.loadingClass = "show";
         console.log('SEARCH TERM');
         console.log(searchTerm);
         // Save to server
         $http.post("/references/subjectList/confirm"+searchTerm)
             .success(function(response) {
                 $window.location.reload();
                 // $scope.loadingClass = "hide";
             })
             .error(function(data) {
                 console.log('Error: ' + data);
             });
           //complete http post

         // Clear subject field
         $scope.searchTerm = "";
     };
     // - - - - - - - - - - - - - - - - - - - - - -

}

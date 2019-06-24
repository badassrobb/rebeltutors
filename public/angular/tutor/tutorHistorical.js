// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http){

  $scope.students = [];
  $scope.myTutorID = null;
  $scope.loadingClass = "show";

  // at loadup, get my user ID
  $http.get('/tutor/myID').success(function(myID) {
    console.log('id');
    console.log(myID.id);
    $scope.myTutorID = myID.id;
  }).error(function(data){
    console.log('Error, hmm');
    console.log(data);
  });

  // list of students
  $http.get('/tutor/students/list/historical').success(function(data) {
    console.log('Students');
    console.log(data);
    $scope.students = data;
    $scope.loadingClass = "";
  }).error(function(data){
    console.log('Error, hmm');
    console.log(data);
  });


}

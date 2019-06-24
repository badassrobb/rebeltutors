// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){

  $scope.students = [];
  $scope.myTutorID = null;
  $scope.purchaseIndex = null;
  $scope.cartIndex = null;
  $scope.logHoursClass = "";
  $scope.hoursLeft = "";
  $scope.loadingClass = "show";
  $scope.logHourOptions = [];
  // hide fields when in view mode
  $scope.loggedHoursViewMode = false;


  var defaultLog = {
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm"),
    hours: 1,
    class: "",
    description: ""
  };
  $scope.logHours = defaultLog;

  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // at loadup, get my user ID
  $http.get('/tutor/myID').success(function(myID) {
    console.log('id');
    console.log(myID.id);
    $scope.myTutorID = myID.id;
  }).error(function(data){
    console.log('Error, hmm');
    console.log(data);
  });

  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // list of students
  $http.get('/tutor/students/list/active').success(function(data) {
    console.log('Students');
    console.log(data);
    $scope.students = data;
    $scope.loadingClass = "";

  }).error(function(data){
    console.log('Error, hmm');
    console.log(data);
  });

  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // log hours changed
  $scope.logHoursChanged = ()=>{
    console.log('HOURS');
    $scope.logHours = parseFloat($scope.logHours);
  };



  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // show log modal
  $scope.showLogModal = (purchaseIndex, cartIndex, assignmentIndex)=>{
    console.log('Session');
    $scope.purchaseIndex = purchaseIndex;
    $scope.cartIndex = cartIndex;
    $scope.assignmentIndex = assignmentIndex;
    // show loading modal
    $scope.logHoursClass = "show";
    $scope.loggedHoursViewMode = false;

    console.log(purchaseIndex);
    console.log(cartIndex);
    console.log(assignmentIndex);
    console.log(' - - - - ');
    console.log($scope.students[purchaseIndex].cart[cartIndex]);

    // reset logHours
    $scope.logHours = defaultLog;


    // set assigned hours
    $scope.hoursAssigned = $scope.students[purchaseIndex].cart[cartIndex].assignedTutors[assignmentIndex].assignedHours;
    // set


    // if there is no logged hours, make it
    if (!$scope.students[purchaseIndex].cart[cartIndex].loggedHours) {
      $scope.students[purchaseIndex].cart[cartIndex].loggedHours = [];
      // set hours to all hours available
      $scope.hoursLeft = $scope.students[purchaseIndex].cart[cartIndex].assignedTutors[assignmentIndex].assignedHours;
    }
    else {

      $scope.hoursLeft = $scope.students[purchaseIndex].cart[cartIndex].assignedTutors[assignmentIndex].assignedHours;
      // loop through loggedHours and subtract from hours left
      $scope.students[purchaseIndex].cart[cartIndex].loggedHours.forEach((log, logIndex)=>{
        // if it is that tutor
        if (log.tutorID == $scope.myTutorID) {
          $scope.hoursLeft -= log.hours;
        }
      });
    }




    // * * * * * * * *
    // Hour Selector
    // Index of cart item
    $scope.logHourOptions = [];
    for (var i = 0.25; i <= $scope.students[purchaseIndex].cart[cartIndex].loggedHoursLeft; i += 0.25) {
      $scope.logHourOptions.push(i);
    }
    // * * * * * * * *

  };



  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // close log modal
  $scope.closeLogModal = ()=>{
    $scope.logHoursClass = "";
  };

  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // submit log modal
  $scope.submitLogModal = ()=>{
    console.log('Submit');
    $scope.loadingClass = "show";

    var tutorLog = {
      log: $scope.logHours
    }

    tutorLog.log.tutorID = $scope.myTutorID;
    tutorLog.log.tutorFirstName = $scope.students[$scope.purchaseIndex].cart[$scope.cartIndex].assignedTutors[$scope.assignmentIndex].firstName;
    tutorLog.log.tutorLastName = $scope.students[$scope.purchaseIndex].cart[$scope.cartIndex].assignedTutors[$scope.assignmentIndex].lastName;
    tutorLog.purchaseID = $scope.students[$scope.purchaseIndex]._id;
    tutorLog.cartIndex = $scope.cartIndex;

    $http.post('/tutor/log-hours', tutorLog)
        .success(function(data) {
          // reload the purchases
          console.log('ready for reload');
            $window.location.reload();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

  };






  // - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - -
  // show log session details
  $scope.loggedHoursDetails = (log)=>{
    console.log('Log');
    console.log(log);

    console.log($scope.loggedHoursViewMode);

    $scope.loggedHoursViewMode = true;

    console.log($scope.loggedHoursViewMode);

    $scope.logHoursClass = "show";

    // fill in the details
    $scope.logHours.date = log.date;
    $scope.logHours.realDate = log.realDate;
    $scope.logHours.time = log.time;
    $scope.logHours.hours = log.hours;
    $scope.logHours.class = log.class;
    $scope.logHours.description = log.description;


  };


}

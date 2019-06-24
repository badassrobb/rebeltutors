// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);


//END TEST


function mainController($scope, $http, $window){
    // $scope variables
    $scope.newPurchase = {
      total: null,
      assignMe: false,
      cart: [{
        subjectCategory:"",
        class:"",
        price:null,
        rate:null,
        hours:1,
        hourlyRate:35,
        assignedTutors:[],
        hoursLeft:1,
        hoursAssigned:0,
        loggedHoursTotal:0,
        loggedHoursLeft:0
      }],
      date: Date.now(),
      purchaseDate: null,
      formData: {
        firstName: null,
        lastName: null,
        school: null,
        email: null,
        phone: null,
        goals: null,
      },
      deleted: false,
      square: null,
      purchaseType: "Custom",
      purchaseComplete: false
    };

    // list of tutors for assigning
    $scope.tutorList = null;
    // keep loading modal hidden
    $scope.loadingClass = "show";
    // hour options for assignement in 15 minute increments
    $scope.assignHourOptions = [0,0.25,0.5,0.75,1];
    $scope.hourOptions = [];
    // * * * * * * * *
    // Hour Selector
    $scope.hourOptions = [];
    for (var i = 1; i <= 100; i += 1) {
      $scope.hourOptions.push(i);
    }
    // * * * * * * * *
    $scope.addTutorMessage = "";
    $scope.submitMessage = "";

    var updateHours = ()=>{
      // update the hours left
      $scope.newPurchase.cart[0].hoursLeft = $scope.newPurchase.cart[0].hours;
      $scope.newPurchase.cart[0].assignedTutors.forEach((tutor, index)=>{
        $scope.newPurchase.cart[0].hoursLeft -= tutor.assignedHours;
      });
      // update assigned hours
      $scope.newPurchase.cart[0].hoursAssigned = ($scope.newPurchase.cart[0].hours - $scope.newPurchase.cart[0].hoursLeft);
      console.log('Hours Left: ' + $scope.newPurchase.cart[0].hoursLeft);
    };



    //--------------------------------------
    //--------------------------------------
    // load up list of tutors for dropdown
    $http.get('/api/tutors/list')
        .success(function(data) {
            $scope.tutorList = data;
            $scope.loadingClass = "hide";
            console.log('Tutors');
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    //--------------------------------------

    // - - - - - - - - -
    // When landing on the page, get the sujbect listings
    // $http.get('/references/subjects')
    $http.get('/references/fullSubjectListAutofill')
        .success(function(data) {
            $scope.subjectCategories = data;
            // console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    //--------------------------------------
    //--------------------------------------
    // add assigned tutor button
    $scope.addTutor = ()=>{
      console.log('Add Tutor');
      console.log($scope.tutorSelected);
      // if a tutor is selected, then add them to the assigned Tutors
      if ($scope.tutorSelected) {
        $scope.newPurchase.cart[0].assignedTutors.push({
          tutorID:$scope.tutorSelected._id,
          firstName:$scope.tutorSelected.firstName,
          lastName:$scope.tutorSelected.lastName,
          nickname:$scope.tutorSelected.nickname,
          contact:{
            phone:$scope.tutorSelected.contact.phone,
            email:$scope.tutorSelected.contact.email
          },
          assignedHours:0
        });
        $scope.tutorSelected = null;
      }
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // add assigned tutor button
    $scope.updateRate = ()=>{
      $scope.newPurchase.cart[0].hourlyRate = parseInt($scope.newPurchase.cart[0].hourlyRate);
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // update assigned hour options when the hours change
    $scope.hoursUpdated = ()=>{
      $scope.assignHourOptions = [];
      for (var i = 0.25; i <= $scope.newPurchase.cart[0].hours; i += 0.25) {
        $scope.assignHourOptions.push(i);
      }
      updateHours();
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // update tutor assigned hours
    $scope.hourAssignmentUpdate = (tutorIndex)=>{
      console.log('Update hours');
      // make sure it's not more than avaialbe hours
      updateHours();
      if ($scope.newPurchase.cart[0].hoursLeft < 0) {
        console.log('Too many hours');
        $scope.newPurchase.cart[0].assignedTutors[tutorIndex].assignedHours += $scope.newPurchase.cart[0].hoursLeft;
        updateHours();
      }
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // remove tutor from array
    $scope.removeTutor = (tutorIndex)=>{
      $scope.newPurchase.cart[0].assignedTutors.splice(tutorIndex, 1);
      updateHours();
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // submit
    $scope.submit = ()=>{
      $scope.submitMessage = "";
      var submitWorthy = true;
      // check for valid inputs
      if (!$scope.newPurchase.formData.firstName) {
        $scope.submitMessage += "- Enter Student First Name.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.formData.lastName) {
        $scope.submitMessage += "- Enter Student Last Name.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.formData.email) {
        $scope.submitMessage += "- Enter Student E-mail.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.formData.phone) {
        $scope.submitMessage += "- Enter Student Phone Number.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.cart[0].class) {
        $scope.submitMessage += "- Enter Class.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.cart[0].subjectCategory) {
        $scope.submitMessage += "- Enter a Subject Category.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.cart[0].assignedTutors.length > 0) {
        $scope.submitMessage += "- Assign at least one tutor.\n"
        submitWorthy = false;
      }
      if (!$scope.newPurchase.cart[0].hourlyRate) {
        $scope.submitMessage += "- Enter Valid Hourly Rate.\n"
        submitWorthy = false;
      }

      // total up the values
      $scope.newPurchase.total = ($scope.newPurchase.cart[0].hours * $scope.newPurchase.cart[0].hourlyRate);

      if (submitWorthy) {
        $scope.loadingClass = "show";
        // submit to the server and redirect to purchases page
        $http.post('./customPurchaseSubmit', $scope.newPurchase)
            .success(function(data) {
              console.log('SUCCESS');
              console.log(data);
                $window.location.href ="./purchases";
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }
    };
    //--------------------------------------


}

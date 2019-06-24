// public/angular/tutorSearch.js

var badassTutorsSearch = angular.module('badassTutorsSearch',['ngCookies']);


function mainController($scope, $http, $window, $cookies, $cookieStore){
    // $scope variables and functions
    $scope.searchFields = {};
    $scope.resultsHidden = true;
    $scope.onlineResultsHidden = true;
    $scope.tutorDetails = {};
    $scope.hideLoadingWedge = true;
    $scope.hideOnlineLoadingWedge = true;
    $scope.validAddress = true;
    // search type variables
    $scope.nameSearch = false;
    $scope.tutorType = "In Person";
    $scope.locationValid = false;
    $scope.tutorVideoURL = "";



    // * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * *
    // Google City Autocomplete
    var options = {
      componentRestrictions: {country: "us"},
      types: ['geocode']
     };
     var input = document.getElementById('googlePlacesSearch');
     var autocomplete = new google.maps.places.Autocomplete(input, options);

     // Set the data fields to return when the user selects a place.
      autocomplete.setFields(
          ['address_components', 'formatted_address', 'geometry', 'name']);
    // * * * * * * * * * * * * * * * * * * *
    // End Google City Autocomplete
    // * * * * * * * * * * * * * * * * * * *




    // - - - - - - - - -
    // At startup, load up any stored cart items to scope
    var cartCookie = $cookieStore.get('cart');
    if (cartCookie) {
      $scope.cart = cartCookie;
    }
    // If there isn't an existing cart, create an empty one.
    else {
      $scope.cart = [];
    }
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


    // - - - - - - - - -
    // - - - - - - - - -
    // Search Click
    // - - - - - - - - -
    // - - - - - - - - -
    // When the search button is clicked, validate the fields, then display any results
    $scope.searchClick = function() {
      console.log('Search');
      var getPlace = autocomplete.getPlace();
      // - - - - - - - - -
      if (getPlace && $scope.searchFields.subject ) {

        if (getPlace) {

          $scope.searchFields.address_components = getPlace.address_components;
          $scope.searchFields.formatted_address = getPlace.formatted_address;
          $scope.searchFields.coordinatesX = getPlace.geometry.location.lng();
          $scope.searchFields.coordinatesY = getPlace.geometry.location.lat();
        }
        // Save Search Subject
        $scope.searchSubjectText = $scope.searchFields.subject;
        // Clear input highlighting style
        $scope.zipRequired = "";
        $scope.subjectRequired = "";
        // Show the Results section
        $scope.resultsHidden = false;
        $scope.validAddress = true;
        // Show loading animation
        $scope.hideLoadingWedge = false;
        // hide the online results from past search
        $scope.onlineResultsHidden = true;
        // search the server for in-person tutors
        // - - - - - - - - - - - - - - - - - - - -
        $http.post("/api/tutors/geosearch/", $scope.searchFields)
            .success(function(data) {
                $scope.searchResults = data;
                console.log('In-Person Tutors');
                // hide the loading animation
                $scope.hideLoadingWedge = true;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // search for online tutors
        // - - - - - - - - - - - - - - - - - - - -
        // $http.post("/api/tutors/search/online", $scope.searchFields)
        //     .success(function(data) {
        //         $scope.onlineSearchResults = data;
        //         $scope.hideOnlineLoadingWedge = true;
        //         console.log(data);
        //         console.log('Online Tutors');
        //     })
        //     .error(function(data) {
        //         console.log('Error: ' + data);
        //     });
        // - - - - - - - - - - - - - - - - - - - -


      }
      // Else, change the input style conditioning
      else {
        $scope.resultsHidden = true;
        // If no location, alert user
        if (!getPlace){
          $scope.validAddress = false;
          $scope.zipRequired = "input-required";
        }
        else {
          $scope.validAddress = true;
          $scope.zipRequired = "";
        }
        if (!$scope.searchFields.subject){
          $scope.subjectRequired = "input-required";
        }
        else{
          $scope.subjectRequired = "";
        }
      }
    }

    // search for online tutors
    // - - - - - - - - - - - - - - - - - - - -
    $scope.searchOnlineTutorsClick = ()=>{
      console.log('click');
      // show online results and online loading bar
      $scope.onlineResultsHidden = false;
      $scope.hideOnlineLoadingWedge = false;
      $http.post("/api/tutors/search/online", $scope.searchFields)
          .success(function(data) {
              $scope.onlineSearchResults = data;
              $scope.hideOnlineLoadingWedge = true;
              // console.log(data);
              // console.log('Online Tutors');
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    // - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - -
    // Update Modal with tutor information when main search result is clicked
    $scope.updateModal = (tutorIndex)=>{
      $scope.tutorDetails = $scope.searchResults[tutorIndex];
      $scope.tutorDetailsIndex = tutorIndex;
      // Determine if this profile has a video to embed it to the detailed modal view
      if ($scope.tutorDetails.profileVideo) {
        if ($scope.tutorDetails.profileVideo.includes("https://www.youtube.com/watch?v=")) {
          $scope.tutorVideoURL = $scope.tutorDetails.profileVideo.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
          console.log($scope.tutorVideoURL);
        }
      }
    };

    $scope.updateOnlineModal = (tutorIndex)=>{
      $scope.tutorDetails = $scope.onlineSearchResults[tutorIndex];
      $scope.tutorDetailsIndex = tutorIndex;
    };

    // - - - - - - - - -
    // - - - - - - - - -
    // Buy Tutors via the tutor search page
    // - - - - - - - - -
    // - - - - - - - - -
    $scope.buyTutor = (tutorIndex, onlineTutoring)=> {
      console.log('PURCHASE');
      console.log(onlineTutoring);
      // See if index is passed, otherwise you're in detail view
      if (! tutorIndex && tutorIndex != 0) {
        tutorIndex = $scope.tutorDetailsIndex
      }

      var buyTutor = null;
      if (onlineTutoring) {
        buyTutor = $scope.onlineSearchResults[tutorIndex];
      }
      else {
        buyTutor = $scope.searchResults[tutorIndex];
      }

      // create a new cart item
      var cartItem = {
        tutor: buyTutor.nickname,
        tutorID: buyTutor._id,
        hourBundle: '1',
        subjectCategory: "",
        class: "",
        price: buyTutor.rate,
        rate: buyTutor.rate,
        subjects: [],
        applyDiscount: 0,
        onlineTutorSession: onlineTutoring
      };
      if (cartItem.rate > 25) {
        cartItem.applyDiscount = 1;
      }
      // Add subjects as array
      buyTutor.subjects.forEach((item, subjectIndex)=>{
        cartItem.subjects.push(item.subjectCategory);
      });

      // add new cart item to scope cart
      $scope.cart.push(cartItem);
      // Set Cookie of purhcase
      $cookieStore.put('cart', $scope.cart);
      // Redirect to checkout
      $window.location.href = '/checkout';
    };


    // - - - - - - - - -
    // - - - - - - - - -
    // Search type toggles
    // - - - - - - - - -
    // - - - - - - - - -
    $scope.toggleSearchType = ()=>{
      $scope.nameSearch = !$scope.nameSearch;
      $scope.searchResults = [];
      $scope.onlineSearchResults = [];
      $scope.resultsHidden = true;
      $scope.searchFields.subject = "";
      $scope.searchFields.name = "";
      // Reset the google autocomplete fields.
      input.value = "";
      autocomplete = new google.maps.places.Autocomplete(input, options);

      // switch tutor result text depending on name search
      if ($scope.nameSearch) {
        console.log('NAME SEARCH');
        $scope.tutorType = "";
      }
      else {
        $scope.tutorType = "In Person";
      }
    };

    // - - - - - - - - -
    // - - - - - - - - -
    // Search type toggles
    // - - - - - - - - -
    $scope.toggleOnlineSearch = ()=>{
      $scope.searchResults = [];
      $scope.onlineSearchResults = [];
      $scope.resultsHidden = true;
      $scope.searchFields.subject = "";
      $scope.searchFields.name = "";
      input.value = "";
      if ($scope.onlineSearch) {
          $scope.onlineSearchClass = "col-md-offset-4";
      }
      else {
        $scope.onlineSearchClass = "";
      }
    };
    // - - - - - - - - -


    // - - - - - - - - -
    // Search type toggles
    $scope.searchOnlineClick = ()=>{
      console.log($scope.searchFields.subject);
      // Show the results
      $scope.resultsHidden = false;
      // show loading bar
      $scope.hideLoadingWedge = false;


      // search for online tutors
      // - - - - - - - - - - - - - - - - - - - -
      $http.post("/api/tutors/search/online", $scope.searchFields)
          .success(function(data) {
              $scope.onlineSearchResults = data;
              console.log('Online Tutors');
              $scope.hideLoadingWedge = true;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
      // - - - - - - - - - - - - - - - - - - - -

    };
    // End searchNameClick


    // - - - - - - - - -
    // Search type toggles
    $scope.searchNameClick = ()=>{
      console.log($scope.searchFields.name);
      // Show the results
      $scope.resultsHidden = false;
      // show loading bar
      $scope.hideLoadingWedge = false;


      // send search names to api server
      $http.post("/api/tutors/search/name", $scope.searchFields)
          .success(function(data) {
              $scope.searchResults = data;
              console.log(data);


              // hide the loading animation
              $scope.hideLoadingWedge = true;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

    };
    // End searchNameClick
};

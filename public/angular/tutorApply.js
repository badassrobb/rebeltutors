// public/angular/tutorApply.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){
    // local variables
    var readySubmit = false;
    var photoUpdated = false;
    // Reset image to stock
    // - - - - - - - - - - - - - - - - -
    // document.getElementById('tutorImagePreview').src = "/public/images/np_selfie.png";

    // $scope variables
    var clearFormData = {
      payRate: 20,
      location: {
        serviceDistance: 5
      },
      contact:{},
      subjects:[],
      geoCoded: {
        formmated_address: ""
      }
    };
    $scope.formData = clearFormData;
    // subjectOptions;
    $scope.subjectCategories = [];
    // clear loading modal
    $scope.loadingClass = "";
    $scope.getPlace = null;

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
          ['address_components', 'formatted_address', 'geometry', 'name', 'vicinity']);
    // * * * * * * * * * * * * * * * * * * *
    // End Google City Autocomplete
    // * * * * * * * * * * * * * * * * * * *


    var updateAddress = (callback)=>{
      // Update the geocoded fieds
      // $scope.getPlace = autocomplete.getPlace();
      if ($scope.getPlace) {
        console.log(' -------  * * * * * * * * * * *    ------- ');
        console.log(' -------  * * * * * * * * * * *    ------- ');
        console.log(' -------  * * * * * * * * * * *    ------- ');
        console.log('AUTOCOMPLETE CHANGE!!!!!');
        $scope.formData.geoCoded = {
          formatted_address : $scope.getPlace.formatted_address,
          url : $scope.getPlace.url,
          vicinity: $scope.getPlace.vicinity,
          name: $scope.getPlace.name,
          address_components: $scope.getPlace.address_components,
          geo: {
            type: "Feature",
            location: {
              type: "Point",
              coordinates: [
                $scope.getPlace.geometry.location.lng(),
                $scope.getPlace.geometry.location.lat()
              ]
            }
          }
        };
      }
      else {
        console.log(' -------     ------- ');
        console.log(' -------   NO NEW ADDRESS    ------- ');
        console.log(' -------     ------- ');
      }
      // console.log($scope.formData.geoCoded);
      callback();
    };
    // - - - - - - - - - - - - - - - - -

    // Get image file
    // - - - - - - - - - - - - - - - - -
    $scope.fileNameChanged = function() {
      // console.log('Adding Photo');
      // photo has been update
      photoUpdated = true;
      // variables for file reader
      var preview = document.getElementById('tutorImagePreview');
      var file    = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();

      reader.addEventListener("load", function () {
        preview.src = reader.result;
        $scope.formData.photo = reader.result; //base64 image
        // console.log($scope.imageSrc);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
    // - - - - - - - - - - - - - - - - -


  // When landing on the page, get the sujbect listings
  // - - - - - - - - - - - - - - - - -
    $http.get('/references/fullSubjectListAutofill')
        .success(function(data) {
          // Make there custom option
            data.splice(0,0,"Add Custom Subject");
            $scope.subjectCategories = data;
            console.log('SUBJECTS');
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // - - - - - - - - - - - - - - - - -
    // Add Tutor Modal
    // - - - - - - - - - - - - - - - - -
    $scope.createTutor = function() {
      // Update photo if there
      $scope.formData.photo = document.getElementById('tutorImagePreview').src;
      // console.log(' -- * FORM PHOTO * -- ');
      // console.log($scope.formData.photo);

      // Update location
      updateAddress(()=>{
        $http.post('/api/apply/tutor', $scope.formData)
            .success(function(data) {
              // redirect to thank you
              $window.location.href = '/applythankyou';

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      });
    };
    // - - - - - - - - - - - - - - - - -

    // - - - - - - - - - -
    // * * * Save Photo * * *
    // - - - - - - - - - -
    $scope.photoSaved = false;
    $scope.savePhoto = ()=>{
      $scope.photoSaved = true;
    };
    // * * * END SAVE PHOTO * * *
    // - - - - - - - - - -



   // Add Subject
   // - - - - - - - - - -
  $scope.addSubject = function() {
      console.log('Add Subject');
      console.log($scope.formData);
      $scope.formData.subjects.push({subjectCategory:"",classes:""});
  };
  // - - - - - - - - - -

  // Remove Subject
  // - - - - - - - - - -
 $scope.removeSubject = function(subjectIndex) {
     $scope.formData.subjects.splice(subjectIndex,1);
 };
 // - - - - - - - - - -



 // - - - - - - - - - - - - - - - - -
 // edit Photo
 // - - - - - - - - - - - - - - - - -
$scope.editPhoto = function() {
    console.log('Edit Photo');
    $scope.photoSaved = false;
};

 // * SUBMIT *
 // - - - - - - - - - -
$scope.submit = function() {
    console.log('submit');
    $scope.getPlace = autocomplete.getPlace();

    console.log( $scope.getPlace );

    // clear errorMessage
    $scope.errorMessage = "";
    // check for any required fields and add to error message
    if (!$scope.checkbox1 || !$scope.checkbox2 || !$scope.checkbox3) {
      $scope.errorMessage += ("- Please check and agree to required Terms. \n");
    }
    if (!$scope.formData.firstName) {
      $scope.errorMessage += ("- Provide First Name. \n");
    }
    if (!$scope.formData.lastName) {
      $scope.errorMessage += ("- Provide Last Name. \n");
    }
    if (!$scope.formData.nickname) {
      $scope.errorMessage += ("- Provide Nickname. \n");
    }
    if (!$scope.formData.contact.phone) {
      $scope.errorMessage += ("- Provide Phone Number. \n");
    }
    if (!$scope.formData.contact.email) {
      $scope.errorMessage += ("- Provide E-mail Address.\n");
    }
    if (!$scope.getPlace) {
      $scope.errorMessage += ("- Provide Valid Dropdown Residential Address.\n");
    }
    if (!$scope.formData.bio) {
      $scope.errorMessage += ("- Provide your Bio.\n");
    }
    if (!$scope.formData.shortBio) {
      $scope.errorMessage += ("- Provide your Bio Preview.\n");
    }
    if (!$scope.formData.education) {
      $scope.errorMessage += ("- Provide Your Education.\n");
    }

    // Check if there are errors
    if ($scope.errorMessage.length == 0) {
      console.log('NO ERROS Submit!');
      // show loading modal
      $scope.loadingClass = "show";
      $scope.createTutor();
    }
    else {
      console.log('errors');
    }


};
// - - - - - - - - - -

}

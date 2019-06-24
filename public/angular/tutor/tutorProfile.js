// public/angular/tutorCore.js

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
    payRate: 30,
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
  $scope.getPlace = null;

  // When landing on the page, get the sujbect listings
  // - - - - - - - - - - - - - - - - -
    $http.get('/references/fullSubjectListAutofill')
        .success(function(data) {
          // Make there custom option
            data.splice(0,0,"Add Custom Subject");
            $scope.subjectCategories = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
              ['address_components', 'formatted_address','vicinity', 'geometry', 'name']);
        // * * * * * * * * * * * * * * * * * * *
        // End Google City Autocomplete
        // * * * * * * * * * * * * * * * * * * *


  var updateAddress = (callback)=>{
    // Update the geocoded fieds
    if ($scope.getPlace) {
      // console.log(' -------  * * * * * * * * * * *    ------- ');
      // console.log(' -------  * * * * * * * * * * *    ------- ');
      // console.log(' -------  * * * * * * * * * * *    ------- ');
      // console.log('New Address CHANGE!!!!!');
      $scope.formData.geoCoded = {
        formatted_address : $scope.getPlace.formatted_address,
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
    // else {
    //   console.log(' -------     ------- ');
    //   console.log(' -------   NO NEW ADDRESS    ------- ');
    //   console.log(' -------     ------- ');
    // }
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




      // onload, get user data
      $http.get('/tutor/profile/data')
          .success(function(data) {
              // $scope.formData = data;
              console.log('RESULTS');
              console.log(data);

              // Reset image
              document.getElementById('tutorImagePreview').src = "/public/images/np_selfie.png";
              // Hide photo saving message
              $scope.photoUpdateRequired = true;

              if (data.photo) {
                document.getElementById('tutorImagePreview').src = data.photo;
              }


              // Reset google autocomplete if no address
              if (data.geoCoded.formatted_address) {
                console.log(' -- FORMATTED ADDRESS PRESENT');
                  input.value = data.geoCoded.formatted_address;
              }
              else {
                input.value = "";
                autocomplete = new google.maps.places.Autocomplete(input, options);
              }

              $scope.formData = {
                applyNotificaiton: data.applyNotificaiton,
                activeTutor: data.activeTutor,
                onlineTutor: data.onlineTutor,
                firstName: String(data.firstName),
                lastName: String(data.lastName),
                nickname: String(data.nickname),
                profileVideo: data.profileVideo,
                contact: {
                  phone: String(data.contact.phone),
                  email: String(data.contact.email)
                },
                bio: String(data.bio),
                shortBio: String(data.shortBio),
                rate: data.rate,
                payRate: data.payRate,
                subjects: data.subjects,
                education: String(data.education),
                schedule: String(data.schedule),
                location: {
                  serviceDistance: data.location.serviceDistance
                },
                geoCoded: data.geoCoded,
                comments: data.comments,
                partyHost: data.partyHost
              };

              if (true) {
                googlePlacesSearch

              }
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
      // end get profile
      // - - - - - - - - - - - - - - - -
      // - - - - - - - - - - - - - - - -
      // - - - - - - - - - - - - - - - -

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
   // Edit Photo
   // - - - - - - - - - - - - - - - - -
  $scope.editPhoto = function() {
      console.log('Edit Photo');
      $scope.photoSaved = false;
  };

  // - - - - - - - - - -
  // * * * Save Photo * * *
  // - - - - - - - - - -
  $scope.photoSaved = false;

  $scope.savePhoto = ()=>{
    $scope.photoSaved = true;
    $scope.newPhotoToUpload = true;
  };
  // * * * END SAVE PHOTO * * *
  // - - - - - - - - - -





  $scope.viewMode = true;

  // edit data mode
  $scope.editTutor = ()=>{
    $scope.viewMode = false;
  };

  // edit data mode
  $scope.cancelUpdate = ()=>{
    $scope.viewMode = true;
  };




  // keep track of if new address is input to validate
  $scope.addressChanged = false;
  // Address CHANGE
  $scope.addressChange = ()=>{
    console.log('Address change');
    $scope.addressChanged = true;
  };





  // - - - - - - - - - - - - - - - - -
  // Update Tutor
  // - - - - - - - - - - - - - - - - -
  $scope.updateTutor = function() {
    // If there is no autocomplete and yet address field has changed, alert invalid input
    $scope.getPlace = autocomplete.getPlace();

    if (!$scope.getPlace && $scope.addressChanged) {
      console.log('SOMETHINGS WRONG');
      // update error message
      $scope.errorMessage = "*Address field is not valid. Please select from suggested autocomplete options."
    }
    // Else, procede to send form in
    else {
      // Hide the error message
      $scope.errorMessage = "";
      // * * * SHOW loading MODAL * * *
      $scope.loadingClass = "show";
      $scope.viewMode = true;

        console.log('- - - - - - - - - - - - - -');
        console.log($scope.newPhotoToUpload);

      // check if photo file was updated, otherwise save bandwidth and remove it
      if ($scope.newPhotoToUpload == false) {
        // console.log('- - - - - - - - - - - - - -');
        // console.log(' * * * NO PHOTO UPDATED * * * *');
        // console.log('- - - - - - - - - - - - - -');
        // console.log('- - - - - - - - - - - - - -');
        $scope.formData.photo = null;
        // delete $scope.formData.photo;
      }
      else if($scope.newPhotoToUpload == true){
        // console.log(' & &  & & & & & & & & & & &');
        // console.log('  NEW PHOTO');
        // console.log(' & &  & & & & & & & & & & &');
        // Update photo if there
        $scope.formData.photo = document.getElementById('tutorImagePreview').src;
      }

      // udpate address
      updateAddress(()=>{

        $http.post('/tutor/update/', $scope.formData)
            .success(function(data) {
              // clear the form so our user is ready to enter another
                if (data.message == 'success') {
                  console.log('Success!!');
                  // clear photo update
                  $scope.newPhotoToUpload = false;
                  // update list of tutors
                  // $scope.loadingClass = "";
                  $window.location.reload();
                }
                else {
                  console.log('error :(');
                }

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

      });
    }
    // End else statement
  };
  // End updateTutor()





}

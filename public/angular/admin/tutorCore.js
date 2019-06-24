// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http, $window){

    //Sentry
    Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2@sentry.io/304594').install();

    // $scope variables
    // - - - - - - - - - - - - - - - - -
    var clearFormData = {
      activeTutor: true,
      location: {
        serviceDistance: 5
      },
      payRate:30,
      profileVideo:"",
      contact:{},
      subjects:[],
      geoCoded: {
        formmated_address: ""
      },
      local:{}
    };

    // new signup variables
    // - - - - - - - - - - - - - - - - -
    $scope.newSignupsHide = true;
    $scope.newSignups = [];
    $scope.formData = clearFormData;
    // detele modal
    $scope.deleteModalClass = "";
    $scope.deleteID = null;
    $scope.deleteName = "";
    // Modal buttons
    $scope.hideAddModal = true;
    $scope.hideUpdateModal = true;
    $scope.imageSrc = "";
    $scope.tutorModalClass = "";

    // subjectOptions;
    $scope.subjectCategories = [];
    // Loading Modal Show Class
    // Set to 'show' to have loading modal display
    $scope.loadingClass = "show";
    // hidePhotoUpdate Message
    $scope.photoUpdateRequired = true;

    // determines if a photo is needed to be uploaded to server
    $scope.newPhotoToUpload = false;

    // - - - - - - - - - - - - - - - - -
    // When landing on the page, get the sujbect listings
    // - - - - - - - - - - - - - - - - -
    // $http.get('/references/subjects')
    $http.get('/references/fullSubjectListAutofill')
        .success(function(data) {
          // Make there custom option
            data.splice(0,0,"Add Custom Subject");
            $scope.subjectCategories = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // - - - - - - - - - - - - - - - - -
    // when landing on the page, get all todos and show them
    // - - - - - - - - - - - - - - - - -
    $http.get('/api/tutors/nophotos')
        .success(function(data) {
            $scope.tutors = data;
            // update new signups
            updateNewSignups();
            // console.log(data);
            $scope.loadingClass = "";
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
              ['address_components', 'formatted_address', 'vicinity', 'geometry', 'name']);
        // * * * * * * * * * * * * * * * * * * *
        // End Google City Autocomplete
        // * * * * * * * * * * * * * * * * * * *

     // change listeners
     google.maps.event.addListener(autocomplete, 'place_changed', function () {
        //FIRE SEARCH
        console.log('PLACE CHANGED');
        // Update location input validators
        $scope.addressChanged = true;
        $scope.locationValid = true;
        // clear any error messages
        $scope.locationErrorMessage = "";
        $scope.errorMessage = "";
        // console.log('Address bool');
        // console.log($scope.addressChanged);
        // console.log($scope.locationValid);
        // console.log($scope.locationErrorMessage);
        $scope.$apply();
    });


     // Address update function
     // - - - - - - - - - - - - - - - -
     var updateNewSignups = ()=>{
       $scope.newSignups = [];
       $scope.newSignupsHide = true;
       $scope.tutors.forEach((item, tutorIndex)=>{
         if (item.applyNotificaiton) {
           $scope.newSignupsHide = false;
           $scope.newSignups.push(tutorIndex);
         }
       });
       // console.log($scope.newSignups);
     };


     // Address update function
     // - - - - - - - - - - - - - - - -
    var updateAddress = (callback)=>{
      // Update the geocoded fieds
      if ($scope.getPlace) {
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
      else {
        console.log(' -------   NO NEW ADDRESS    ------- ');
      }
      // console.log($scope.formData.geoCoded);
      callback();
    };


    // - - - - - - - - - -
    // * * * Save Photo * * *
    // - - - - - - - - - -
    $scope.photoSaved = false;
    $scope.savePhoto = ()=>{
      $scope.newPhotoToUpload = true;
      $scope.photoSaved = true;
      $scope.photoUpdateRequired = false;
    };
    // * * * END SAVE PHOTO * * *


    // - - - - - - - - - - - - - - - - -
    // Update Tutor Modal
    // - - - - - - - - - - - - - - - - -
    $scope.updateTutor = function() {
      $scope.getPlace = autocomplete.getPlace();
      // If there is no autocomplete and yet address field has changed, alert invalid input
      if (!$scope.getPlace && $scope.addressChanged) {
        console.log('SOMETHINGS WRONG');
        // update error message
        $scope.errorMessage = "*Address field is not valid. Please select from suggested autocomplete options."
      }
      // Else, procede to send form in
      else {
        // clear error message
        $scope.errorMessage = "";
        // * * * SHOW loading MODAL * * *
        $scope.loadingClass = "show";

          // console.log('- - - - - - - - - - - - - -');
          // console.log($scope.newPhotoToUpload);

        // check if photo file was updated, otherwise save bandwidth and remove it
        if ($scope.newPhotoToUpload == false) {
          $scope.formData.photo = null;
        }
        else if($scope.newPhotoToUpload == true){
          $scope.formData.photo = document.getElementById('tutorImagePreview').src;
        }

        // udpate address
        updateAddress(()=>{

          $http.put('/api/tutors/' + updateTutorId, $scope.formData)
              .success(function(data) {
                // check for duplicate email
                console.log(data);
                if (data == 'duplicate') {
                  console.log('duplicate!');
                  // window.alert("That email address is already used for another Tutor Portal Account.");
                  $scope.tutorModalClass = "show";
                  $scope.errorMessage = "ALERT! Tutor Portal Login E-mail address is already in use by another Tutor Account!";
                  // * * * HIDE loading MODAL * * *
                  $scope.loadingClass = "";
                }
                else {
                  // clear the form so our user is ready to enter another
                    $scope.formData = {};
                    $scope.formData = clearFormData;
                    // clear photo update
                    $scope.newPhotoToUpload = false;
                    // update list of tutors
                    $scope.tutors = data;
                    updateNewSignups();
                    // console.log(data);
                    // * * * HIDE loading MODAL * * *
                    // $scope.loadingClass = "";
                    $window.location.reload();
                }

              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

        });
      }
      // End else
    }
    // End updateTutor

    // - - - - - - - - - - - - - - - - -
    // Add Tutor Modal
    // - - - - - - - - - - - - - - - - -
    $scope.createTutor = function() {
      // * * * SHOW loading MODAL * * *
      $scope.loadingClass = "show";
      // Update photo if there
      $scope.formData.photo = document.getElementById('tutorImagePreview').src;
      // Update location
      updateAddress(()=>{
        $http.post('/api/tutors', $scope.formData)
            .success(function(data) {
              // clear the form so our user is ready to enter another
                $scope.formData = {};
                $scope.formData = clearFormData;
                // console.log(' -- SCOPE DATA -- ');
                // console.log( $scope.formData );
                // console.log(' -- SCOPE DATA -- ');
                // clear photo update
                $scope.newPhotoToUpload = false;
                // update list of tutors
                $scope.tutors = data;
                // console.log(data);
                // * * * HIDE loading MODAL * * *
                $scope.loadingClass = "";
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      });
    };

    // - - - - - - - - - - - - - - - - -
    //click on addTutor
    // - - - - - - - - - - - - - - - - -
    $scope.addTutor = function() {
        console.log('Add Clicked');
        // Reset google autocomplete
        input.value = "";
        // Set fields in modal view
        $scope.hideAddModal = false;
        $scope.hideUpdateModal = true;
        // Clear form data
        $scope.formData = null;
        $scope.formData = clearFormData;
        // Reset image
        document.getElementById('tutorImagePreview').src = "/public/images/np_selfie.png";
        // Reset photo Save State
        $scope.photoSaved = false;
    };

    // - - - - - - - - - - - - - - - - -
    //click on editThisTutor
    // - - - - - - - - - - - - - - - - -
    $scope.editThisTutor = function() {
        // Reset Fields in modal
        // Clear form data
        $scope.formData = null;
        $scope.formData = clearFormData;
        // Reset image
        document.getElementById('tutorImagePreview').src = "/public/images/np_selfie.png";
        // Hide photo saving message
        $scope.photoUpdateRequired = true;
        $http.get('/api/tutors/photo/'+this.tutor._id)
            .success(function(data) {
                $scope.formData.photo = data.photo;
                document.getElementById('tutorImagePreview').src = data.photo;
                console.log(data);
                console.log('Success of photo retreival');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });


        // Reset google autocomplete if no address
        if (this.tutor.geoCoded.formatted_address) {
          console.log(' -- FORMATTED ADDRESS PRESENT');
            input.value = this.tutor.geoCoded.formatted_address;
        }
        else {
          input.value = "";
          autocomplete = new google.maps.places.Autocomplete(input, options);
        }

        $scope.modalText = "Update Tutor";
        // Set fields in modal view
        $scope.hideAddModal = true;
        $scope.hideUpdateModal = false;
        updateTutorId = this.tutor._id;
        $scope.formData = {
          applyNotificaiton: this.tutor.applyNotificaiton,
          activeTutor: this.tutor.activeTutor,
          onlineTutor: this.tutor.onlineTutor,
          firstName: String(this.tutor.firstName),
          lastName: String(this.tutor.lastName),
          nickname: String(this.tutor.nickname),
          profileVideo: String(this.tutor.profileVideo),
          contact: {
            phone: String(this.tutor.contact.phone),
            email: String(this.tutor.contact.email)
          },
          bio: String(this.tutor.bio),
          shortBio: String(this.tutor.shortBio),
          rate: this.tutor.rate,
          payRate: this.tutor.payRate,
          subjects: this.tutor.subjects,
          education: String(this.tutor.education),
          schedule: String(this.tutor.schedule),
          location: {
            zip: String(this.tutor.location.zip),
            serviceDistance: this.tutor.location.serviceDistance
          },
          geoCoded: this.tutor.geoCoded,
          comments: this.tutor.comments,
          partyHost: this.tutor.partyHost,
          local: this.tutor.local
        };

        // if profile video is there, inlcude it
        if (this.tutor.profileVideo) {
          $scope.formData.profileVideo = String(this.tutor.profileVideo)
        }
        else {
          $scope.formData.profileVideo = "";
        }

        console.log($scope.formData.local);

    };

    // - - - - - - - - - - - - - - - - -
    // delete tutor first click, record ID
    // - - - - - - - - - - - - - - - - -
   $scope.cancelModal = function() {
     // console.log('CANCEL MODAL!!!@#!@#!@#!@#');
     // Clear form data
     $scope.formData = {};
     $scope.formData = clearFormData;
     // clear error message
     $scope.errorMessage = "";
     $scope.tutorModalClass = "";
   };

   // - - - - - - - - - - - - - - - - -
    // delete tutor first click, record ID
    // - - - - - - - - - - - - - - - - -
   $scope.deleteThisTutor = function(tutor) {
     // console.log('TUTOR');
     // console.log(tutor.name);
     // console.log(this.tutor.name);
      $scope.deleteModalClass = "show";
      $scope.deleteID = this.tutor._id;
      $scope.deleteName = this.tutor.name;
   };

   $scope.abortDeleteTutor = ()=>{
     $scope.deleteModalClass = "";
   }

   // - - - - - - - - - - - - - - - - -
   // * Validate Tutor
   // - - - - - - - - - - - - - - - - - - - -
  $scope.validateThisTutor = function() {
    console.log('VALIDATE');
    var tutorID = this.tutor._id;
    $scope.loadingClass = "show";
    // Send new tutor



    $http.put('/api/tutors/validate/' + this.tutor._id)
        .success(function(data) {
            console.log(' - VALIDATED TUTOR!');
            // Send email to customer
            $http.put('/api/tutors/validate/' + tutorID)
                .success(function(data) {
                    console.log(' - Email Sent!');
                    console.log('Reload page');
                    $window.location.reload();
                })
                .error(function(data) {
                    console.log('Error Sending Email: ' + data);
                });
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });



// OLD WAY WITHOUT EMAILING CUSTOMER
    //
    // // * * * *  IMPORTANT * * * *
    // this.tutor.applyNotificaiton = false;
    // this.tutor.activeTutor = true;
    // $http.put('/api/tutors/' + this.tutor._id, this.tutor)
    //     .success(function(data) {
    //         $scope.newPhotoToUpload = false;
    //         $scope.tutors = data;
    //         updateNewSignups();
    //         console.log(' - VALIDATED TUTOR!');
    //         // Send email to customer
    //         console.log(tutorID);
    //         $http.put('/api/tutors/validate/' + tutorID)
    //             .success(function(data) {
    //                 console.log(' - Email Sent!');
    //                 // console.log(data);
    //             })
    //             .error(function(data) {
    //                 console.log('Error Sending Email: ' + data);
    //             });
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data);
    //     });



  };
  // - - - - - - - - - - - - - - - - - - - -

    // - - - - - - - - - - - - - - - - -
    // delete a todo after confirmation
    // - - - - - - - - - - - - - - - - -
   $scope.deleteTutor = function() {
     $scope.loadingClass = "show";
     $scope.deleteModalClass = "";
     if ($scope.deleteID != null) {
       $http.delete('/api/tutors/' + $scope.deleteID)
           .success(function(data) {
               $scope.tutors = data;
               updateNewSignups();
               console.log(data);
               $scope.loadingClass = "";
           })
           .error(function(data) {
               console.log('Error: ' + data);
           });
     }
   };

   // - - - - - - - - - - - - - - - - -
   // Add Subject
   // - - - - - - - - - - - - - - - - -
  $scope.addSubject = function() {
      console.log('Add Subject');
      // console.log($scope.formData);
      $scope.formData.subjects.push({subjectCategory:"",classes:""});
  };

  // - - - - - - - - - - - - - - - - -
  // Remove Subject
  // - - - - - - - - - - - - - - - - -
 $scope.removeSubject = function(subjectIndex) {
     $scope.formData.subjects.splice(subjectIndex,1);
 };

  // - - - - - - - - - - - - - - - - -
  // Add Class
  // - - - - - - - - - - - - - - - - -
 $scope.addClass = function() {
     console.log('Add Class');
     // this.subject.classes.push("1");
     console.log( $scope.formData.subjects );
     // console.log($scope.formData);
     // add class for this subject
 };

 // - - - - - - - - - - - - - - - - -
 // Add Subject
 // - - - - - - - - - - - - - - - - -
$scope.editPhoto = function() {
    console.log('Edit Photo');
    $scope.photoSaved = false;
};


// keep track of if new address is input to validate
$scope.addressChanged = false;
$scope.locationValid = true;
// - - - - - - - - - - - - - - - - -
// Address change
// - - - - - - - - - - - - - - - - -
$scope.addressChange = ()=>{
  console.log('Address change');
  $scope.addressChanged = true;
  // If the change is not valid, show error message
  if ( !$scope.getPlace ) {
    $scope.locationErrorMessage = "Please choose a valid location from the autocomplete suggestions."
    $scope.errorMessage = "Please choose a valid location from the autocomplete suggestions."
    $scope.locationValid = false;
  }
  else {
    $scope.locationErrorMessage = "";
    $scope.errorMessage = "";
    $scope.locationValid = true;
  }
};



   //--------------------------------------
   // Search bar
   // - - - - - - - - - - - - - - - - -
   var searchNow = function() {
     // Declare variables
     var input, filter, table, tr, td, i;
     input = document.getElementById("search_field");
     // input = $scope.searchField;
     filter = input.value.toUpperCase();
     table = document.getElementById("data_table");
     tr = table.getElementsByTagName("tr");
     // Loop through all table rows, and hide those who don't match the search query
     for (i = 1; i < tr.length; i++) {
       // Hide Row and if it matches any query, show it
       tr[i].style.display = "none";
       // Try Name Field
       td = tr[i].getElementsByTagName("td")[3];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Nickname Field
       td = tr[i].getElementsByTagName("td")[4];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Email Field
       td = tr[i].getElementsByTagName("td")[5];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try Email Field
       td = tr[i].getElementsByTagName("td")[6];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
     }
   }
   // End Search Bar * * * * *

   // - - - - - - - - - - - - - - - - -
   //Search Bary Change
   // - - - - - - - - - - - - - - - - -
   $scope.searchUpdate = function() {
     console.log('Searching...');
     searchNow();
   };


}

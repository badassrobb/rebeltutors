// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);


//END TEST


function mainController($scope, $http, $window){
    // $scope variables
    $scope.detailPurchase = {};
    $scope.tutorList = [];
    // used for the tutor select input for assign tutors
    $scope.tutorSelect = [];
    $scope.detailPurchaseIndex = null;
    $scope.detailLoggedHourItem = null;
    $scope.hideUpdateOption = true;
    $scope.hideSelectTutor= true;
    $scope.hideEditHour = true;
    $scope.hideEditStudentEmail = true;
    $scope.hideSelectTutorArray = [];
    // keep loading modal hidden
    $scope.loadingClass = "show";
    $scope.assignHourOptions = [];
    $scope.edit = {
      newHourInput: 0
    };

    $scope.addTutorMessage = "";

    $scope.newHours = 0;


    // Log Hours var
    $scope.logHoursClass = "";
    var defaultLog = {
      name:"",
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:mm"),
      hours: 1,
      class: "",
      description: ""
    };
    $scope.logHours = defaultLog;

    //--------------------------------------
    //--------------------------------------
    // when landing on the page, get purhcases and show them
    $http.get('/api/purchases/admin')
        .success(function(data) {
            $scope.purchases = data;
            // console.log(data);
            $scope.loadingClass = "";
            $scope.updateAllCartHours();
            // console.log( $scope.purchases );
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    // load up list of tutors for dropdown
    $http.get('/api/tutors/list')
        .success(function(data) {
            $scope.tutorList = data;
            console.log('Tutors');
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    //--------------------------------------


    //--------------------------------------
    // viewPuchase Modal
    $scope.viewPurchase = (purchase)=>{

      var realIndex = $scope.purchases.indexOf(purchase);
      console.log('INDEX: ' + realIndex);
      $scope.addTutorMessage = "";
      $scope.hideSelectTutor = true;
      $scope.hideUpdateOption = true;
      $scope.detailPurchaseIndex = realIndex;
      $scope.detailPurchase = $scope.purchases[realIndex];
      // set hour assignment options equal to bought hours
      $scope.assignHourOptions = [];
      // set tutorAssign length to hideArray
      $scope.hideSelectTutorArray = [];

      $scope.detailPurchase.cart.forEach((item, index)=>{
         $scope.hideSelectTutorArray.push(true);
         // * * * * * * * *
         // * * * * * * * *
         // create options sets equal to the hours
         // Hour Selector
         // Index of cart item
         $scope.assignHourOptions[index] = [];
         for (var i = 0.25; i <= item.hours; i += 0.25) {
           $scope.assignHourOptions[index].push(i);
         }
         // * * * * * * * *
      });

    };

    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    //  remove Purchase
    $scope.removePurchase = (purchaseID)=>{
      // show the loading modal
      $scope.loadingClass = "show";
      // Post to server
      $http.post("/purchases/remove/"+purchaseID)
          .success(function(response) {
              console.log('Success on posting to checkout /payment');
              $window.location.reload();
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
        //complete http post
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // Purchase Complete toggle
    $scope.purchaseCompleteToggle = ()=>{
      $scope.loadingClass = "show";

      var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];

      $http.post('/api/purchase/update', updatePurchase)
          .success(function(data) {
            // reload the purchases
            $http.get('/api/purchases/admin')
                .success(function(data) {
                    $scope.purchases = data;
                    $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                    // console.log('eh?');
                    // console.log($scope.purchases[$scope.detailPurchaseIndex].purchaseComplete);
                    $scope.loadingClass = "";
                    $scope.updateDetailCartHours();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
              // $scope.loadingClass = "";
              // $window.location.reload();
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // Tutor Select Updated
    $scope.tutorSelectUpdated = ()=>{
      // Show update button
      $scope.hideUpdateOption = false;
    };
    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    // update cart Hours
    $scope.updateDetailCartHours = ()=>{
      // Show update button
      $scope.detailPurchase.cart.forEach((cart, cartIndex)=>{
        // set hours to zero
        $scope.detailPurchase.cart[cartIndex].hoursAssigned = 0;
        cart.assignedTutors.forEach((tutor, tutorIndex)=>{
          $scope.detailPurchase.cart[cartIndex].hoursAssigned += tutor.assignedHours;
        });
        $scope.detailPurchase.cart[cartIndex].hoursLeft = (cart.hours - $scope.detailPurchase.cart[cartIndex].hoursAssigned);
      });

    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // update cart Hours
    $scope.updateAllCartHours = ()=>{
      // Show update button
      $scope.purchases.forEach((purchase, purchaseIndex)=>{

        purchase.cart.forEach((cart, cartIndex)=>{
          // set hours to zero
          $scope.purchases[purchaseIndex].cart[cartIndex].hoursAssigned = 0;

          if (cart.assignedTutors) {
            cart.assignedTutors.forEach((tutor, tutorIndex)=>{
              $scope.purchases[purchaseIndex].cart[cartIndex].hoursAssigned += tutor.assignedHours;
            });
          }

          $scope.purchases[purchaseIndex].cart[cartIndex].hoursLeft = (cart.hours - $scope.purchases[purchaseIndex].cart[cartIndex].hoursAssigned);
        });
      })

    };
    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    // Tutor Select Updated
    $scope.removeTutor = (assignedTutorIndex, cartIndex)=>{
      // remove tutor
      $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].assignedTutors.splice(assignedTutorIndex, 1);
      // show loading
      $scope.loadingClass = "show";
      // update
      var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];

      $http.post('/api/purchase/update', updatePurchase)
          .success(function(data) {
            // reload the purchases
            $http.get('/api/purchases/admin')
                .success(function(data) {
                    $scope.purchases = data;
                    $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                    $scope.loadingClass = "";
                    $scope.updateDetailCartHours();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
              // $scope.loadingClass = "";
              // $window.location.reload();
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    // Update Assigned Tutors
    $scope.updateAssignedTutor = (cartIndex)=>{

      $scope.loadingClass = "show";
      // Hide update button
      $scope.hideUpdateOption = true;

      // // if there is not assigned tutors, create it
      if ( !$scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].assignedTutors) {
          $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].assignedTutors = [];
      }
      // add in tutor details
      var tutorInfo = {
        tutorID: $scope.tutorSelect[cartIndex]._id,
        firstName: $scope.tutorSelect[cartIndex].firstName,
        lastName: $scope.tutorSelect[cartIndex].lastName,
        nickname: $scope.tutorSelect[cartIndex].nickname,
        contact: {
          phone: $scope.tutorSelect[cartIndex].contact.phone,
          email:$scope.tutorSelect[cartIndex].contact.email
        },
        assignedHours: 1
      };
      $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].assignedTutors.push(tutorInfo);
      $scope.updateAllCartHours();
      var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];
      $http.post('/api/purchase/update', updatePurchase)
          .success(function(data) {
              // reload the purchases
              $http.get('/api/purchases/admin')
                  .success(function(data) {
                      $scope.purchases = data;
                      $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                      $scope.hideUpdateOption = true;
                      $scope.hideSelectTutor = true;
                      $scope.hideSelectTutorArray[cartIndex] = true;
                      $scope.loadingClass = "";
                  })
                  .error(function(data) {
                      console.log('Error: ' + data);
                  });
              // $window.location.reload();
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // Add Tutor
    $scope.addTutor = (cartIndex)=>{
      // clear tutor selectors
      $scope.tutorSelect = [];
      // check to see if purchase is maxed out on hours.
      // sum current hours
      var hourSum = 0;
      $scope.detailPurchase.cart[cartIndex].assignedTutors.forEach((tutor, tutorIndex)=>{
        hourSum += tutor.assignedHours;
      });
      // check to see if it maxes out
      if (hourSum >= $scope.detailPurchase.cart[cartIndex].hours) {
        // show message near button
        $scope.addTutorMessage = "Sorry, no more hours to assign.";
      }
      else {
        $scope.hideSelectTutor = false;
        $scope.hideSelectTutorArray[cartIndex] = false;
      }
    };
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // update hours
    $scope.hourAssignmentUpdate = (assignedIndex, cartIndex)=>{
      // show loading bar
      $scope.loadingClass = "show";

      // calculate hours bought and left
      $scope.updateDetailCartHours();

      // if there are too many hours alloted, set it to the max
      if ($scope.detailPurchase.cart[0].hoursLeft < 0) {
        $scope.detailPurchase.cart[cartIndex].assignedTutors[assignedIndex].assignedHours += $scope.detailPurchase.cart[0].hoursLeft;
      }
      // calculate hours bought and left
      $scope.updateDetailCartHours();
      // update the purchases array
      $scope.purchases[$scope.detailPurchaseIndex].cart = $scope.detailPurchase.cart;

      // Send to server for record
      var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];
      $http.post('/api/purchase/update', updatePurchase)
          .success(function(data) {
              // reload the purchases
              $http.get('/api/purchases/admin')
                  .success(function(data) {
                      $scope.purchases = data;
                      $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                      $scope.hideUpdateOption = true;
                      $scope.hideSelectTutor = true;
                      $scope.hideSelectTutorArray[cartIndex] = true;
                      $scope.loadingClass = "";
                  })
                  .error(function(data) {
                      console.log('Error: ' + data);
                  });
              // $window.location.reload();
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    //--------------------------------------


   //--------------------------------------
   // Search bar
   var searchNow = function() {
     // Declare variables
     var input, filter, table, tr, td, i;
     input = document.getElementById("search_field");
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
       // Try student email Field
       td = tr[i].getElementsByTagName("td")[4];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
       // Try total Field
       td = tr[i].getElementsByTagName("td")[5];
       if (td) {
         if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
           tr[i].style.display = "";
         }
       }
     }
   }
   // End Search Bar
   //--------------------------------------

   //Search Bary Change
   $scope.searchUpdate = function() {
     console.log('Searching...');
     searchNow();
   };


   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // show log session details
   $scope.loggedHoursDetails = (log, cartIndex, loggedHourIndex)=>{
     $scope.detailLoggedHourItem = log;
     $scope.loggedHoursViewMode = true;
     $scope.logHoursClass = "show";
     $scope.logHours.cartIndex = cartIndex;
     $scope.logHours.loggedHourIndex = loggedHourIndex;

     // fill in the details
     $scope.logHours.name = log.tutorFirstName + log.tutorLastName;
     $scope.logHours.date = log.date;
     $scope.logHours.realDate = log.realDate;
     $scope.logHours.time = log.time;
     $scope.logHours.hours = log.hours;
     $scope.logHours.class = log.class;
     $scope.logHours.description = log.description;
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // close log modal
   $scope.closeLogModal = ()=>{
     $scope.logHoursClass = "";
     $scope.detailLoggedHourItem = null;
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // edit purchase hours
   $scope.editHours = (cartIndex)=>{
     console.log( "Edit Cart Item");
     $scope.edit.errorMessage = "";
     $scope.hideEditHour = false;
     console.log( $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].hours );
     $scope.edit.newHours = $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].hours
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // save new purchase hours
   $scope.saveHours = (cartIndex)=>{
     console.log( "Save Cart Item");
     console.log( $scope.edit.newHours );

     // parse the input into a float
     $scope.edit.newHours = parseFloat($scope.edit.newHours);

     // validate input
     // if it's not a valid number, make a note and don't save
     if ($scope.edit.newHours == 0 || !$scope.edit.newHours) {
       $scope.edit.errorMessage = "Enter a valid number of hours";
     }
     else {
       $scope.edit.errorMessage = "";
       // check to see if this is the original set of hours
       if (!$scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].originalHours) {
         console.log('No Original Hours');
         $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].originalHours = $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].hours;
       }
       else {
         console.log('Original Hours are');
         console.log($scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].originalHours);
       }
       // update the hours for this cart item
       $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].hours = $scope.edit.newHours;

       var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];

       console.log('Updating Hours');
       console.log(updatePurchase);

       $scope.loadingClass = "show";

       // send update to server
       $http.post('/api/purchase/update', updatePurchase)
           .success(function(data) {
               // reload the purchases
               $http.get('/api/purchases/admin')
                   .success(function(data) {
                       $scope.purchases = data;
                       $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                       $scope.hideEditHour = true;
                       $scope.hideSelectTutorArray[cartIndex] = true;
                       $scope.loadingClass = "";
                   })
                   .error(function(data) {
                       console.log('Error: ' + data);
                   });
               // $window.location.reload();
           })
           .error(function(data) {
               console.log('Error: ' + data);
           });
     }
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // cancel edit purchase hours
   $scope.cancelEditHours = ()=>{
     $scope.hideEditHour = true;
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   //  editHourChange
   $scope.editHourChange = (cartIndex)=>{
     if ($scope.edit.newHours < 0) {
       $scope.edit.newHours = $scope.purchases[$scope.detailPurchaseIndex].cart[cartIndex].hours;
     }
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // edit student email
   $scope.editStudentEmail = ()=>{
     $scope.hideEditStudentEmail = false;
     console.log( $scope.purchases[$scope.detailPurchaseIndex].formData.email );
     $scope.edit.newStudentEmail = $scope.purchases[$scope.detailPurchaseIndex].formData.email
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // cancel edit purchase hours
   $scope.cancelEditStudentEmail = ()=>{
     $scope.hideEditStudentEmail = true;
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // save new student email
   $scope.saveStudentEmail = (cartIndex)=>{
     console.log( "Save Cart Item");
     console.log( $scope.edit.newStudentEmail );

     // update the hours for this cart item
     $scope.purchases[$scope.detailPurchaseIndex].formData.email = $scope.edit.newStudentEmail;

     console.log($scope.purchases[$scope.detailPurchaseIndex].formData.email);

     var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];

     console.log(updatePurchase);

     $scope.loadingClass = "show";

     // send update to server
     $http.post('/api/purchase/update', updatePurchase)
         .success(function(data) {
             // reload the purchases
             $http.get('/api/purchases/admin')
                 .success(function(data) {
                     $scope.purchases = data;
                     $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
                     $scope.hideEditStudentEmail = true;
                     $scope.hideSelectTutorArray[cartIndex] = true;
                     $scope.loadingClass = "";
                 })
                 .error(function(data) {
                     console.log('Error: ' + data);
                 });
             // $window.location.reload();
         })
         .error(function(data) {
             console.log('Error: ' + data);
         });
   };


   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // delete loggedHours
   $scope.deleteLoggedHour = ()=>{
     console.log('DELETE HOURS');
     // remove those logHours
     console.log($scope.detailLoggedHourItem);

     // find index of logged hour item and delete it
     var tempIndex = $scope.purchases[$scope.detailPurchaseIndex].cart[$scope.logHours.cartIndex].loggedHours.indexOf($scope.detailLoggedHourItem);
     $scope.purchases[$scope.detailPurchaseIndex].cart[$scope.logHours.cartIndex].loggedHours.splice(tempIndex, 1);

     $scope.logHoursClass = "";
     $scope.loadingClass = "show";

     // update server
     var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];
     $http.post('/api/purchase/update', updatePurchase)
         .success(function(data) {
             if (data.message=="success") {
               $window.location.reload();
             }
         })
         .error(function(data) {
             console.log('Error: ' + data);
         });
   };

   // - - - - - - - - - - - - - -
   // - - - - - - - - - - - - - -
   // Paid loggedHours
   $scope.purchasePaidToggle = (cartIndex, loggedHourIndex)=>{
     console.log('Paid Hours');
     // remove those logHours
     console.log($scope.detailPurchaseIndex);
     console.log(cartIndex);
     console.log(loggedHourIndex);


     $scope.loadingClass = "show";
     // find index of logged hour item and delete it
     // update server
     console.log($scope.purchases[$scope.detailPurchaseIndex]);

     var updatePurchase = $scope.purchases[$scope.detailPurchaseIndex];
     $http.post('/api/purchase/update', updatePurchase)
         .success(function(data) {
             if (data.message=="success") {
               // $window.location.reload();
               console.log('Complete');
               $scope.loadingClass = "";
             }
         })
         .error(function(data) {
             console.log('Error: ' + data);
         });


   };


}

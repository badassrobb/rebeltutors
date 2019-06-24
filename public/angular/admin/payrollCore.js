// public/angular/purchasesCore.js

var badassTutors = angular.module('badassTutors',[]);


//END TEST


function mainController($scope, $http, $window){
    // $scope variables
    $scope.loadingClass = "show";


    //--------------------------------------
    //--------------------------------------
    // when landing on the page, get purhcases and show them
    $http.get('/api/purchases/admin')
        .success(function(data) {
            $scope.purchases = data;
            // console.log(data);
            $scope.loadingClass = "";
            console.log( $scope.purchases );
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    //--------------------------------------



    //--------------------------------------
    //--------------------------------------
    // Update Assigned Tutors
    $scope.updatePurchasePayroll = (cartIndex)=>{

      // $scope.loadingClass = "show";

      console.log('Update PAYROLL');
      console.log('THIS Cart');
      console.log(cartIndex);


      // $http.post('/api/purchase/update', updatePurchase)
      //     .success(function(data) {
      //         // reload the purchases
      //         $http.get('/api/purchases/admin')
      //             .success(function(data) {
      //                 $scope.purchases = data;
      //                 $scope.detailPurchase = $scope.purchases[$scope.detailPurchaseIndex];
      //                 $scope.hideUpdateOption = true;
      //                 $scope.hideSelectTutor = true;
      //                 $scope.hideSelectTutorArray[cartIndex] = true;
      //                 $scope.loadingClass = "";
      //             })
      //             .error(function(data) {
      //                 console.log('Error: ' + data);
      //             });
      //         // $window.location.reload();
      //     })
      //     .error(function(data) {
      //         console.log('Error: ' + data);
      //     });



    };
    //--------------------------------------


}

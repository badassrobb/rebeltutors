// public/angular/tutorCore.js

var badassTutors = angular.module('badassTutors',[]);

//END TEST

function mainController($scope, $http){

  $scope.noMatch = true;
  $scope.resetHidden = true;
  $scope.loadingClass = "";
  $scope.updateSuccessMessage = false;
  $scope.newPass = {
    pass1:"",
    pass2:""
  };
  

  // onload, get user data
  $http.get('/tutor/profile/data')
      .success(function(data) {
          $scope.formData = data;
          console.log('RESULTS');
          console.log(data);
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });


  $scope.resetShow = ()=>{
    console.log('Reset');
    $scope.resetHidden = false;
    $scope.updateSuccessMessage = false;
  }

  $scope.updatePassword = ()=>{
    console.log('Update');
    $scope.resetHidden = true;
    $scope.loadingClass = "show";
    // POST
    $http.post('/tutor/password-reset', $scope.newPass)
        .success(function(data) {
          console.log('Password updated');
          console.log(data);
          // reset password fields
          $scope.newPass.pass1 = "";
          $scope.newPass.pass2 = "";
          // hide loading wheel
          if (data.message == "success") {
              $scope.loadingClass = "";
              console.log('success');
              $scope.updateSuccessMessage = true;
          }
          else {
            console.log('error with post');
          }

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    // END POST

  }

  $scope.cancel = ()=>{
    console.log($scope.newPass.pass1);

    $scope.newPass.pass1 = "";
    $scope.newPass.pass2 = "";
    $scope.resetHidden = true;
  }

  $scope.checkPassword = ()=>{
    console.log();
    if($scope.newPass.pass1 != $scope.newPass.pass2 && $scope.newPass.pass1 != ""){
      $scope.noMatch = true;
    }
    else{
      $scope.noMatch = false;
    }
  }


}

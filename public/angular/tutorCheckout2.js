// public/angular/tutorCheckout.js

var badassTutorsCheckout = angular.module('badassTutorsCheckout',['ngCookies']);


function mainController($scope, $window, $http, $cookies, $cookieStore){
  // If no body cookie, then go to checkout
  // console.log($cookieStore.get('body').length == 0);
  // console.log('COOKIE');
  if ($cookieStore.get('body').length == 0) {
    // console.log('NOPE');
    $window.location.href = '/checkout';
  }



  // $scope variables and functions
  // Set scope variables
  $scope.total = 0;
  $scope.emptyCart = true;
  $scope.formData = {
    studentFirstName: "",
    studentLastName: "",
    school: "",
    studentEmail: "",
    studentPhone: "",
    studentAddress: "",
    studentGoals: ""
  };

  // $scope.sq_address1 = "123 Main St";
  // $scope.sq_city = "Templeton";
  // $scope.sq_state = "CA";
  // $scope.sq_email = "tester@gmail.com";
  // $scope.loadingClass = "";


  // -------------------------------------------------
  // At startup, load up any stored cart items to scope
  // -------------------------------------------------
  // create body object
  var cartBody = $cookieStore.get('body');
  // console.log('BODY TO SEND');
  // console.log(cartBody);
  $scope.total = cartBody.total;



  $scope.cancelOrder = ()=>{
    $cookieStore.put('body', []);
    // console.log('BODY');
    // console.log($cookieStore.get('body'));
    $window.location.href = '/checkout';
    $
  };


};

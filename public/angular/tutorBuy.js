// public/angular/tutorCheckout.js

var badassTutorsCheckout = angular.module('badassTutorsCheckout',['ngCookies']);


function mainController($scope, $window, $http, $cookies, $cookieStore){
  // $scope variables and functions
  console.log('Hello');
  // Set scope variables
  $scope.total = 0;
  $scope.emptyCart = true;
  // When landing on the page, get the sujbect listings
  $http.get('/references/subjects')
      .success(function(data) {
          $scope.subjectCategories = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

  // Buy Book Button action
  // adds package into the cart and saves it to the clients cookie
  $scope.buyBook = ()=>{
    var cartItem = {
      book: true,
      tutor: "Book",
      price: 69.95,
      // price: 1.00,
      subjectCategory: "",
      class: ""
    };
    // Push purchase to scope
    $scope.cart.push(cartItem);
    // Set Cookie of purhcase
    $cookieStore.put('cart', $scope.cart);
    $window.location.href = '/checkout';
  }

  // Buy Hours Package Button action
  // adds package into the cart and saves it to the clients cookie
  $scope.buyHours = (hourPackage)=>{
    var cartItem = {
      tutor: "Standard Package",
      hourBundle: hourPackage,
      subjectCategory: "",
      class: "",
      rate: 65,
      applyDiscount: 1
    };
    // Push purchase to scope
    $scope.cart.push(cartItem);
    // Set Cookie of purhcase
    $cookieStore.put('cart', $scope.cart);
    $window.location.href = '/checkout';
  }

  // Remove cart item
  $scope.removeCartItem = (itemIndex)=> {
    // Remove Item
    $scope.cart.splice(itemIndex,1);
    // Update cart total
    $scope.updatePricing();
    // Set Cookie of purhcase
    $cookieStore.put('cart', $scope.cart);
    if ($scope.cart.length == 0) {
      $scope.emptyCart = true;
    }
    else {
      $scope.emptyCart = false;
    }
  }

  // update Pricing
  $scope.updatePricing = ()=> {
    // zero out total
    $scope.total = 0;
    // for each cart item, determin it's price and add it to the total
    $scope.cart.forEach((item, index)=>{
      if (item.hourBundle == "1") {
        $scope.total += item.rate;
      } else if (item.hourBundle == "2") {
        $scope.total += (item.rate - 5) * 4;
      } else if (item.hourBundle == "3") {
        $scope.total += (item.rate - 10) * 8;
      } else if (item.hourBundle == "4") {
        $scope.total += (item.rate - 15) * 16;
      } else if (item.hourBundle == "5") {
        $scope.total += (item.rate - 20) * 24;
      } else if (item.hourBundle == "6") {
        $scope.total += (item.rate - 5) * 16;
      } else if (item.hourBundle == "7") {
        $scope.total += (item.rate - 5) * 24;
      }
    });
    // Set Cookie of purhcase
    $cookieStore.put('cart', $scope.cart);
  }

  // -------------------------------------------------
  // At startup, load up any stored cart items to scope
  // -------------------------------------------------
  var cartCookie = $cookieStore.get('cart');
  // If there isn't an existing cart, create an empty one.
  if (cartCookie) {
    $scope.cart = cartCookie;
    $scope.emptyCart = false;
    // Update cart total
    $scope.updatePricing();
  }
  // If no coookie cart, create a blank one
  else {
    $scope.cart = [];
    $scope.emptyCart = true;
  }
  console.log($scope.cart);

};

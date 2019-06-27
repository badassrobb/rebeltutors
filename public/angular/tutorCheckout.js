// public/angular/tutorCheckout.js

var badassTutorsCheckout = angular.module('badassTutorsCheckout',['ngCookies']);


function mainController($scope, $window, $http, $cookies, $cookieStore){

  // If body cookie, then go to checkout2
  if ($cookieStore.get('body')) {
    if ($cookieStore.get('body').length != 0) {
      $window.location.href = '/checkout2';
    }
  }





  // $scope variables and functions
  console.log('Hello');
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



  // When landing on the page, get the sujbect listings
  $http.get('/references/subjects')
      .success(function(data) {
          $scope.subjectCategories = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

  // Buy Hours Package Button action
  // adds package into the cart and saves it to the clients cookie
  $scope.buyHours = (hourPackage)=>{
    var cartItem = {
      tutor: "Generic Package",
      hourBundle: hourPackage,
      subjectCategory: "",
      class: "",
      rate: 75
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
    if ($scope.cart.length > 0) {
      $scope.emptyCart = false;
    }
    else {
      $scope.emptyCart = true;
    }
  }

  // update Pricing
  $scope.updatePricing = ()=> {
    // zero out total
    $scope.total = 0;
    // for each cart item, determin it's price and add it to the total
    $scope.cart.forEach((item, index)=>{
      // check if it is a book first
      if (item.book) {
        // If it's a book, set price
        $scope.total += item.price;
      }
      // Otherwise price according to rate and discount
      else {
        // double check their rate is more than $25


        console.log('RATE');
        console.log(item.rate);
        console.log(item.applyDiscount);
        // Check each hour bundle and apply normal rate discount
        if (item.hourBundle == "1") {
          $scope.total += item.rate;
        } else if (item.hourBundle == "2") {
          $scope.total += (item.rate - (item.applyDiscount * 10) ) * 4;
        } else if (item.hourBundle == "3") {
          $scope.total += (item.rate - (item.applyDiscount * 15) ) * 8;
        } else if (item.hourBundle == "4") {
          $scope.total += (item.rate - (item.applyDiscount * 20) ) * 16;
        } else if (item.hourBundle == "5") {
          $scope.total += (item.rate - (item.applyDiscount * 25) ) * 24;
        } else if (item.hourBundle == "6") {
          $scope.total += (item.rate - (item.applyDiscount * 10) ) * 16;
        } else if (item.hourBundle == "7") {
          $scope.total += (item.rate - (item.applyDiscount * 10) ) * 24;
        }
      }

    });
    // Set Cookie of purhcase
    $cookieStore.put('cart', $scope.cart);
  }

  // -------------------------------------------------
  // At startup, load up any stored cart items to scope
  // -------------------------------------------------
  var cartCookie = $cookieStore.get('cart');

  // console.log(cartCookie);
  if (!cartCookie) {
    $scope.cart = [];
    $scope.emptyCart = true;
  }
  // Otherwise, if there is any objects in the cart, load them
  else if (cartCookie.length > 0){
    $scope.cart = cartCookie;
    $scope.emptyCart = false;
    // Update cart total
    $scope.updatePricing();
  }
  console.log(' -- CART --');
  console.log($scope.cart);



  // // -------------------------------------------------
  // test checkout
  // -------------------------------------------------
    $scope.testCheckout = ()=>{
      // create body object
      var body = {
        formData: $scope.formData,
        cart: $scope.cart,
        total: $scope.total
      };

      $cookieStore.put('body', body);

      $cookieStore.put('cart', []);

      console.log(body);

      // Save data to server, then load thankyou page
      $http.post("/checkout/paypal", body)
          .success(function(response) {
              console.log('Success on posting to checkout /payment');
              if (response.status == "success") {
                // Clear the cart Cookie
                $cookieStore.put('cart', []);
                // Redirect to the thankyou page
                $window.location.href = '/thankyou';
              }
              else if (response.status == "error") {
                alert(response.message);
              }
          })
          .error(function(data) {
            console.log('POST ERROR');
              console.log('Error: ' + data);
          });
        //complete http post

    };
    // End test checkout
    // -------------------------------------------------
    // -------------------------------------------------



    // -------------------------------------------------
    // 2 page checkout
    // -------------------------------------------------
    $scope.page2 = ()=>{
      // create body object
      var body = {
        formData: $scope.formData,
        cart: $scope.cart,
        total: $scope.total
      };
      $cookieStore.put('body', body);
      $cookieStore.put('cart', []);
      $window.location.href = '/checkout2';
    };
    // -------------------------------------------------
    // -------------------------------------------------





};

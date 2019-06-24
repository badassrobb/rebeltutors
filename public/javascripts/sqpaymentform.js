// * * * * * * * * * *
// * * * * * * * * * *

// # # # # # # # # # #
// Start SQUARE ##########
// # # # # # # # # # #

// SandBox
// var applicationId = "sandbox-sq0idp-HyWCucki1cnBYLcJM3b4KA";
// var locationId = "CBASEKfXJigvKs3b5PRHBFfGJ1cgAQ";

// Production
var applicationId = "sq0idp-HyWCucki1cnBYLcJM3b4KA";
var locationId = "1Y60P7A574X4W";


// # # # # # # # # # #
// # # # # # # # # # #
// # # # # # # # # # #
// # # # # # # # # # #



//Sentry
Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2@sentry.io/304594').install();
  console.log( "Raven ready!" );




  $( document ).ready(function() {
      console.log( "ready!" );
      // Cancel modal button
      $("#errorTryAgain").click(()=>{
        console.log('Hide Modal');
        $("#errorModal").hide();
      });
  });




  /*
   * function: requestCardNonce
   *
   * requestCardNonce is triggered when the "Pay with credit card" button is
   * clicked
   *
   * Modifying this function is not required, but can be customized if you
   * wish to take additional action when the form button is clicked.
   */

  function requestCardNonce(event) {

    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();

    console.log('Credit Card Nonce begin');
    // Show loading screen
    $("#loadingModal").show();


    Raven.context(function() {
      // Request a nonce from the SqPaymentForm object
      paymentForm.requestCardNonce();
    });
  }

  // Create and initialize a payment form object
  var paymentForm = new SqPaymentForm({

    // Initialize the payment form elements
    applicationId: applicationId,
    locationId: locationId,
    inputClass: 'sq-input',

    // Customize the CSS for SqPaymentForm iframe elements
    inputStyles: [{
        fontSize: '.9em'
    }],

    // Initialize Apple Pay placeholder ID
    // applePay: {
    //   elementId: 'sq-apple-pay'
    // },
    //
    // // Initialize Masterpass placeholder ID
    // masterpass: {
    //   elementId: 'sq-masterpass'
    // },

    // Initialize the credit card placeholders
    cardNumber: {
      elementId: 'sq-card-number',
      placeholder: '•••• •••• •••• ••••'
    },
    cvv: {
      elementId: 'sq-cvv',
      placeholder: 'CVV'
    },
    expirationDate: {
      elementId: 'sq-expiration-date',
      placeholder: 'MM/YY'
    },
    postalCode: {
      elementId: 'sq-postal-code'
    },

    // SqPaymentForm callback functions
    callbacks: {

      /*
       * callback function: methodsSupported
       * Triggered when: the page is loaded.
       */
      methodsSupported: function (methods) {

        var applePayBtn = document.getElementById('sq-apple-pay');
        var applePayLabel = document.getElementById('sq-apple-pay-label');
        var masterpassBtn = document.getElementById('sq-masterpass');
        var masterpassLabel = document.getElementById('sq-masterpass-label');

        // Only show the button if Apple Pay for Web is enabled
        // Otherwise, display the wallet not enabled message.
        if (methods.applePay === true) {
          applePayBtn.style.display = 'inline-block';
          applePayLabel.style.display = 'none' ;
        }
        // Only show the button if Masterpass is enabled
        // Otherwise, display the wallet not enabled message.
        if (methods.masterpass === true) {
          masterpassBtn.style.display = 'inline-block';
          masterpassLabel.style.display = 'none';
        }
      },

      /*
       * callback function: createPaymentRequest
       * Triggered when: a digital wallet payment button is clicked.
       */
      createPaymentRequest: function () {

        var paymentRequestJson ;
        /* ADD CODE TO SET/CREATE paymentRequestJson */
        console.log('CREATE PAYMENT REQUESTS');


        return paymentRequestJson ;
      },

      /*
       * callback function: validateShippingContact
       * Triggered when: a shipping address is selected/changed in a digital
       *                 wallet UI that supports address selection.
       */
      validateShippingContact: function (contact) {

        var validationErrorObj ;
        /* ADD CODE TO SET validationErrorObj IF ERRORS ARE FOUND */
        return validationErrorObj ;
      },

      /*
       * callback function: cardNonceResponseReceived
       * Triggered when: SqPaymentForm completes a card nonce request
       */
      cardNonceResponseReceived: function(errors, nonce, cardData) {
        Raven.context(function() {
          //
          //
          // Start Raven
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            Raven.captureMessage(JSON.stringify(errors));
            console.log("Encountered errors:");
            $("#loadingModal").hide();
            // $("#errorModal").show();
            // $("#errorModalText").text(error.message);
            errors.forEach(function(error) {
              console.log('  ' + error.message);
            });

            return;
          }

          // alert('Nonce received: ' + nonce); /* FOR TESTING ONLY */
          // console.log('nonce');
          // console.log(nonce);
          console.log('card data');
          console.log(cardData);

          // Assign the nonce value to the hidden form field
          document.getElementById('card-nonce').value = nonce;

          // POST the nonce form to the payment processing page
          // document.getElementById('nonce-form').submit();
          var postData = {
            sqnonce: nonce,
            cardInfo: cardData,
            body: Cookies.getJSON("body"),
            billing_address: {
              address_line_1: document.getElementById('add1').value,
              address_line_2: document.getElementById('add2').value,
              administrative_district_level_1: document.getElementById('state').value,
              locality: document.getElementById('city').value,
              email: document.getElementById('email').value
            }
          };

          console.log();
          console.log('Data');
          console.log(postData);
          console.log();

          console.log('wallet zip:');
          console.log(cardData.billing_postal_code);

          $.post( "/checkout/square", postData)
            .done(function( data ) {
              console.log('SUBMITTED Payment');
              // console.log(data);


              console.log('ready for redirect');
              if (data.message == "success") {
                // remove cart and body data
                Cookies.set('body', '[]');
                Cookies.set('cart', '[]');
                window.location.replace("/thankyou");
              }
              else {
                Raven.captureMessage(JSON.stringify(data));
                console.log('Post Error');
                console.log(data);
                $("#loadingModal").hide();
                $("#errorModal").show();
                $("#errorModalText").text(data.message);
                $("#errorModalTextCode").text(data.code);
              }
            });
          // End Raven
        });



      },

      /*
       * callback function: unsupportedBrowserDetected
       * Triggered when: the page loads and an unsupported browser is detected
       */
      unsupportedBrowserDetected: function() {
        /* PROVIDE FEEDBACK TO SITE VISITORS */
      },

      /*
       * callback function: inputEventReceived
       * Triggered when: visitors interact with SqPaymentForm iframe elements.
       */
      inputEventReceived: function(inputEvent) {
        switch (inputEvent.eventType) {
          case 'focusClassAdded':
            /* HANDLE AS DESIRED */
            break;
          case 'focusClassRemoved':
            /* HANDLE AS DESIRED */
            break;
          case 'errorClassAdded':
            /* HANDLE AS DESIRED */
            break;
          case 'errorClassRemoved':
            /* HANDLE AS DESIRED */
            break;
          case 'cardBrandChanged':
            /* HANDLE AS DESIRED */
            break;
          case 'postalCodeChanged':
            /* HANDLE AS DESIRED */
            break;
        }
      },

      /*
       * callback function: paymentFormLoaded
       * Triggered when: SqPaymentForm is fully loaded
       */
      paymentFormLoaded: function() {
        /* HANDLE AS DESIRED */
        console.log('Fully Loaded');
      }
    }
  });



  // End SQUARE ##########
  // * * * * * * * * * *
  // * * * * * * * * * *

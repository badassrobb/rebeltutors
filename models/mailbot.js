'use strict';
var nodemailer = require("nodemailer");
var path = require('path');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'badasstutors2018@gmail.com',
        pass: 'rnchgwtdylirnzpe'
    }
});

module.exports = function() {

  var object = {
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * Customer * Email Notification
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailCustomerPurchase : function(emailAddress, body){

      // HTML objects
      var greetings = String('<h1>Thank you for your purchase.</h1>');
      if (body.braintree) {
        greetings += String('<h2>TransactionID: '+ body.braintree.transaction.id +'</h2>');
      }

      greetings += String('<h2><b>Total: $'+ body.total +'</h2>');

      var purchase = String('<h3>Your order details:</h3>');
      body.cart.forEach((item, cartIndex)=>{
        purchase += ('<p> - - - Item '+ (cartIndex+1) +'</p>');
        if (item.book) {
          purchase += ('<p style="padding-left:15px;">Tutor: '+ item.tutor +'</p>');
          purchase += ('<p style="padding-left:15px;">Price: '+ item.price +'</p>');

        } else {
          if (item.onlineTutorSession == 'true') {
            purchase += ('<p style="padding-left:15px;">Session type: Online Tutoring</p>');
          }
          else {
            purchase += ('<p style="padding-left:15px;">Session type: In Person Tutoring</p>');
          }
          purchase += ('<p style="padding-left:15px;">Tutor: '+ item.tutor +'</p>');
          purchase += ('<p style="padding-left:15px;">Hours: '+ item.hours +'</p>');
          purchase += ('<p style="padding-left:15px;">Hourly Rate: $'+ item.hourlyRate +' per hour</p>');
          purchase += ('<p style="padding-left:15px;">Price: $'+ item.price +'</p>');
          purchase += ('<p style="padding-left:15px;">Subject: '+ item.subjectCategory +'</p>');
          purchase += ('<p style="padding-left:15px;">Class: '+ item.class +'</p><br>');
        }
      });

      var student = String('<h3>Student Details:</h3>');
      student += ('<p style="padding-left:15px;">Name: '+ body.formData.firstName +' '+ body.formData.lastName +'</p>');
      student += ('<p style="padding-left:15px;">phone: '+ body.formData.phone +'</p>');
      student += ('<p style="padding-left:15px;">email: '+ body.formData.email +'</p>');
      student += ('<p style="padding-left:15px;">Address: '+ body.formData.address +'</p>');
      student += ('<p style="padding-left:15px;">School: '+ body.formData.school +'</p>');
      student += ('<p style="padding-left:15px;">Goals: '+ body.formData.goals +'</p>');

      // Create final html to mail off
      var html_body = greetings + student + purchase;

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <hideliveryassistant@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Thank you for your purchase', // Subject line
          html:  html_body// plain text body
      };
      // - - - - - - - - - - - - -
      // Send email off
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
          }
          else {
            console.log(' -- CUSTOMER EMAIL SENT');
            // console.log('Message %s sent: %s', info.messageId, info.response);
          }
      });
    },

    emailAdminNewSubject: function(emailAddress, newTutor){
      // HTML objects
      var greetings = String('<h1>You have a new Custom Subject!</h1>');
      greetings += String('<h2>Go to your admin to confirm it. </h2>');

      var tutor = String('<h3>Tutor Details:</h3>');
      tutor += ('<p style="padding-left:15px;">Name: '+ newTutor.firstName + ' ' + newTutor.lastName + '</p>');

      tutor += ('<p style="padding-left:15px;">Subjects: </p>');
      // tutor subjects
      newTutor.subjects.forEach((subject)=>{
        tutor += ('<p style="padding-left:15px;">' + subject.subjectCategory + '</p>');
      });


      // Create final html to mail off
      var html_body = greetings + tutor;

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Badass Tutors: New CUSTOM SUBJECT', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },

    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * Email Logged Hours
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailAdminLoggedHours: function(emailAddress, hourLog, updatePurchase){
      // HTML objects
      var greetings = String('<h1>You have new logged hours!</h1>');
      greetings += String('<h3>Go to your admin to pay and confirm hours. </h3>');

      var details = String('<h3>Tutor Details:</h3>');
      details += ('<h3>Tutor Name: ' + hourLog.tutorFirstName + ' ' + hourLog.tutorLastName + '</h3>');
      details += ('<h3> Student Name: ' + updatePurchase.formData.firstName + ' '+ updatePurchase.formData.lastName + ' </h3>');
      details += ('<p style="padding-left:15px;">Date: ' + hourLog.realDate + ' </p>');
      details += ('<p style="padding-left:15px;"> Hours Logged: ' + hourLog.hours + ' </p>');
      details += ('<p style="padding-left:15px;"> Class: ' + hourLog.class + ' </p>');
      details += ('<p style="padding-left:15px;"> Tutoring Session Description: ' + hourLog.description + ' </p>');


      // Create final html to mail off
      var html_body = greetings + details;

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Badass: Logged Hours', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },

    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * Student/Customer * Email Logged Hours
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailStudentLoggedHours: function(hourLog, updatePurchase){
      // HTML objects
      var greetings = String('<h1>Hi ' + updatePurchase.formData.firstName + ' '+ updatePurchase.formData.lastName + ',</h1> <br>');

      greetings += String('<h3>Your tutor just logged a session they had with you.</h3>');
      greetings += String('<h3>Please look this over and if anything seems incorrect, call or text us immediately at 805.806.0305 </h3>');

      var details = String('<h3>Tutoring Details:</h3>');
      details += ('<h3>Tutor Name: ' + hourLog.tutorFirstName + ' ' + hourLog.tutorLastName + '</h3>');
      details += ('<p style="padding-left:15px;">Date: ' + hourLog.realDate + ' </p>');
      details += ('<p style="padding-left:15px;"> Hours Logged: ' + hourLog.hours + ' </p>');
      details += ('<p style="padding-left:15px;"> Class: ' + hourLog.class + ' </p>');
      details += ('<p style="padding-left:15px;"> Tutoring Session Description: ' + hourLog.description + ' </p> <br>');
      details += String('<p>Thank you and have a nice day!</p>');
      details += String('<br>');
      details += String('<p>Badass Tutors</p>');
      details += String('<p>805.806.0305</p>');
      details += String('<p>bigcheese@badasstutors.com</p>');

      // Create final html to mail off
      var html_body = greetings + details;

      var emailAddress = updatePurchase.formData.email;

      // for testing
      // var emailAddress = "jwoodjack@gmail.com";



      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Badass Tutors: Your tutor logged a session with you', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- Student EMAIL SENT');
          }
      });
    },

    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * Email Notification
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailAdminPurchase : function(emailAddress, body){
      // HTML objects
      var greetings = String('<h1>You made a sale! Congratulations!</h1>');
      if (body.braintree) {
        greetings += String('<h2>Braintree TransactionID: '+ body.braintree.transaction.id +'</h2>');
      }
      else if (body.paypal){
        greetings += String('<h2>Paypal TransactionID: '+ body.paypal.id +'</h2>');
      }
      else if (body.square){
        greetings += String('<h2># Square TransactionID: '+ body.square.transaction.id +'</h2>');
      }

      greetings += String('<h2><b>Total: $'+ body.total +'</h2>');

      var purchase = String('<h3>Your order details:</h3>');
      body.cart.forEach((item, cartIndex)=>{
        purchase += ('<p> - - - Item '+ (cartIndex+1) +'</p>');
        if (item.book) {
          purchase += ('<p style="padding-left:15px;">Tutor: '+ item.tutor +'</p>');
          purchase += ('<p style="padding-left:15px;">Price: '+ item.price +'</p>');

        } else {
          if (item.onlineTutorSession == 'true') {
            purchase += ('<p style="padding-left:15px;">Session type: Online Tutoring</p>');
          }
          else {
            purchase += ('<p style="padding-left:15px;">Session type: In Person Tutoring</p>');
          }

          if (item.tutorInfo) {
            purchase += ('<p style="padding-left:15px;">Tutor Name: '+ item.tutorInfo.name +'</p>');
            purchase += ('<p style="padding-left:15px;">Tutor Phone: '+ item.tutorInfo.contact.phone +'</p>');
            purchase += ('<p style="padding-left:15px;">Tutor E-mail: '+ item.tutorInfo.contact.email +'</p>');
          }
          purchase += ('<p style="padding-left:15px;">Tutor Nickname: '+ item.tutor +'</p>');
          purchase += ('<p style="padding-left:15px;">Hours: '+ item.hours +'</p>');
          purchase += ('<p style="padding-left:15px;">Hourly Rate: $'+ item.hourlyRate +' per hour</p>');
          purchase += ('<p style="padding-left:15px;">Price: $'+ item.price +'</p>');
          purchase += ('<p style="padding-left:15px;">Subject: '+ item.subjectCategory +'</p>');
          purchase += ('<p style="padding-left:15px;">Class: '+ item.class +'</p><br>');
        }
      });

      var student = String('<h3>Student Details:</h3>');
      student += ('<p style="padding-left:15px;">Name: '+ body.formData.firstName +' '+ body.formData.lastName +'</p>');
      student += ('<p style="padding-left:15px;">phone: '+ body.formData.phone +'</p>');
      student += ('<p style="padding-left:15px;">email: '+ body.formData.email +'</p>');
      student += ('<p style="padding-left:15px;">Address: '+ body.formData.address +'</p>');
      student += ('<p style="padding-left:15px;">School: '+ body.formData.school +'</p>');
      student += ('<p style="padding-left:15px;">Goals: '+ body.formData.goals +'</p>');


      // Create final html to mail off
      var html_body = greetings + student + purchase;

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'You just made a sale! $$', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  TUTOR APPLY * * * * * Email Notification
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailAdminApplication : function(emailAddress, newTutor){
      // HTML objects
      var greetings = String('<h1>You got a New Tutor Signup! Congratulations!</h1>');
      greetings += String('<h2>Login to your Admin Tutors page to see more details: </h2>');

      var tutor = String('<h3>Tutor Details:</h3>');
      tutor += ('<p style="padding-left:15px;">Name: '+ newTutor.firstName + ' ' + newTutor.lastName + '</p>');
      tutor += ('<p style="padding-left:15px;">phone: ' + newTutor.contact.phone + '</p>');
      tutor += ('<p style="padding-left:15px;">E-mail: ' + newTutor.contact.email + '</p>');

      // tutor location
      tutor += ('<p style="padding-left:15px;">Location: ' + newTutor.geoCoded.formatted_address + '</p>');
      // tutor education
      tutor += ('<p style="padding-left:15px;">Education: ' + newTutor.education + '</p>');

      tutor += ('<p style="padding-left:15px;">Subjects: </p>');
      // tutor subjects
      newTutor.subjects.forEach((subject)=>{
        tutor += ('<p style="padding-left:15px;">' + subject.subjectCategory + '</p>');
      });


      // Create final html to mail off
      var html_body = greetings + tutor;

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'You just got a TUTOR Application!', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  Bulk Email Composer
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailAdminEmailer : function(emailAddress, emailSubject, emailMessage){

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  Bulk Email Composer
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailValidationWelcome : function(emailAddress, newPass){

      var html_body = String('<h1>Congratulations!</h1>');

      html_body += String('<p>Your application to become a Badass Tutor has been accepted.</p>');
      html_body += String('<p>You can see your online profile by searching for yourself at https://badasstutors.com/tutors.</p>');

      html_body += String('<p>To access your Tutor Portal account, login at: https://badasstutors.com/tutor/login. </p>');

      html_body += String('<br>');

      html_body += String('<p>Your username is your email address. </p>');
      html_body += String('<p>Your temporary password is: <b>'+ newPass +'</b> </p>');

      html_body += String('<br>');

      html_body += String('<p>Once logged in, you can edit your online profile, log hours, and more!</p>');

      html_body += String('<p>You can change your password by going to "Settings -> Reset Password". See the help page for more information.</p>');
      html_body += String('<p>Welcome to the family!</p>');

      html_body += String('<br>');

      html_body += String('<p>Badass Tutors</p>');
      html_body += String('<p>805.806.0305</p>');
      html_body += String('<p>bigcheese@badasstutors.com</p>');


      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Welcome to Badass Tutors!', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  Welcome Email
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailWelcome : function(emailAddress, newPass){

      var html_body = String('<h1>Dear Badass Tutor:</h1>');

      html_body += String('<p>Badass Tutors now has Tutor Portal accounts!</p>');

      html_body += String('<p>To access your Tutor Portal account, login at: https://badasstutors.com/tutor/login.</p>');

      html_body += String('<br>');

      html_body += String('<p>Your username is your email address. </p>');
      html_body += String('<p>Your temporary password is: <b>'+ newPass +'</b> </p>');

      html_body += String('<br>');

      html_body += String('<p>You can change your password by going to "Settings -> Reset Password". </p>');

      html_body += String('<p>Once logged in, you can edit your online profile, see your current/past students, and log hours. See the “Help” page for more information.</p>');

      html_body += String('<p>Happy tutoring, finals are right around the corner!</p>');

      html_body += String('<br>');

      html_body += String('<p>Badass Tech Support</p>');
      html_body += String('<br>');
      html_body += String('<p>Questions, comments, or concerns?</p>');
      html_body += String('<br>');
      html_body += String('<p>Call or email Robb!</p>');
      html_body += String('<p>805.806.0305</p>');
      html_body += String('<p>bigcheese@badasstutors.com</p>');

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Welcome to Badass Tutors!', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- ADMIN EMAIL SENT');
          }
      });
    },
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  password reset
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailPasswordReset : function(emailAddress, newPassword){

      var html_body = String('<h1>We reset your password!</h1>');

      html_body += String('<p>We received an online request to reset your password.</p>');

      html_body += String('<p>If you did not request your password reset, please contact us immediately.</p>');

      html_body += String('<br>');

      html_body += String('<p>Your new password is: '+ newPassword +'</p>');

      html_body += String('<br>');

      html_body += String('<p>Sincerely,</p>');

      html_body += String('<br>');

      html_body += String('<p>Badass Tutors</p>');
      html_body += String('<p>805.806.0305</p>');
      html_body += String('<p>bigcheese@badasstutors.com</p>');


      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: emailAddress, // list of receivers
          subject: 'Badass Tutor Password Reset', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- Tutor Password Reset EMAIL SENT');
          }
      });
    },


    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  tutor update profile notice
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailAdminTutorProfileChange : function(adminEmailAdderss, tutor){

      var html_body = String('<h1>A Tutor has updated their online profile!</h1>');

      // html_body += String('<p>They have been automatically <b>DE-ACTIVATED!</b>.</p>');

      html_body += String('<p>Log onto the admin tutor page to review the changes and reset them to Active.</p>');

      html_body += String('<p>Tutor Information:</p>');

      html_body += String('<br>');

      html_body += String('<p>Name: '+ tutor.firstName + ' ' + tutor.lastName +'</p>');
      html_body += String('<p>Nickname: '+ tutor.nickname +'</p>');
      html_body += String('<p>Email: '+ tutor.contact.email +'</p>');



      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          to: adminEmailAdderss, // list of receivers
          subject: 'Badass Tutor Online Profile Changed', // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- Tutor Password Reset EMAIL SENT');
          }
      });
    },

    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    // * ADMIN * * * * *  emailer send
    // - - - - - - - - - - - - -
    // - - - - - - - - - - - - -
    emailerSend : function(emailInfo){

      var html_body = emailInfo.message;


      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Badass Tutors" <badasstutors2015@gmail.com>', // sender address
          // to: adminEmailAdderss, // list of receivers
          bcc: emailInfo.emailList,
          subject: emailInfo.subject, // Subject line
          html:  html_body// plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(' -- Admin mass emailer sent!');
          }
      });
    }

  };

  return object;
}

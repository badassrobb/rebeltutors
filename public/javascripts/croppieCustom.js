
$( document ).ready(function() {
    console.log( "ready!" );

    function imageUpload() {
      console.log('hi');
		var $uploadCrop;

		function readFile(input) {
 			if (input.files && input.files[0]) {
	            var reader = new FileReader();

	            reader.onload = function (e) {
					$('.upload-demo').addClass('ready');
	            	$uploadCrop.croppie('bind', {
	            		url: e.target.result
	            	}).then(function(){
	            		console.log('jQuery bind complete');
	            	});

	            }

	            reader.readAsDataURL(input.files[0]);
	        }
	        else {
		        swal("Sorry - you're browser doesn't support the FileReader API");
		    }
		}


		$uploadCrop = $('#upload-demo').croppie({
			viewport: {
				width: 300,
				height: 300,
				type: 'square'
			},
      boundary: {
          width: 300,
          height: 300
      },
			enableExif: true
		});

    $uploadCrop.croppie('bind', {
      url:'/public/images/np_selfie.png'
    });



    // Default, hide savedPhotoDiv
    $("#photoExistingDiv").hide();

    // On loading of modal image preview, bind url to this img
    $("#tutorImagePreview").on('load', ()=>{
      if ($("#tutorImagePreview").attr('src') == '/public/images/np_selfie.png') {
        $("#photoExistingDiv").hide();
        $("#photoUploadDiv").show();
      }
      else {
        $("#photoExistingDiv").show();
        $("#photoUploadDiv").hide();
      }
    });

    // Perform edit button actions
    $("#editPhotoButton").click(()=>{
      $("#photoUploadDiv").show();
      $("#photoExistingDiv").hide();
      $uploadCrop.croppie('bind', {
        url: $("#tutorImagePreview").attr('src')
      });
    });




		$('#upload').on('change', function () {
      console.log('UPLOAD!');
      readFile(this);
    });


		$('.upload-result').on('click', function (ev) {
			$uploadCrop.croppie('result', {
				type: 'canvas',
				size: 'viewport'
			}).then(function (resp) {
				// popupResult({
				// 	src: resp
				// });
        console.log('NEW photo');

        $("#photoUploadDiv").hide();
        $("#photoExistingDiv").show();

        $("#tutorImagePreview").attr('src', resp);
			});
		});
	}

  imageUpload();


});

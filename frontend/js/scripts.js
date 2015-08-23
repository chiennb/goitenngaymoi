(function($){
	
	$(window).on('load', function(){
		$('.fade-in').css({ position: 'relative', opacity: 0, top: -14 });
		setTimeout(function(){
			$('#preload-content').fadeOut(400, function(){
				$('#preload').fadeOut(800);
				setTimeout(function(){
					$('.fade-in').each(function(index) {
						$(this).delay(400*index).animate({ top : 0, opacity: 1 }, 800);
					});
				}, 800);
			});
		}, 400);
	});

	$(document).ready( function(){

		// Create a countdown instance. Change the launchDay according to your needs.
		// The month ranges from 0 to 11. I specify the month from 1 to 12 and manually subtract the 1.
		// Thus the launchDay below denotes 7 May, 2014.
		var launchDay = new Date(2015, 8-1, 28,10);
		$('#timer').countdown({
			until: launchDay
		});

		// Add background image
		$.backstretch('images/background.jpg');

		// Invoke the Placeholder plugin
		$('input, textarea').placeholder();

		// Validate newsletter form
		$('<div class="loading"><span class="bounce1"></span><span class="bounce2"></span><span class="bounce3"></span></div>').hide().appendTo('.form-wrap');
		$('<div class="success"></div>').hide().appendTo('.form-wrap');
		// $('#newsletter-form').validate({
		// 	rules: {
		// 		newsletter_email: { required: true, email: true }
		// 	},
		// 	messages: {
		// 		newsletter_email: {
		// 			required: 'Phải nhập địa chỉ email',
		// 			email: 'Phải là địa chỉ email của FPT'
		// 		}
		// 	},
		// 	errorElement: 'span',
		// 	errorPlacement: function(error, element){
		// 		error.appendTo(element.parent());
		// 	},
		// 	submitHandler: function(form){
		// 		$(form).hide();
		// 		$('#newsletter .loading').css({ opacity: 0 }).show().animate({ opacity: 1 });
		// 		$.post($(form).attr('action'), $(form).serialize(), function(data){
		// 			$('#newsletter .loading').animate({opacity: 0}, function(){
		// 				$(this).hide();
		// 				$('#newsletter .success').show().html('<p>Cảm ơn đã đăng ký! Vui lòng kiểm tra email để xác nhận!</p>').animate({opacity: 1});
		// 			});
		// 		});
		// 		return false;
		// 	}
		// });

		// Open modal window on click
		$('#modal-open').on('click', function(e) {
			var mainInner = $('#main .inner'),
				modal = $('#modal');

			mainInner.animate({ opacity: 0 }, 400, function(){
				$('html,body').scrollTop(0);
				modal.addClass('modal-active').fadeIn(400);
			});
			e.preventDefault();

			$('#modal-close').on('click', function(e) {
				modal.removeClass('modal-active').fadeOut(400, function(){
					mainInner.animate({ opacity: 1 }, 400);
				});
				e.preventDefault();
			});
		});
		
		// Open modal window on click
		$('#modalInfo-open').on('click', function(e) {
			var mainInner = $('#main .inner'),
				modal = $('#modalInfo');

			mainInner.animate({ opacity: 0 }, 400, function(){
				$('html,body').scrollTop(0);
				modal.addClass('modal-active').fadeIn(400);
			});
			e.preventDefault();

			$('#modalInfo-close').on('click', function(e) {
				modal.removeClass('modal-active').fadeOut(400, function(){
					mainInner.animate({ opacity: 1 }, 400);
				});
				e.preventDefault();
			});
		});

		$("#newsletter_email").keyup(function(e) {
	        if(e.keyCode == 13) {
	            sendMessage(e);
	            return false;
	        }
	    });

	    $("#newsletter_email").change(function () {
		    if ($("#newsletter_email").val().length > 0)
		    	$('#message').text('');
		});
	    var socket = io.connect();
	    var field = document.getElementById("newsletter_email");
	    var sendButton = document.getElementById("newsletter_submit");

	 
	    socket.on('message', function (data) {
	        if(data.message) {
	           //console.log(data);
	           $('#message').text(data.message);	           

	        } else {
	            console.log("There is a problem:", data);
	        }
	    });

	    socket.on('booked', function (data) {
	        if(data.message) {
	           console.log(data);
	           $('#available').text(data.message);	                      
	        } else {
	            console.log("There is a problem:", data);
	        }
	    });
	 
	    sendButton.onclick = function(e) {
	        sendMessage(e);
	        return false;
	    };

	    function sendMessage(e){

	    	var sEmail = $('#newsletter_email').val();
	        if ($.trim(sEmail).length == 0) {
	            alert('Bạn chưa nhập email!');
	            e.preventDefault();
	            return;
	        }
	        if (!validateEmail(sEmail)) {
	            alert('Bạn phải nhập email FPT!');
	            e.preventDefault();
	            return;
	        }

	        var text = field.value;
	        var floor = $("input[name='tickettype']:checked").val();
	        socket.emit('send', { email: text, tickettype: floor });
	        field.value = "";
	        return false;
	    }

	    function validateEmail(sEmail) {
	        sEmail = sEmail.toLơ.toLowerCase();
		    var filter = /^([\w-\.]+)@fpt.com.vn$/;
		    if (filter.test(sEmail)) {
		        return true;
		    }
		    else {
		        return false;
		    }
		}
	});
	
})(jQuery);
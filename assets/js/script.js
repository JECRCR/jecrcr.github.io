var showEventCategories = function() { };

var hideEventDetails = function() { };

$(".explore-button").click(showEventCategories);

function showLoginModal(){
    $(".login-modal").fadeIn();
}

function getRegEvents(token) {
    $.post('registrations.php', {token: token}).done(function(response) {
        var data = $.parseJSON(response);
        var content;
        if(data.length == 0){
            content = "No registrations found!";
        } else{
            content = '<ul>';
            data.forEach(function (item) {
              content = content + "<li>" + item.name + "<i>[ " + item.teamname + " ]</i></li>";
            });
            content += '</ul>';
        }
        $('.reg-events').html(content);
    });
}

function showAccountModal(){
    $(".account-modal").fadeIn();
    getRegEvents(sessionStorage.token);
}
function clickOutsideLogin(e){
    var container = $(".login-content");
    if(!container.is(e.target) && container.has(e.target).length ==0 )
        $(".login-modal").fadeOut();
}
function clickOutsideReg(e){
    var container = $(".account-content");
    if(!container.is(e.target) && container.has(e.target).length ==0 )
        $(".account-modal").fadeOut();
}

function isFormEmpty(data) {
    var empty = false;
    $.each( data, function( key, value ) {
        if(!value){
            empty = true;
            return false;
        }
    });
    return empty;
}

function createSession(token) {
    if(typeof(Storage) !== "undefined") {
        sessionStorage.token = token;
    } else {
        alert("Please update your browser!");
    }
}

function submitLogIn() {
    var formData = {
        'form'              : 'login',
        'email' 			: $('#loginform input[name=email]').val().trim(),
        'password' 	        : $('#loginform input[name=password]').val().trim()
    };

    if(isFormEmpty(formData)){
        alert("All fields are required!");
        return false;
    }

    $('.login-loader').fadeIn();
    $('.login-msg').hide();
    $.post('login.php', formData).done(function(response) {
        var data = $.parseJSON(response);
        $('.login-msg').fadeIn();
        if ( ! data.success) {
            $('.login-msg').html(data.error);
        	$('.login-msg').fadeIn();
        } else {
            createSession(data.token);
            location.reload();
        }
        $('.login-loader').fadeOut();
    });
}

function submitSignUp() {
    var formData = {
        'form'              : 'signup',
        'name' 				: $('#signupform input[name=name]').val().trim(),
        'college' 			: $('#signupform input[name=college]').val().trim(),
        'city' 				: $('#signupform input[name=city]').val().trim(),
        'email' 			: $('#signupform input[name=email]').val().trim(),
        'contact' 			: $('#signupform input[name=contact]').val().trim(),
        'password' 	        : $('#signupform input[name=password]').val().trim()
    };

    if(isFormEmpty(formData)){
        alert("All fields are required!");
        return false;
    }

    $('.login-loader').fadeIn();
    $('.signup-msg').hide();
    $.post('login.php', formData).done(function(response) {
        var data = $.parseJSON(response);
        $('.signup-msg').fadeIn();
        if ( ! data.success) {
            $('.signup-msg').html(data.error);
            $('.signup-msg').removeClass('msg-success');
        	$('.signup-msg').addClass('msg-error');
        } else {
            $('#signupform').trigger('reset');
            $('.signup-msg').html("Awesome! You can Log In now!");
            $('.signup-msg').removeClass('msg-error');
        	$('.signup-msg').addClass('msg-success');
        }
        $('.login-loader').fadeOut();
    });
}

function submitRegister() {
    var formData = {
        'form'              : 'register',
        'teamname' 			: $('#registerform input[name=teamname]').val().trim(),
        'team' 		        : $('#registerform textarea[name=teammembers]').val().trim(),
        'eventID' 		    : $('.event-details header h1').attr('id'),
        'token' 			: sessionStorage.token
    };

    if(isFormEmpty(formData)){
        alert("All fields are required!");
        return false;
    }

    $('.register-msg').fadeIn();
    $('.register-msg').html("Registering...");
    $.post('registrations.php', formData).done(function(response) {
        var data = $.parseJSON(response);
        if ( ! data.success) {
            $('.register-msg').html(data.error);
        } else {
            $('#registerform').trigger('reset');
            $('.register-msg').html("Thanks for registering!");
        }
    });
}

function submitContact() {
    var formData = {
        'name' 			    : $('#contact-Form input[name=name]').val().trim(),
        'email' 			: $('#contact-Form input[name=email]').val().trim(),
        'phone' 			: $('#contact-Form input[name=number]').val().trim(),
        'message' 		    : $('#contact-Form textarea[name=message]').val().trim(),
    };

    if(isFormEmpty(formData)){
        alert("All fields are required!");
        return false;
    }
    $('#contact-submit').fadeOut();
    $('.contact-msg').html('Sending...');
    $('.contact-msg').fadeIn;
    $.post('mail.php', formData).done(function(response) {
        var data = $.parseJSON(response);
        if ( ! data.success) {
            $('.contact-msg').html(data.error);
        } else {
            $('#contact-Form').trigger('reset');
            $('.contact-msg').html("Message Sent!");
            $('#contact-submit').fadeIn();
        }
    });
}

var cssRule =
    "color: #fff;" +
    "font-size: 35px;" +
    "font-weight: bold;" +
    "text-shadow: 1px 1px 5px rgb(249, 162, 34);background: red;" +
    "filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);";

console.log("%cDON'T MESS WITH THIS WEBSITE, INSTEAD DEVELOP ONE (IF YOU HAVE THE GUTS)", cssRule);
console.log("%cDeveloped By :","color: red;font-size: 20px;" );
console.log("%cLokesh Devnani & Udit Vasu","color: blue; font-size: 20px; font-weight: bold;");

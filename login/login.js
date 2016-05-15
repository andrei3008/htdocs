

function LoginView(config) {
    $.extend(this, config);
    this.initComponent();
}

LoginView.prototype = {
    initComponent: function () {
        Parse.initialize("6Q8dLEqxOdOZRzLbxQgCFGuVj1hgkvk6KKtBqlLK", "e4R9KLJwGaie09y5HlotChon0bBdIMXDaRGnHJuE");
        window.fbAsyncInit = function () {
            Parse.FacebookUtils.init({// this line replaces FB.init({
                appId: '1111925495490335', // Facebook App ID
                status: true, // check Facebook Login status
                cookie: true, // enable cookies to allow Parse to access the session
                xfbml: true, // initialize Facebook social plugins on the page
                version: 'v2.3' // point to the latest Facebook Graph API version
            });
        };
        this.attachListeners();
        this.initKendoComponents();
        //this.signinCallback();
        //this.toolTipUser.hide();

    },
    attachListeners: function () {
        $('#login').on('click', $.proxy(this.onLogin, this));
        $('#register').on('click', $.proxy(this.onRegister, this));
        $('#fb-root').on('click', $.proxy(this.fbLogin, this));
        $('#password_field').keypress(function (e) {
            if (e.which === 13) {
                $('#login').trigger('click');
            }
        });


    },
    onLogin: function () {
        if ($('.user_textbox').val().length === 0) {
            $('#user_textbox_missing').removeClass('invisible');
            this.toolTipUser.show($('#user_textbox_missing'));
        }
        else {
            $('#user_textbox_missing').addClass('invisible');
            if ($('.password_textbox').val().length === 0) {
                $('#password_textbox_missing').removeClass('invisible');
                this.toolTipPassword.show($('#password_textbox_missing'));
            }
            else {
                $('#password_textbox_missing').addClass('invisible');
                var enteredUser = $('.user_textbox').val();
                var enteredPassword = $('.password_textbox').val();
                Parse.User.logIn(enteredUser, enteredPassword, {
                    success: function (user) {
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("username", user.getUsername());
                        localStorage.setItem("sessionToken", user.getSessionToken());
                        localStorage.setItem('isFBlogin', 'NO');
                        //localStorage.setItem("prenume", );
                        window.location = '../index.html';
                    },
                    error: function (user, error) {
                        var notificationFailedLogin = $('#login_h1').kendoNotification({
                            appendTo: "#login_h1",
                            width: 300
                        }).data('kendoNotification');
                        notificationFailedLogin.show("The user or password is incorrect");
                    }
                });
            }
        }
    },
    onRegister: function () {

        this.registerWindow = $('#window1').show().kendoWindow({
            width: "595px",
            visible: false,
            modal: true,
            title: "Register",
            content: "../register/register.html",
            position: {
                top: "20%",
                left: "30%"
            },
            refresh: $.proxy(this.onRegisterWindowLoaded, this)
        }).show().data("kendoWindow");
        this.registerWindow.open();
    },
    onRegisterWindowLoaded: function () {
        $('#save_user').off().on('click', $.proxy(this.submitUser, this));
        $('#repassword').keypress(function (e) {
            if (e.which === 13) {
                $('#save_user').trigger('click');
            }
        });
    },
    submitUser: function (event) {
        event.preventDefault();
        var valid = true;
        var input;
        var email = $("#email").val();
        if (!email) {
            valid = false;
            var mailNotEntered = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 350
            }).data('kendoNotification');
            mailNotEntered.show("Please enter your email address!");
            input = $("#email");
        }
        var username = $("#username").val();
        if (!username) {
            valid = false;
            var usernameNotEntered = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 350
            }).data('kendoNotification');
            usernameNotEntered.show("Please enter your desired username!");

        }
        var password1 = $("#password").val();
        if (!password1) {
            valid = false;
            var passwordNotEntered = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 350
            }).data('kendoNotification');
            passwordNotEntered.show("Please enter your desired password!");
        }
        var password2 = $("#repassword").val();
        if (!password2) {
            valid = false;
            var passwordNotConfirmed = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 350
            }).data('kendoNotification');
            passwordNotConfirmed.show("Please confirm the password!");
        }
        if (password1 !== password2) {
            valid = false;
            var passwordNotMatch = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 350
            }).data('kendoNotification');
            passwordNotMatch.show("The entered passwords does not match!");

        }
        function checkPwd(str) {
            if (str.length < 6) {
                return("too_short");
            } else if (str.length > 50) {
                return("too_long");
            } else if (str.search(/\d/) === -1) {
                return("no_num");
            } else if (str.search(/[a-zA-Z]/) === -1) {
                return("no_letter");
            }
            return("ok");
        }
        ;
        if (checkPwd(password1) !== "ok") {
            valid = false;
            var passwordNotAccepted = $('#notification').kendoNotification({
                appendTo: $('#registerform').find('.status'),
                width: 550
            }).data('kendoNotification');
            passwordNotAccepted.show("The password must contain minimum 6 characters, at least 1 letter and 1 digit");

        }

        /*if (!valid) {
         input.addClass("invalid");
         }*/

        if (valid) {
            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password1);
            user.set("email", email);
            user.signUp(null, {
                success: $.proxy(function (user) {
                    console.log("Succes");
                    localStorage.setItem("userId", user.id);
                    localStorage.setItem("username", user.getUsername());
                    localStorage.setItem("sessionToken", user.getSessionToken());
                    this.registerWindow.close();
                    window.location = '../index.html';

                }, this),
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    //alert("Error: " + error.code + " " + );
                    var notificationWidget = $("#notification").kendoNotification({
                        appendTo: $('#registerform').find('.status'),
                        width: 545
                    }).data("kendoNotification");
                    notificationWidget.show(error.message, "warning");
                }
            });

        }

    },
    initKendoComponents: function () {
        this.toolTipUser = $('#tooltip_user').kendoTooltip({
            content: "Please enter an username"
        }).data('kendoTooltip');
        this.toolTipPassword = $('#tooltip_password').kendoTooltip({
            content: "Please enter a password"
        }).data('kendoTooltip');

    },
//    signinCallback: function (authResult) {
//        if (authResult['status']['signed_in']) {
//            window.location = "../index.html";
//        } else {
//            // Update the app to reflect a signed out user
//            // Possible error values:
//            //   "user_signed_out" - User is signed-out
//            //   "access_denied" - User denied access to your app
//            //   "immediate_failed" - Could not automatically log in the user
//            console.log('Sign-in state: ' + authResult['error']);
//        }
//    },
    fbLogin: function (e) {
        e.preventDefault();
        e.stopPropagation()
        Parse.FacebookUtils.logIn(null, {
            success: function (user) {
                FB.api('/me', {fields: 'last_name,first_name,email'}, function (response) {
                    console.log(response);
                    console.log(response.email);
                    console.log(response.last_name);
                    if (!user.existed()) {
                        user.set('firstName', response.first_name);
                        user.set('lastName', response.last_name);
                        user.set('email', response.email);
                        
                        user.save(null, {
                            success: $.proxy(function (user) {
                                // Hooray! Let them use the app now.
                                console.log("Succes");
                                localStorage.setItem("userId", user.id);
                                localStorage.setItem("username", user.getUsername());
                                localStorage.setItem("sessionToken", user.getSessionToken());
                                localStorage.setItem('isFBlogin', 'YES');
                                window.location = '../index.html';

                            }, this),
                            error: function (user, error) {
                                // Show the error message somewhere and let the user try again.
                                alert("Error: " + error.code + " " );
                            }
                        });
                    } else {
                        alert("User logged in through Facebook!");
                        
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("username", user.getUsername());
                        localStorage.setItem("sessionToken", user.getSessionToken());
                        localStorage.setItem('isFBlogin', 'YES');
                        window.location = '../index.html';
                    }
                });


            },
            error: function (user, error) {
                alert("User cancelled the Facebook login or did not fully authorize.");
            }
        });
    }
};


(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


$(document).ready(function () {
    var loginView = new LoginView();
});
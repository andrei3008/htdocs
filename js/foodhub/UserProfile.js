foodhub.UserProfile = function (config) {
    $.extend(this, config);
    this.initComponent();
}

foodhub.UserProfile.prototype = {
    initComponent: function () {
        this.disableRightButtons();
        this.attachListeners();
        this.initKendoComponents();
        this.getCurrentUser();
        this.username = localStorage.getItem('username');
        var currentUser = Parse.User.current();
        var getThisUser = currentUser.attributes;
        this.firstName = getThisUser.firstName;
        //console.log(this.firstName);
        this.lastName = getThisUser.lastName;
        this.isFBLogin = (localStorage.getItem('isFBlogin') === 'YES');
        if (this.isFBLogin || (this.firstName && this.lastName)) {
            $('#welcomeProfile').append('<h2>Hi, ' + this.firstName + ' ' + this.lastName + '</h2>');
        } else {
            $('#welcomeProfile').append('<h2>Hi, ' + this.username + '</h2>');
        }
    },
    disableRightButtons: function () {
        $('#edit_event').attr('disabled', true);
        $('#remove_event').attr('disabled', true);
    },
    attachListeners: function () {
        $('#submit_profile').on('click', $.proxy(this.saveProfile, this));
        $(".upload_avatar").off().on('click', function (event) {
            $("#profilePhotoFileUpload").trigger('click');
        });
    },
    initKendoComponents: function () {
            this.interestsDropDownList = $('#interests_select').kendoMultiSelect({
            width: 320,
            virtual: {
                    itemHeight: 26,
                    valueMapper: function(options) {
                        $.ajax({
                            url: "//demos.telerik.com/kendo-ui/service/Orders/ValueMapper",
                            type: "GET",
                            dataType: "jsonp",
                            data: convertValues(options.value),
                            success: function (data) {
                                options.success(data);
                            }
                        })
                    }
                },    
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://api.parse.com/1/classes/Hashtags",
                        dataType: "json",
                        type: "POST",
                        contentType: 'application/json'
                    },
                    parameterMap: function (options, operation) {
                        var payLoad = JSON.stringify({
                            _ApplicationId: "6Q8dLEqxOdOZRzLbxQgCFGuVj1hgkvk6KKtBqlLK",
                            _ClientVersion: "js1.4.2",
                            _InstallationId: "7068cdf1-827a-a514-8a7d-dd20e9d90e13",
                            _JavaScriptKey: "e4R9KLJwGaie09y5HlotChon0bBdIMXDaRGnHJuE",
                            _method: "GET",
                            where: {}
                        }
                        );
                        return payLoad;
                    }
                },
                schema: {
                    parse: function (response) {
                        var a = response.results;
                        return a;
                    }
                }
            }),
            dataTextField: 'name',
            dataValueField: 'objectId',
            optionLabel: 'Select a interes...',
            //autoBind: false,
            change: $.proxy(this.onHashtagSelect, this)
        }).data("kendoMultiSelect");

    },
    saveProfile: function (event) {
        event.preventDefault();
        var firstName = $("#first_name").val();
        var lastName = $("#last_name").val();
        var email = $("#email_profile").val();
        var interests = $("#interests_select").val();
        var imgVal = $('#profilePhotoFileUpload').val();
        if (!email && email.length === 0) {
            valid = false;
            input = $("#email_profile");
        }
        ;
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();
        var fileUploadControl = $("#profilePhotoFileUpload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "avatar.jpg";
            var parseFile = new Parse.File(name, file);

            parseFile.save().then(function () {
                console.log("Success");
            }, function (error) {
                console.log(error.message);
            });
        }
        var testUser = Parse.User.current();
        testUser.set('firstName', firstName);
        testUser.set('lastName', lastName);
        testUser.set('email', email);
        if (parseFile !== undefined) {
            testUser.set('image', parseFile);
        }

        /*if (password1.length > 0) {
         if (password1 === password2) {
         testUser.set('password', password1);
         Parse.User.logOut();
         localStorage.removeItem("userId");
         localStorage.removeItem("username");
         localStorage.removeItem("sessionToken");
         window.location = 'login/login.html';
         alert("Login again");
         } else {
         alert("Password successfully changed! Please login again!")
         }
         }*/


        testUser.save(null, {
            success: $.proxy(function (response) {
                $(".success").show();
                location.reload();
//                window.location = '../index.html';
            }, this),
            error: function (model, error) {
                console.log(error.message);
            }
        });
    },
    getCurrentUser: function ()
    {
        var currentUser = Parse.User.current();
        var getThisUser = currentUser.attributes;
        console.log(getThisUser);
        console.log(getThisUser.Interestss);
        var getFirstName = getThisUser.firstName;
        if (getFirstName !== undefined) {
            document.getElementById('first_name').value = getFirstName;
        } else {
            document.getElementById('first_name').value = '';
        }
        ;
        var getUserInterests = getThisUser.Interestss;
        if (getUserInterests !== undefined) {
            document.getElementById('interests_select').value = getUserInterests;
        } else {
            document.getElementById('interests_select').value = '';
        }
        ;
        var getLastName = getThisUser.lastName;
        if (getLastName !== undefined) {
            document.getElementById('last_name').value = getLastName;
        } else {
            document.getElementById('last_name').value = '';
        }
        ;
        var getEmail = getThisUser.email;
        document.getElementById('email_profile').value = getEmail;
        if (getThisUser.image !== undefined) {
            var getImg = getThisUser.image._url;


        }
        ;
        //console.log(getImg);
        if (getImg !== undefined) {
            document.getElementById('profile_avatar').src = getImg;
        } else {
            document.getElementById('profile_avatar').src = 'images/no_avatar.jpg';
        }
        ;
    }

};

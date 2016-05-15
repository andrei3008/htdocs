foodhub.MainView = function (config) {
    $.extend(this, config);
    this.initComponent();
};


foodhub.MainView.prototype = {
    initComponent: function () {
        Parse.initialize("6Q8dLEqxOdOZRzLbxQgCFGuVj1hgkvk6KKtBqlLK", "e4R9KLJwGaie09y5HlotChon0bBdIMXDaRGnHJuE");
        this.userId = localStorage.getItem('userId');
        this.username = localStorage.getItem('username');
        this.sessionToken = localStorage.getItem('sessionToken');
        this.isFBLogin = (localStorage.getItem('isFBlogin') === 'YES');
        this.disableRightButtons();
        this.attachListeners();
        this.initKendoComponents();
        //this.createUserRoles();
        if (Parse.User.current().get('firstName') !== undefined && Parse.User.current().get('lastName') !== undefined && Parse.User.current().get('image') !== undefined) {
            $('#upcoming_events_menu_item').trigger('click');
        }
        else {
            $('#my_profile').trigger('click');
        }
        if (Parse.User.current().get('firstName') !== undefined && Parse.User.current().get('lastName') !== undefined) {
            var nameToShow = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
        }
        else {
            nameToShow = this.username;
        }
        $('#welcome').append('Welcome, <div id="user_profile">' + nameToShow + '</div>');

    },
    /*createUserRoles: function () {
        var roleACL = new Parse.ACL();
        roleACL.setPublicReadAccess(true);
        var role = new Parse.Role("Administrator", roleACL);
        role.save();
        
        var UserObject = Parse.Object.extend("_User");
        var query = new Parse.Query(UserObject);
        query.equalTo("objectId", "pzMTJ1N29e");
        query.find({
            success: $.proxy(function (results) {
                var userToAdd = results[0];
                var roleACL2 = new Parse.ACL();
                var roleToAdd = new Parse.Role("Administrator", roleACL2);
                roleToAdd.getUsers().add(userToAdd);
                roleToAdd.save();
            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
        
    },*/
    disableRightButtons: function () {
        $('#edit_event').attr('disabled', true);
        $('#remove_event').attr('disabled', true);
    },
    attachListeners: function () {
        $('nav').on('click', 'li', $.proxy(this.onMainMenuItem, this));
        $('#logout_button').on('click', $.proxy(this.onLogout, this));
        $('#add_event').on('click', $.proxy(this.onAddEvent, this));
        $('#edit_event').on('click', $.proxy(this.onEditEvent, this));


    },
    onLogout: function () {
        //console.log('abc');
        Parse.User.logOut();
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("isFBlogin");
        window.location = 'login/login.html';

    },
    /*getUserInfo: function() {
     var Object = Parse.Object.extend("Comment");
     },*/
    initKendoComponents: function () {
        this.populateRightMenu;
        
    },
    onWindowContent: function () {


    },
    onMainMenuItem: function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('.main-nav').find('a').removeClass('current_menu_item');
        $(event.currentTarget).find('a').addClass('current_menu_item');
        $(event.currentTarget).removeClass('menu_item');
        $(event.currentTarget).siblings().addClass('menu_item');
        var itemid = $(event.currentTarget).attr('id');
        switch (itemid) {
            case 'upcoming_events_menu_item':
                $('main').load('views/UpcomingEventsView.html', function () {
                    var upcomingEventsView = new foodhub.UpcomingEventsView();
                });
                break;
            case 'past_events_menu_item':
                $('main').load('views/PastEventsView.html', function () {
                    var pastEventsView = new foodhub.PastEventsView();
                });
                break;
            case 'my_profile':
                $('main').load('views/UserProfile.html', function () {
                    var userProfile = new foodhub.UserProfile({
                        
                    });
                });
                break;
            case 'hashtags_menu_item':
                $('main').load('views/HashtagsView.html', function () {
                    var hashtags = new foodhub.HashtagsView();
                });
                break;
            case 'users_menu_item':
                $('main').load('views/UsersView.html', function () {
                    var users = new foodhub.UsersView();
                });
                break;
        }
    },
    onAddEvent: function () {
        if (!$('#modal_window').length) {
            $('body').append('<div id="modal_window"></div>');
        }
        this.addEventWindow = $('#modal_window').kendoWindow({
            width: "800px",
            visible: false,
            modal: true,
            title: "Add Event",
            content: "views/AddEditEvent.html",
            position: {
                top: "15%",
                left: "20%"
            },
            refresh: $.proxy(this.onAddEventForm, this),
            close: function () {
                $('#modal_window').data('kendoWindow').destroy();
            }
        }).data("kendoWindow");
        this.addEventWindow.open();
        
    },
    onEditEvent: function () {
        if (!$('#modal_window').length) {
            $('body').append('<div id="modal_window"></div>');
        }
        this.editEventWindow = $('#modal_window').kendoWindow({
            width: "800px",
            visible: false,
            modal: true,
            title: "Edit Event",
            content: "views/AddEditEvent.html",
            position: {
                top: "15%",
                left: "20%"
            },
            refresh: $.proxy(this.onEditEventForm, this),
            close: function () {
                $('#modal_window').data('kendoWindow').destroy();
            }
        }).data("kendoWindow");
        this.editEventWindow.open();
    },
    onAddEventForm: function () {
        var form = new foodhub.AddEventForm();
    },
    onEditEventForm: function () {
        var checkboxes = $('#upcoming_events_list').find('.checkbox:checked');
        var row = $(checkboxes[0]).closest("tr");
        var record = $('#upcoming_events_list').data('kendoGrid').dataItem(row);
        //console.log(record.objectId);
        var form = new foodhub.AddEventForm(
                {
                    mode: 'edit',
                    eventId: record.objectId
                });
    }


};

$(document).ready(function () {
    var mainApp = new foodhub.MainView();

});
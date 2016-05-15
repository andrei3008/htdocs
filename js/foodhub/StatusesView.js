foodhub.StatusesView = function (config) {
    $.extend(this, config);
    this.initComponent();

};

foodhub.StatusesView.prototype = {
    initComponent: function () {
        this.statuses = [];
        this.disableRightButtons();
        this.attachListeners();
        this.initKendoComponents();
        this.appendEventHeader();
        this.loadEvent();
        google.maps.event.addDomListener(window, 'load', this.appendEventLocation());


    },
    disableRightButtons: function () {
        $('#edit_event').attr('disabled', true);
        $('#remove_event').attr('disabled', true);
    },
    attachListeners: function () {

        $('.text_status').off().on('focus', $.proxy(this.onWriteStatus, this));
        $('.add_status_button').off().on('click', $.proxy(this.onAddStatus, this));
        $('main').on('click', '.like_button', $.proxy(this.onLikeButton, this));
        $('main').on('click', '.unlike_button', $.proxy(this.onUnLikeButton, this));
        $('.event_statuses').off().on('click', '.comment_button', $.proxy(this.onCommentButton, this));
        $('.event_statuses').on('click', '.submit_comment', $.proxy(this.onSubmitComment, this));


    },
    initKendoComponents: function () {

        var oThis = this;
        this.statusesListView = $('.event_statuses').kendoListView({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'https://api.parse.com/1/classes/Status',
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        contentType: "application/json",
                        type: "POST"
                    },
                    parameterMap: function (option, operation) {
                        var payLoad = JSON.stringify({
                            _ApplicationId: "6Q8dLEqxOdOZRzLbxQgCFGuVj1hgkvk6KKtBqlLK",
                            _ClientVersion: "js1.4.2",
                            _InstallationId: "7068cdf1-827a-a514-8a7d-dd20e9d90e13",
                            _JavaScriptKey: "e4R9KLJwGaie09y5HlotChon0bBdIMXDaRGnHJuE",
                            _method: "GET",
                            "where": {
                                "$relatedTo": {
                                    "object": {
                                        "__type": "Pointer",
                                        "className": "Event",
                                        "objectId": oThis.objectId
                                    },
                                    "key": "statuses"
                                }
                            }

                        });
                        return payLoad;
                    }
                },
                schema: {
                    model: {
                        id: 'objectId',
                        fields: {
                            createdAt: {
                                type: 'date'
                            }

                        }
                    },
                    parse: function (response) {
                        var statuses = response.results;
                        for (var i = 0; i < statuses.length; i++) {
                            if (statuses[i].image === undefined) {
                                statuses[i].image = {};
                                statuses[i].image.url = '';
                                statuses[i].imageClass = "no_status_image";
                            }
                            else {
                                statuses[i].imageClass = "status_image";
                            }
                            if (statuses[i].createdByImageUrl === undefined) {
                                statuses[i].createdByImageUrl = 'images/no_avatar.jpg';
                            }
                            if (statuses[i].likes === undefined) {
                                statuses[i].likes = [];
                            }
                            if (statuses[i].likes.length === 0) {
                                statuses[i].likeToShow = '0 people liked this';
                            }
                            if (statuses[i].likes.length === 1) {
                                statuses[i].likeToShow = statuses[i].likes[0].currentUsername + ' liked this';
                            }
                            if (statuses[i].likes.length === 2) {
                                statuses[i].likeToShow = statuses[i].likes[0].currentUsername + ' and ' + statuses[i].likes[1].currentUsername + ' liked this';
                            }
                            if (statuses[i].likes.length > 2) {
                                statuses[i].likeToShow = statuses[i].likes[0].currentUsername + ' and ' + (statuses[i].likes.length - 1) + ' others liked this';
                            }
                            statuses[i].likeUnlikebutton = "images/like.jpg";
                            statuses[i].likeUnlikebuttonClass = "like_button";
                            var currentUserUsername = Parse.User.current().get('username');
                            var currentUserEntireName = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
                            var currentUserId = Parse.User.current().id;
                            if (Parse.User.current().get('firstName') === undefined || Parse.User.current().get('lastName') === undefined) {
                                var currentUser = {
                                    currentUserId: currentUserId,
                                    currentUsername: currentUserUsername
                                };
                            }
                            else {
                                var currentUser = {
                                    currentUserId: currentUserId,
                                    currentUsername: currentUserEntireName
                                };
                            }
                            for (var j = 0; j < statuses[i].likes.length; j++) {
                                var currentUserLiked = false;
                                var currentUserPosInLike = 0;
                                currentUserToString = JSON.stringify(currentUser);
                                likeObjectToString = JSON.stringify(statuses[i].likes[j]);
                                console.log(currentUserToString);
                                console.log(likeObjectToString);
                                if (currentUserToString === likeObjectToString) {
                                    currentUserLiked = true;
                                    currentUserPosInLike = j;
                                    statuses[i].likeUnlikebutton = "images/unlike.jpg";
                                    statuses[i].likeUnlikebuttonClass = "unlike_button";
                                }
                                if (currentUserLiked && statuses[i].likes.length === 1) {
                                    statuses[i].likeToShow = 'You liked this';
                                }
                                if (currentUserLiked && statuses[i].likes.length === 2) {
                                    if (currentUserPosInLike === 0) {
                                        statuses[i].likeToShow = 'You and ' + statuses[i].likes[1].currentUsername + ' liked this';
                                    }
                                    if (currentUserPosInLike === 1) {
                                        statuses[i].likeToShow = 'You and ' + statuses[i].likes[0].currentUsername + ' liked this';
                                    }
                                }
                                var likeArrayDiffCurrUser = [];
                                if (currentUserLiked && statuses[i].likes.length > 2) {
                                    for (var l = 0; l < statuses[i].likes.length, JSON.stringify(statuses[i].likes[l]) !== JSON.stringify(statuses[i].likes[currentUserPosInLike]); l++) {
                                        likeArrayDiffCurrUser.push(statuses[i].likes[l].currentUsername);
                                    }
                                    console.log(likeArrayDiffCurrUser);
                                    statuses[i].likeToShow = 'You and ' + (statuses[i].likes.length - 1) + ' others liked this';
                                    //statuses[i].likeToShow = 'You and ' + '<a href="">' + (statuses[i].likes.length - 1) + ' others</a> liked this';
                                }
                            }

                        }

                        return statuses;
                    }
                },
                sort: {
                    field: "createdAt",
                    dir: "desc"
                }
            }),
            template: '<div id="${objectId}" class="status"><div class="status_header"><img class="status_user_image" src="${createdByImageUrl}" alt=""/>\n\
<div class="status_created_by">${createdBy}</div><div class="status_created_date">on ${foodhub.Render.dateFormat(createdAt).split(" ")[0]} at ${foodhub.Render.dateFormat(createdAt).split(" ")[1]}</div></div>\n\
<div class="status_content"><div class="status_text">${text}</div><img class="${imageClass}" src="${image.url}"/></div>\n\
<div class="status_footer"><div class="like_div"><img src=${likeUnlikebutton} alt="like" class=${likeUnlikebuttonClass}></div><div class="like_count">${likeToShow}</div>\n\
<div class="comment_div"><img src="images/comment.jpg" alt="comment" class="comment_button"/></div>\n\
</div><div class="clear_on_status"></div></div><div class="clear_on_status"></div>'

        }).data('kendoListView');
    },
    appendEventHeader: function () {
        var startDateNormalFormat = foodhub.Render.dateFormat(this.startDate);
        var dayHour = startDateNormalFormat.split(' ');
        //console.log(foodhub.Render.dateFormat(this.startDate).split(' ')[0]);
        var day = dayHour[0];
        var hour = dayHour[1];
        if (this.image !== undefined && this.image !== null) {
            $('#event_header').append('<div class="event_header_image"><img src="' + this.image.url + '" alt="event_image" class="event_img"/></div>');
        }
        $('#event_header').append('<div class="date_hour"><div class="calendar"><div class="calendar_image_div"><img class="calendar_image"src="images/calendar.jpg" alt=""/>\n\
</div><div class="event_date">' + day + '</div></div><div class="clock"><div class="clock_image_div"><img class="clock_image"src="images/clock.jpg" alt=""/></div>\n\
<div class="event_hour">' + hour + '</div></div></div>');
        $('#event_description').append('<div class="event_description">' + this.description + '</div>');
        //$('#event_header').append('<div class="event_date">' + foodhub.Render.dateFormat(this.startDate) + '</div>');

    },
    loadEvent: function () {
        var EventObject = Parse.Object.extend("Event");
        var query = new Parse.Query(EventObject);
        query.equalTo("objectId", this.objectId);
        query.find({
            success: $.proxy(function (results) {
                this.event = results[0];
                //console.log(this.event);
            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },
    appendEventLocation: function () {
        //console.log(this.location);
        var myLatLng = new google.maps.LatLng(this.location.latitude, this.location.longitude),
                myOptions = {
                    zoom: 13,
                    center: myLatLng,
                    scrollwheel: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },
        map = new google.maps.Map(document.getElementById('event_location'), myOptions),
                marker = new google.maps.Marker({position: myLatLng,
                    map: map,
                    draggable: false
                });
    },
    onWriteStatus: function () {
        $('.add_instruments').removeClass('hide');
        $('.text_status').addClass('text_status_active');
        $(".add_image_icon").off().on('click', function (event) {
            $(".add_image_input").trigger('click');
        });

    },
    onAddStatus: function (event) {
        var validText = true;
        var validImage = true;
        var validFirstName = true;
        var validLastName = true;
        if (!$('.text_status').val()) {
            validText = false;
        }
        var statusText = $('.text_status').val();
        var statusUsername = localStorage.getItem('username');
        var statusUserId = localStorage.getItem('userId');

        var fileUploadControl = $(".add_image_input")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "statusphoto.jpg";
            var parseFile = new Parse.File(name, file);
        }
        if (parseFile !== undefined) {
            parseFile.save().then(function () {
                //console.log("Success");
            }, function (error) {
                console.log(error.message);
            });
        } else {
            validImage = false;
        }
        if (!validText && !validImage) {
            var notificationMissingStatusInput = $('#missing_status_input_notification').kendoNotification({
                appendTo: "#missing_status_input_notification",
                width: 300
            }).data('kendoNotification');
            notificationMissingStatusInput.show("Please enter a text or upload an image!");
        }
        if (Parse.User.current().get('image') === undefined) {
            Parse.User.current().set('image', 'images/no_avatar.jpg');
        }
        var statusUser = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
        if (Parse.User.current().get('firstName') === undefined || Parse.User.current().get('lastName') === undefined) {
            statusUser = statusUsername;
        }
        var StatusObject = Parse.Object.extend("Status");
        var newStatus = new StatusObject();
        if (validText || validImage) {
            newStatus.save({
                "text": statusText,
                "createdBy": statusUser,
                "createdById": statusUserId,
                "createdByImageUrl": Parse.User.current().get('image')._url,
                "image": parseFile
            },
            {
                success: $.proxy(function (response) {
                    this.status = response;
                    //console.log(this.status);
                    //console.log(this.event);
                    var relation = this.event.relation("statuses");
                    relation.add(this.status);
                    this.event.save(null, {
                        success: function (response) {
                            $('.event_statuses').data('kendoListView').dataSource.read();
                            $('.event_statuses').data('kendoListView').refresh();
                        },
                        error: function (model, error) {
                            console.log(error.message);
                        }
                    });
                    this.saveInHashTags();

                }, this),
                error: function (model, error) {
                    console.log(error.message);
                }
            }
            );
        }
        $(".add_image_input").replaceWith($(".add_image_input").clone());
    },
    saveInHashTags: function () {
        var enteredStatus = $('.text_status').val();
        var hashtagsArray = enteredStatus.match(/#\S+/g);
        var oThis = this;
        if (hashtagsArray !== null) {
            for (var i = 0; i < hashtagsArray.length; i++) {
                var HashtagsObject = Parse.Object.extend("Hashtags");
                var query = new Parse.Query(HashtagsObject);
                query.equalTo("name", hashtagsArray[i]);
                query.find({
                    success: $.proxy(function (results) {
                        var hashtagsFound = results;
                        if (hashtagsFound[0] !== undefined) {
                            var hashtag = hashtagsFound[0];
                            var status = oThis.status;
                            var relation = hashtag.relation("statuses");
                            relation.add(status);
                            hashtag.save(null, {
                                success: function (response) {

                                },
                                error: function (model, error) {
                                    console.log(error.message);
                                }
                            });

                        }
                        else {
                            var HashtagObject = Parse.Object.extend("Hashtags");
                            var newHashtag = new HashtagObject();
                            newHashtag.save({
                                "name": this.name
                            },
                            {
                                success: $.proxy(function (response) {
                                    var hashtag = response;
                                    var status = this.status;
                                    var relation = hashtag.relation("statuses");
                                    //console.log(hashtag);
                                    //console.log(status);
                                    //console.log(relation);
                                    relation.add(status);
                                    hashtag.save(null, {
                                        success: function (response) {

                                        },
                                        error: function (model, error) {
                                            console.log(error.message);
                                        }
                                    }
                                    );

                                }
                                , oThis),
                                error: function (model, error) {
                                    console.log(error.message);
                                }
                            }
                            );
                        }

                    }, {name: hashtagsArray[i]}),
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
        }
        $('.text_status').val('');
    },
    onLikeButton: function (event) {
        var currentUserUsername = Parse.User.current().get('username');
        var currentUserEntireName = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
        var currentUserId = Parse.User.current().id;
        var statusId = $(event.currentTarget).closest('.status').attr('id');
        if (Parse.User.current().get('firstName') === undefined || Parse.User.current().get('lastName') === undefined) {
            var currentUser = {
                currentUserId: currentUserId,
                currentUsername: currentUserUsername
            };
        }
        else {
            var currentUser = {
                currentUserId: currentUserId,
                currentUsername: currentUserEntireName
            };
        }
        console.log(currentUser);
        //console.log(currentUser);
        var StatusObject = Parse.Object.extend("Status");
        var query = new Parse.Query(StatusObject);
        query.equalTo("objectId", statusId);
        query.find({
            success: $.proxy(function (results) {
                var currentStatus = results[0];
                currentStatus.addUnique("likes", currentUser);
                currentStatus.save(null, {
                    success: function (response) {
                        $('.event_statuses').data('kendoListView').dataSource.read();
                        $('.event_statuses').data('kendoListView').refresh();
                    },
                    error: function (model, error) {
                        console.log(error.message);
                    }
                });

            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    },
    onUnLikeButton: function (event) {
        var currentUserUsername = Parse.User.current().get('username');
        var currentUserEntireName = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
        var currentUserId = Parse.User.current().id;
        var statusId = $(event.currentTarget).closest('.status').attr('id');
        if (Parse.User.current().get('firstName') === undefined || Parse.User.current().get('lastName') === undefined) {
            var currentUser = {
                currentUserId: currentUserId,
                currentUsername: currentUserUsername
            };
        }
        else {
            var currentUser = {
                currentUserId: currentUserId,
                currentUsername: currentUserEntireName
            };
        }
        var StatusObject = Parse.Object.extend("Status");
        var query = new Parse.Query(StatusObject);
        query.equalTo("objectId", statusId);
        query.find({
            success: $.proxy(function (results) {
                var currentStatus = results[0];
                currentStatus.remove("likes", currentUser);
                currentStatus.save(null, {
                    success: function (response) {
                        $('.event_statuses').data('kendoListView').dataSource.read();
                        $('.event_statuses').data('kendoListView').refresh();
                    },
                    error: function (model, error) {
                        console.log(error.message);
                    }
                });

            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },
    onCommentButton: function (event) {
        var statusId = $(event.currentTarget).closest('.status').attr('id');
        var StatusObject = Parse.Object.extend("Status");
        var query = new Parse.Query(StatusObject);
        query.equalTo("objectId", statusId);
        query.find({
            success: $.proxy(function (results) {
                this.statuses[statusId] = results[0];
                this.status = results[0];
                //console.log(this);
            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
        if (Parse.User.current().get('image') === undefined) {
            Parse.User.current().set('image', 'images/no_avatar.jpg');
            var currentUserImage = "images/no_avatar.jpg";

        } else {
            var currentUserImage = Parse.User.current().get('image')._url;
            if (currentUserImage === undefined) {
                var currentUserImage = "images/no_avatar.jpg";
            }

        }
        if (!$(event.currentTarget).closest('.status').children().hasClass("status_comments")) {
            $(event.currentTarget).closest('.status').append('<div class="status_comments"></div>');
            $(event.currentTarget).closest('.status').append('<form class="comment_form"><div class="current_user_image_div"><img class="current_user_image" src="' + currentUserImage + '" alt=""></div>\n\
<textarea class="comment_textarea" placeholder="Write a comment..."></textarea><input type="button" class="submit_comment button-success pure-button"\n\
value="SUBMIT COMMENT"/><div class="missing_comment_input_notification"</div></form>');
        }
        else {
            $(event.currentTarget).closest('.status_footer').siblings('.status_comments').toggle();
            $(event.currentTarget).closest('.status_footer').siblings('.comment_form').toggle();

        }
        var renderEl = $(event.currentTarget).closest('.status').find('.status_comments');
        //console.log(renderEl);
        this.commentsListView = renderEl.kendoListView({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'https://api.parse.com/1/classes/Comment',
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        contentType: "application/json",
                        type: "POST"
                    },
                    parameterMap: function (option, operation) {
                        var payLoad = JSON.stringify({
                            _ApplicationId: "6Q8dLEqxOdOZRzLbxQgCFGuVj1hgkvk6KKtBqlLK",
                            _ClientVersion: "js1.4.2",
                            _InstallationId: "7068cdf1-827a-a514-8a7d-dd20e9d90e13",
                            _JavaScriptKey: "e4R9KLJwGaie09y5HlotChon0bBdIMXDaRGnHJuE",
                            _method: "GET",
                            "where": {
                                "$relatedTo": {
                                    "object": {
                                        "__type": "Pointer",
                                        "className": "Status",
                                        "objectId": statusId
                                    },
                                    "key": "comment"
                                }
                            }

                        });
                        return payLoad;
                    }
                },
                schema: {
                    model: {
                        id: 'objectId',
                        fields: {
                            createdAt: {
                                type: 'date'
                            }

                        }
                    },
                    parse: function (response) {
                        //console.log(oThis);
                        var comments = response.results;
                        for (var i = 0; i < comments.length; i++) {
                            if (comments[i].createdByImageUrl === undefined) {
                                comments[i].createdByImageUrl = 'images/no_avatar.jpg';
                            }

                        }

                        return comments;

                    }
                },
                sort: {
                    field: "createdAt",
                    dir: "asc"
                }
            }),
            template: '<div class="comment"><img class="comment_user_image" src="${createdByImageUrl}" alt=""/>\n\
<div class="author_date"><div class="comment_created_by">${createdBy}</div><div class="comment_date">on ${foodhub.Render.dateFormat(createdAt).split(" ")[0]} at ${foodhub.Render.dateFormat(createdAt).split(" ")[1]}</div></div><div class="comment_text">${text}</div><div class="clear_on_comment"></div></div>'
                    //'<div> ${createdAt}</div><div>${text}</div><div>${createdBy}</div>'
        }).data('kendoListView');
        var currentCommentArea = $(event.currentTarget).closest('.status_footer').siblings('.comment_form').find('.comment_textarea');
        setTimeout(function () {
            currentCommentArea.focus();
        }, 0);
        currentCommentArea.keypress(function (e) {
            if (e.which === 13) {
                $(currentCommentArea).siblings('.submit_comment').trigger('click');
                e.preventDefault();
            }
        });

    },
    onSubmitComment: function (event) {
        var valid_comment = true;
        var commentText = $(event.currentTarget).parent().find('.comment_textarea').val();
        if (!commentText) {
            valid_comment = false;
        }
        var CommentObject = Parse.Object.extend("Comment");

        var commentUsername = localStorage.getItem('username');
        var commentUserId = localStorage.getItem('userId');

        if (Parse.User.current().get('image') === undefined) {
            Parse.User.current().set('image', 'images/no_avatar.jpg');
        }
        /*if (!valid_comment) {
            var notifEl = $(event.currentTarget).parent().find('.missing_comment_input_notification');
            var notificationMissingCommentInput = notifEl.kendoNotification({
                appendTo: notifEl,
                width: 200
            }).data('kendoNotification');
            notificationMissingCommentInput.show("Please enter a text!");
        }*/
        var newComment = new CommentObject();
        var commentUser = Parse.User.current().get('firstName') + ' ' + Parse.User.current().get('lastName');
        if (Parse.User.current().get('firstName') === undefined || Parse.User.current().get('lastName') === undefined) {
            commentUser = commentUsername;
        }

        if (valid_comment) {
            var statusId = $(event.currentTarget).closest('.status').attr('id');
            newComment.save({
                "text": commentText,
                "createdBy": commentUser,
                "createdById": commentUserId,
                "createdByImageUrl": Parse.User.current().get('image')._url
            },
            {
                success: $.proxy(function (response) {
                    //console.log(response);
                    var comment = response;
                    //console.log(this.status);
                    var relation = this.statuses[statusId].relation("comment");
                    relation.add(comment);
                    this.statuses[statusId].save(null, {
                        success: function (response) {
                            $(event.currentTarget).closest('.status').find('.status_comments').data('kendoListView').dataSource.read();
                            $(event.currentTarget).closest('.status').find('.status_comments').data('kendoListView').refresh();
                        },
                        error: function (model, error) {
                            console.log(error.message);
                        }
                    }
                    );

                }, this),
                error: function (model, error) {
                    console.log(error.message);
                }
            }
            );
        }


        $(event.currentTarget).parent().find('.comment_textarea').val('');

    }
    //this.eventId
};
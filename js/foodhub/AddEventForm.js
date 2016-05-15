foodhub.AddEventForm = function (config) {
    $.extend(this, config);
    this.initComponent();
    //console.log(this.mode === 'edit');

};

foodhub.AddEventForm.prototype = {
    initComponent: function () {
        this.attachListeners();
        this.initKendoComponents();
        
        if (this.mode === 'edit') {
            this.retrieveEventInfo();
        } else {
            this.initGoogleMap();
        }


    },
    attachListeners: function () {
        $('#submit_event').on('click', $.proxy(this.submitEvent, this));
        $(".upload_event_picture").off().on('click', function (event) {
            $("#eventPhotoFileUpload").trigger('click');
        });
        
    },
    initKendoComponents: function () {

        this.kendoStartDatePicker = $('#startdatepicker').kendoDateTimePicker({
        }).data('kendoDateTimePicker');
        this.kendoEndDatePicker = $('#enddatepicker').kendoDateTimePicker({
        }).data('kendoDateTimePicker');
        this.eventTypeList = $('#event_type').kendoDropDownList({
            dataSource: [
                {name: "BBQ Restaurants"},
                {name: "Fast Foods"},
                {name: "Food Delivery"},
                {name: "Coffee Shops"},
                {name: "Chinese Food"},
                {name: "Seafood Restaurants"},
                {name: "Sandwich Restaurants"},
                {name: "Steakhouse"},
                {name: "Tavern"},
                {name: "Family Restaurants"},
                {name: "Organic Restaurants"},
                {name: "Pizza Restaurants"},
                {name: "Sweetshop"},
                {name: "Vegetarian Restaurants"},
                {name: "Wine Bars"}
            ],
            //dataTextField: 'name',
//          dataValueField: 'objectId',
            optionLabel: 'Food category...',
            autoBind: false,
            template: '<span>${name}</span>',
            valueTemplate: '<span>${name}</span>'
        }).data('kendoDropDownList');

    },
    initGoogleMap: function () {
//        var myLatLng = new google.maps.LatLng(44.305164, 23.7997349),
//                myOptions = {
//                    zoom: 14,
//                    center: myLatLng,
//                    mapTypeId: google.maps.MapTypeId.ROADMAP
//                },
//        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
//                marker = new google.maps.Marker({position: myLatLng,
//                    map: map,
//                    draggable: true
//                });
        if (this.mode === 'edit') {
            var myLatlng = new google.maps.LatLng(this.event.attributes.location._latitude, this.event.attributes.location._longitude);
        } else {
            var myLatlng = new google.maps.LatLng(44.305164, 23.7997349);
        }
        
        // function initialize() {
        var mapOptions = {
            zoom: 16,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            position: myLatlng,
            draggable: true
        });
        var oThis = this;

        google.maps.event.addListener(marker, 'dragend', $.proxy(function () {
           this.getAddressOnMap(map, marker);
        },this));
        
            this.getAddressOnMap(map, marker);
        

        //}

    },
    getAddressOnMap: function (map, marker) {
        var geocoder = new google.maps.Geocoder();
        var infowindow = new google.maps.InfoWindow();
        var oThis = this;
        geocoder.geocode({'latLng': marker.getPosition()}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {

                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                        oThis.formattedAddress = results[0].formatted_address;
                        oThis.lat = marker.getPosition().lat();
                        oThis.lng = marker.getPosition().lng();


                        console.log("Adresa este: " + results[0].formatted_address);
                        console.log("Latitudinea este: " + marker.getPosition().lat());
                        console.log("Longitudinea este: " + marker.getPosition().lng());
                    }
                }
            });
    },
    retrieveEventInfo: function () {
        var EventObject = Parse.Object.extend("Event");
        var query = new Parse.Query(EventObject);
        query.equalTo("objectId", this.eventId);
        query.find({
            success: $.proxy(function (results) {
                this.event = results[0];
                console.log(this.event);
                $("#event_name").val(this.event.attributes.name);
                $("#event_description_input").val(this.event.attributes.description);
                this.eventTypeList.value(this.event.attributes.type);
                $("#event_hashtags").val(this.event.attributes.externalHashtags);
                this.kendoStartDatePicker.value(this.event.attributes.startDate);
                this.kendoEndDatePicker.value(this.event.attributes.endDate);
                this.initGoogleMap();
            }, this),
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
        //console.log(this.event);
    },
    submitEvent: function (event) {
        event.preventDefault();
        valid = true;
        var nume = $("#event_name").val();
        var descriere = $("#event_description_input").val();
        var categorie = this.eventTypeList.value();
        var hashtags = $("#event_hashtags").val();
        var startDate = this.kendoStartDatePicker.value();
        var startDateISO = foodhub.Render.todayISO(startDate);
        var endDate = this.kendoEndDatePicker.value();
        var endDateISO = foodhub.Render.todayISO(endDate);
        console.log(endDate);
        if (startDate === null) {
            valid = false;
            startDateMissing = $('#start_date_missing').kendoNotification({
                appendTo: "#start_date_missing",
                width: 385
            }).data('kendoNotification');
            startDateMissing.show("Please choose a start date for your event.");
        }
        if (endDate === null) {
            valid = false;
            endDateMissing = $('#end_date_missing').kendoNotification({
                appendTo: "#end_date_missing",
                width: 385
            }).data('kendoNotification');
            endDateMissing.show("Please choose a end date for your event.");
        }
        if (startDate >= endDate && endDate !== null) {
            valid = false;
            startDateBiggerNotification = $('#wrong_dates').kendoNotification({
                appendTo: "#wrong_dates",
                width: 400
            }).data('kendoNotification');
            startDateBiggerNotification.show("The end date should be after the start date");
        }
        var currentDate = new (Date);
        if (startDate <= currentDate && startDate !== null) {
            valid = false;
            startDateInPastNotification = $('#start_date_inpast').kendoNotification({
                appendTo: "#start_date_inpast",
                width: 500
            }).data('kendoNotification');
            startDateInPastNotification.show("Do you want to time-travel? The start date is in the past.");
        }

        var point = new Parse.GeoPoint({latitude: this.lat, longitude: this.lng});
        var addressArray = this.formattedAddress.split(',');
        var street = addressArray[0];
        var city = addressArray[1];
        var fileUploadControl = $("#eventPhotoFileUpload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.jpg";
            var parseFile = new Parse.File(name, file);
        }
        if (parseFile !== undefined) {
            parseFile.save().then(function () {
                console.log("Success");
            }, function (error) {
                console.log(error.message);
            });
        }
        if (this.mode === 'edit' && valid === true) {
            this.event.save({
                "name": nume,
                "description": descriere,
                "type": categorie,
                "location": point,
                "city": city,
                "address": street,
                "externalHashtags": [hashtags],
                "image": parseFile,
                "startDate": new Date(startDate),
                "endDate": new Date(endDate)
            }, {
                success: $.proxy(function (response) {
                    $('#modal_window').data('kendoWindow').close();
                    $('#upcoming_events_list').data('kendoGrid').dataSource.read();
                    $('#upcoming_events_list').data('kendoGrid').refresh();

                }, this),
                error: function (model, error) {
                    console.log(error.message);
                }
            });
        } else {
            var EventObject = Parse.Object.extend("Event");
            var testEvent = new EventObject();
            if (valid === true) {
                testEvent.save({
                    "name": nume,
                    "description": descriere,
                    "type": categorie,
                    "location": point,
                    "city": city,
                    "address": street,
                    "externalHashtags": [hashtags],
                    "image": parseFile,
                    "startDate": new Date(startDate),
                    "endDate": new Date(endDate)
                }, {
                    success: $.proxy(function (response) {
                        //$(".success").show();
                        $('#modal_window').data('kendoWindow').close();
                        //$('#upcoming_events_list').data('kendoGrid').dataSource.read();
                        //$('#upcoming_events_list').data('kendoGrid').refresh();
                        location.reload();
//                window.location = '../index.html';
                    }, this),
                    error: function (model, error) {
                        console.log(error.message);
                    }
                });
            }

        }

    },
    removeEvent: function () {
        
    }
};

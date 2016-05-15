foodhub.PastEventsView = function (config) {
    $.extend(this, config);
    this.initComponent();
}

foodhub.PastEventsView.prototype = {
    initComponent: function () {
        this.disableRightButtons();
        this.attachListeners();
        this.initKendoComponents();
    },
    disableRightButtons: function () {
        $('#edit_event').attr('disabled', true);
        $('#remove_event').attr('disabled', true);
    },
    attachListeners: function () {
        $('#past_events_list').on('click', '.checkbox', $.proxy(this.onCheckBoxClick, this));
        $('#past_events_list').on('click', '.read_more', $.proxy(this.onDetailsButton, this));
        $('#remove_event').off().on('click', $.proxy(this.onRemovePastEvent, this));
        

    },
    initKendoComponents: function () {
        this.pastGrid = $('#past_events_list').kendoGrid({
            selectable: false,
            sortable: true,
            groupable: false,
            pageable: {
                refresh: true,
                pageSizes: [5, 10, 20],
                input: true,
                previousNext: true,
                numeric: false,
                messages: {
                    empty: "No events found",
                    itemsPerPage: "events per page"
                }
            },
            editable: false,
            columns: [
                {template: "<input type='checkbox' class='checkbox' />", width: 40},
                {
                    field: "name",
                    title: "Name",
                    width: 130
                }, {
                    field: "description",
                    title: "Description",
                    width: 250
                }, {
                    field: "startDate",
                    title: "Date",
                    template: '#=foodhub.Render.dateFormat(startDate)#',
                    width: 100
                }, {
                    field: "city",
                    title: "City",
                    width: 90
                }, {
                    field: "statuses",
                    title: " ",
                    template: "<input type='button' class='read_more' value='Find out more'/>",
                    width: 130
                }
            ],
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'https://api.parse.com/1/classes/Event',
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
                            "where": {"startDate": {"$lt": {"__type": "Date", "iso": foodhub.Render.todayISO()}}}

                        });
                        return payLoad;
                    }
                },
                schema: {
                    model: {
                        id: 'objectId',
                        fields: {
                            startDate: {
                                type: 'date'
                            }
                        }
                    },
                    parse: function (response) {
                        var events = response.results;
                        for (var i = 0; i < events.length; i++) {
                            events[i].startDate = events[i].startDate.iso;
                        }
                        return events;
                    }
                },
                sort: {
                    field: "startDate",
                    dir: "desc"
                },
                page: 1,
                pageSize: 5
            })
        }).data('kendoGrid');


    },
    onCheckBoxClick: function (e) {
        var checkboxes = $('#past_events_list').find('.checkbox');
        var count = 0;
        for (var i = 0, length = checkboxes.length; i < length; i++) {
            if ($(checkboxes[i]).is(':checked')) {
                count++;
            }
        }
        if (count === 0) {
            $('#remove_event').removeClass('pure-button-active').addClass('pure-button-disabled');
            $('#remove_event').attr('disabled', true);
        }
        if (count >= 1) {
            $('#remove_event').removeClass('pure-button-disabled').addClass('pure-button-active');
            $('#remove_event').removeAttr('disabled');
        }

    },
    onDetailsButton: function (event) {
        var row = $(event.currentTarget).closest("tr");
        var record = this.pastGrid.dataItem(row);
        //console.log(record);
        var eventId = record.objectId;
        var eventDescription = record.description;
        var eventStartDate = record.startDate;
        var eventEndDate = record.endDate;

        $('main').load('views/StatusesView.html', function () {
            var statusesView = new foodhub.StatusesView(record);
        });
    },
    onRemovePastEvent: function () {
        var checkboxesChecked = $('#past_events_list').find('.checkbox:checked');
        var tickedCheckboxes = [];
        for (var i = 0; i < checkboxesChecked.length; i++) {
            var row = $('#past_events_list').find('.checkbox:checked')[i].closest('tr');
            var record = this.pastGrid.dataItem(row);
            var objectId = record.objectId;
            tickedCheckboxes.push(objectId);
        }
        console.log(tickedCheckboxes);
        for (var j = 0; j < tickedCheckboxes.length; j++) {
            var removeEvent = Parse.Object.extend("Event");
            var query = new Parse.Query(removeEvent);
            query.get(tickedCheckboxes[j], {
                success: function (myObj) {
                    // The object was retrieved successfully.
                    myObj.destroy({});
                    
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and description.
                }
            });
        }
        var reloadGrid = function () {
            this.pastGrid.dataSource.read();
        };
        setTimeout($.proxy(reloadGrid, this),1000);
    }
    

};


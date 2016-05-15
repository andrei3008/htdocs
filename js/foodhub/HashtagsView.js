foodhub.HashtagsView = function (config) {
    $.extend(this, config);
    this.initComponent();
};

foodhub.HashtagsView.prototype = {
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

    },
    initKendoComponents: function () {

        this.hashtagsDropDownList = $('#hashtags_dropdown_list').kendoDropDownList({
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
        }).data("kendoDropDownList");

    },
    onHashtagSelect: function () {
        var currentHashtagId = this.hashtagsDropDownList.value();
        this.currentHashtagStatusesListView = $('#hashtag_statuses').kendoListView({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'https://api.parse.com/1/classes/Status',
                        dataType: "json",
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
                                        "className": "Hashtags",
                                        "objectId": currentHashtagId
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
                       // console.log(response);
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
                                statuses[i].createdByImageUrl = '';
                                statuses[i].createdByImageUrlClass = "no_status_user_image";
                            }
                            else {
                                statuses[i].createdByImageUrlClass = "status_user_image";
                            }
                        }
                        console.log(response);
                        return statuses;
                    }
                },
                sort: {
                    field: "createdAt",
                    dir: "desc"
                }
            }),
            template: '<div id="${objectId}" class="status"><div class="status_header"><img class="${createdByImageUrlClass}" src="${createdByImageUrl}" alt=""/>\n\
<div class="status_created_by">${createdBy}</div><div class="status_created_date">on ${foodhub.Render.dateFormat(createdAt).split(" ")[0]} at ${foodhub.Render.dateFormat(createdAt).split(" ")[1]}</div></div>\n\
<div class="status_content"><div class="status_text">${text}</div><img class="${imageClass}" src="${image.url}"/></div>\n\
</div><div class="clear_on_status"></div>'
                    
        }).data('kendoListView');
    }
};
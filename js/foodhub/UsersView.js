foodhub.UsersView = function (config) {
    $.extend(this, config);
    this.initComponent();
};

foodhub.UsersView.prototype = {
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
        var usersGrid = $('#users_list').kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'https://api.parse.com/1/classes/_User',
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
                            "where": {}

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
                            },
                        }
                    },
                    parse: function (response) {
                        console.log(response);
                        var users = response.results;
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].firstName === undefined) {
                                users[i].firstName = '';
                            }
                            if (users[i].lastName === undefined) {
                                users[i].lastName = '';
                            }
                            
                        }
                        return users;
                    }
                },
                sort: {
                    field: "username",
                    dir: "asc"
                },
                page: 1,
                pageSize: 5
            }),
            selectable: false,
            sortable: true,
            editable: false,
            pageable: {
                refresh: true,
                pageSizes: [5, 10, 20],
                input: true,
                previousNext: true,
                numeric: false,
                messages: {
                    empty: "No users found",
                    itemsPerPage: "users per page"
                }
            },
            columns: [
                {template: "<input type='checkbox' class='user_checkbox' />", width: 40},
                {
                    field: "username",
                    title: "Username",
                    width: 90
                }, {
                    field: "email",
                    title: "Email address",
                    width: 160
                }, {
                    template: "${firstName} ${lastName}",
                    title: "Full name",
                    width: 150
                }, {
                    field: "createdAt",
                    title: "Registered on",
                    template: "#=foodhub.Render.dateFormat(createdAt)#",
                    width: 100
                },
                {
                    template: "<input type='button' class='removes_user' value='REMOVE USER'/>",
                    width: 140
                }
            ]
        }).data('kendoGrid');
    }

};
    
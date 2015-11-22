'use strict';

angular.module('myApp.listView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/listView', {
            templateUrl: 'listView/listView.html',
            controller: 'listViewCtrl'
        });
    }])

    .controller('listViewCtrl', [function() {
        buildTable();
        bindEvents();
        initValidation();
    }]);

function buildTable() {
    $('#license-table').DataTable( {
        "columnDefs": [],
        "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
        "pageLength": 10  // TODO problem with table overgrowing page
    } );
    var table = $('#license-table').DataTable();
    table.clear();
    var jqxhr = $.get( "http://petrofeed-coding-challenge.herokuapp.com/licenses", function( data ) {
            $('#alert-bar').hide();
            var tableRows = [data.size];
            for( var lic in data) {
                var wellLicense = data[lic];

                table.row.add(
                    [
                        wellLicense._id,
                        wellLicense.applicant,
                        wellLicense.wellType,
                        wellLicense.company,
                        wellLicense.latitude,
                        wellLicense.longitude,
                        wellLicense.dateModified,
                        wellLicense.dateIssued,
                        wellLicense.status
                    ])
                    .draw();
            }
        })
        .fail(function() {
            $('.alert.alert-danger').remove();
            $('#alert-bar').show();
            $('#alert-bar').append('<div class="alert alert-danger fade in">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                '<strong>Oops!</strong> Unable to load well licences.</div>');
        });
};

function bindEvents() {
    var table = $('#license-table').DataTable();

    // highlight selected tr - clicking a selected tr deselects
    $('#license-table tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#table-edit-btn').addClass('disabled');
            $('#table-delete-btn').addClass('disabled');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#table-edit-btn').removeClass('disabled');
            $('#table-delete-btn').removeClass('disabled');
        }
    } );

    // delete a row and the license
    $('#table-delete-btn').click( function (e) {
        if( !$('#table-delete-btn').hasClass('disabled') ) {
            var row = table.row('.selected').data();
            var id = row[0];

            $.ajax({
                url: 'http://petrofeed-coding-challenge.herokuapp.com/licenses/' + id,
                type: 'DELETE',
                success: function(result) {
                    table.row('.selected').remove().draw( false );
                    $('#table-edit-btn').addClass('disabled');
                    $('#table-delete-btn').addClass('disabled');
                }
            });
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    } );

    // open modal with data from selected tr
    $('#table-edit-btn').click( function (e) {
        if( $('#table-edit-btn').hasClass('disabled') ) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            $('#edit-modal-accept-btn').show();
            $('#edit-modal-add-btn').hide();

            populateModal();
        }
    } );

    // update license with new information
    $('#edit-modal-accept-btn').click( function (e) {
        $('#modal-form').validate();
        var id = $('#edit-modal-id').val();
        if(!$('#modal-form').valid()) {
            e.preventDefault();
            e.stopPropagation();
            $('label.error').hide();
        } else {
            var stringedData = JSON.stringify(
                {
                    "_id": $('#edit-modal-id').val(),
                    "applicant": $('#edit-modal-applicant').val(),
                    "wellType": $('#edit-modal-well').val(),
                    "company": $('#edit-modal-company').val(),
                    "latitude": $('#edit-modal-latitude').val(),
                    "longitude": $('#edit-modal-longitude').val(),
                    "dateModified": $('#edit-modal-date-mod').val(),
                    "dateIssued": $('#edit-modal-date-issued').val(),
                    "status": $('#edit-modal-status').val()
                });
            // delete old record and add the updated license data
            $.ajax({
                url: 'http://petrofeed-coding-challenge.herokuapp.com/licenses/' + id,
                type: 'DELETE',
                success: function(result) {
                    $('#table-edit-btn').addClass('disabled');
                    $('#table-delete-btn').addClass('disabled');

                    $.ajax({
                        type: "POST",
                        url: 'http://petrofeed-coding-challenge.herokuapp.com/licenses',
                        contentType: "application/json",
                        data: stringedData,
                        success: function(response) {
                            buildTable();
                        }
                    });
                }
            });
        }
    } );

    // open modal with new id and dates filled
    $('#table-add-btn').click( function (e) {
        $('input.error, select.error').removeClass('error');
        $('#edit-modal-accept-btn').hide();
        $('#edit-modal-add-btn').show();
        $('tr.selected').removeClass('selected');
        $('input.modal-field').val('');
        $('select.modal-field').val('');
        setNextId();
        $('#edit-modal-date-issued').val(new Date());
        $('#edit-modal-date-mod').val(new Date());
    } );

    // create new license - validate all fields are filled
    $('#edit-modal-add-btn').click( function (e) {
        $('#modal-form').validate(); // should validate that long +180/-180, lat +90/-90
        if(!$('#modal-form').valid()) {
            e.preventDefault();
            e.stopPropagation();
            $('label.error').hide();
        } else {
            var stringedData = JSON.stringify(
                {
                    "_id": $('#edit-modal-id').val(),
                    "applicant": $('#edit-modal-applicant').val(),
                    "wellType": $('#edit-modal-well').val(),
                    "company": $('#edit-modal-company').val(),
                    "latitude": $('#edit-modal-latitude').val(),
                    "longitude": $('#edit-modal-longitude').val(),
                    "dateModified": $('#edit-modal-date-mod').val(),
                    "dateIssued": $('#edit-modal-date-issued').val(),
                    "status": $('#edit-modal-status').val()
                });
            $.ajax({
                type: "POST",
                url: 'http://petrofeed-coding-challenge.herokuapp.com/licenses',
                contentType: "application/json",
                data: stringedData,
                success: function(response) {
                    buildTable();
                }
            });
        }
    } );

    // don't look at me, I'm a monster - hide ugly validation messages
    $('input, select').blur(function() {
        $('label.error').hide();
    });
};

function initValidation() {
    jQuery.validator.setDefaults({
        success: "valid"
    });
    $( "#modal-form" ).validate({
        rules: {
            'edit-modal-applicant': {
                required: true
            },
            'edit-modal-well': {
                required: true
            },
            'edit-modal-company': {
                required: true
            },
            'edit-modal-latitude': {
                required: true
            },
            'edit-modal-longitude': {
                required: true
            },
            'edit-modal-status': {
                required: true
            }
        },
        error: function(label) {
            $(this).addClass("error");
        }
    });
};

function populateModal() {
    var table = $('#license-table').DataTable();
    var row = table.row('.selected').data();

    $('#edit-modal-id').val(row[0]);
    $('#edit-modal-applicant').val(row[1]);
    $('#edit-modal-well').val(row[2]);
    $('#edit-modal-company').val(row[3]);
    $('#edit-modal-latitude').val(row[4]);
    $('#edit-modal-longitude').val(row[5]);
    $('#edit-modal-date-mod').val(row[6]);
    $('#edit-modal-date-issued').val(row[7]);
    $('#edit-modal-status').val(row[8]);
};

// ASSUMPTION- IDs are hex values assigned by the system
function setNextId() {
    var jqxhr = $.get( "http://petrofeed-coding-challenge.herokuapp.com/licenses", function( data ) {
            $('#alert-bar').hide();
            var mostRecentID = 0;
            for( var lic in data) {
                var licenseId = data[lic]._id;

                if(isNaN(licenseId)) {
                    licenseId = h2d(licenseId);
                }
                if( mostRecentID < licenseId) {
                    mostRecentID = licenseId;
                }
            }

            var hexVal = d2h(mostRecentID + 10000000000000000);
            $('#edit-modal-id').val(hexVal);
        })
        .fail(function() {
            $('.alert.alert-danger').remove();
            $('#alert-bar').show();
            $('#alert-bar').append('<div class="alert alert-danger fade in">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                '<strong>Oops!</strong> Unable to load well licences.</div>');
        });
};


//////////////////////////////////////// helper functions ///////
function d2h(d) {
    var converted = d.toString(16);
    return converted;
}
function h2d(h) {return parseInt(h,16);}
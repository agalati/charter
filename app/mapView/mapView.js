'use strict';

angular.module('myApp.mapView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mapView', {
            templateUrl: 'mapView/mapView.html',
            controller: 'mapViewCtrl'
        });
    }])

    .controller('mapViewCtrl', [function() {
        var map = initialize();
        populateMap(map);
    }]);

function initialize()
{
    // centre our map over Alberta
    var myCenter = new google.maps.LatLng(52.564042,-114.736364);
    var mapProp = {
        center: myCenter,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    return new google.maps.Map(document.getElementById("googleMap"),mapProp);

};

function populateMap(map)
{
    // if we have our map, populate it with all of our license pins
    if(map){
        var jqxhr = $.get( "http://petrofeed-coding-challenge.herokuapp.com/licenses", function( data ) {
                $('#alert-bar').hide();
                var infowindows = [data.size];
                for( var lic in data) {
                    var wellLicense = data[lic];
                    if (wellLicense.latitude && wellLicense.longitude) {
                        var markerLocation = new google.maps.LatLng(wellLicense.latitude, wellLicense.longitude);
                    }

                    var marker = new google.maps.Marker({
                        position: markerLocation,
                    });
                    marker.setMap(map);

                    marker.info = new google.maps.InfoWindow({
                        content:
                        "<b>ID:</b> " + wellLicense._id + "<br/>" +
                        "<b>Applicant:</b> " + wellLicense.applicant + "<br/>" +
                        "<b>Well Type:</b> " + wellLicense.wellType + "<br/>" +
                        "<b>Company:</b> " + wellLicense.company + "<br/>" +
                        "<b>Latitude:</b> " + wellLicense.latitude + "<br/>" +
                        "<b>Longitude:</b> " + wellLicense.longitude + "<br/>" +
                        "<b>Date Modified:</b> " + wellLicense.dateModified + "<br/>" +
                        "<b>Date Issued:</b> " + wellLicense.dateIssued + "<br/>" +
                        "<b>Status:</b> " + wellLicense.status
                    });
                    infowindows[lic] = marker.info;

                    google.maps.event.addListener(marker, 'click', function() {
                        for(var infowindow in infowindows) {
                            // we've saved our list of infowindows so that we keep only one open at a time
                            infowindows[infowindow].close();
                        }
                        var marker_map = this.getMap();
                        this.info.open(marker_map, this);
                    });
                }

            })
            .fail(function() {
                $('.alert.alert-danger').remove();
                $('#alert-bar').show();
                $('#alert-bar').append('<div class="alert alert-danger fade in">' +
                    '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                    '<strong>Oops!</strong> Unable to load well licences.</div>');
            });
    } else {
        $('.alert.alert-danger').remove();
        $('#alert-bar').show();
        $('#alert-bar').append('<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
            '<strong>Oops!</strong> Map could not be loaded.</div>');
    }
};


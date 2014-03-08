console.log('Navigate');

function initializeNavigator(latitude, longitude) {
    if (typeof (window.directionsDisplay) == 'undefined') {
        window.directionsDisplay = new google.maps.DirectionsRenderer();
    }

    if (typeof (window.directionsService) == 'undefined') {
        window.directionsService = new google.maps.DirectionsService();
    }

    var map = new google.maps.Map($('#map-canvas')[0], {
        zoom: 7,
        center: new google.maps.LatLng(latitude, longitude)
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel($('#directions-panel')[0]);
}

function calcRoute(start, end) {
    console.log(start, end);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[$('#mode').val()]
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function reCalcMap(){
    calcRoute(String(window.coordinates.coords.latitude) + ', ' + String(window.coordinates.coords.longitude), String(window.urlVars['latitude']) + ', ' + String(window.urlVars['longitude']));
}

function initNav() {
    window.coordinates = {"timestamp": 0, "coords": {"speed": null, "heading": null, "altitudeAccuracy": null, "accuracy": 140000, "altitude": null, "longitude": 0, "latitude": 0}};
    window.urlVars = getUrlVars();
    if (typeof (window.urlVars['latitude']) != 'undefined') {
        if (typeof (window.urlVars['longitude']) != 'undefined') {
            updateCoordinates(function () {
                var r = window.coordinates = JSON.parse(window.localStorage.getItem('coordinates'));
                if (typeof (r) != 'undefined') {
                    if (typeof (r.coords) != 'undefined') {
                        initializeNavigator(r.coords.latitude, r.coords.longitude);
                        calcRoute(String(r.coords.latitude) + ', ' + String(r.coords.longitude), String(window.urlVars['latitude']) + ', ' + String(window.urlVars['longitude']));
                    } else {
                        console.log(r);
                        alert('Failed to get coordinates');
                    }
                } else {
                    alert('Failed to get coordinates');
                }
            }, function (r) {
                console.log(r);
                alert('Failed to get coordinates');
            });
        } else {
            alert('No longitude');
        }
    } else {
        alert('No latitude')
    }
}

$(document).ready(function () {
    initNav();
});
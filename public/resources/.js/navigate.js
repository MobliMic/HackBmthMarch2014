console.log('Navigate');

function initializeNavigator(latitude, longitude) {
    if (typeof (window.directionsDisplay) == 'undefined') {
        window.directionsDisplay = new google.maps.DirectionsRenderer();
    }

    if (typeof (window.directionsService) == 'undefined') {
        window.directionsService = new google.maps.DirectionsService();
    }

    window.map = new google.maps.Map($('#map-canvas')[0], {
        zoom: 7,
        center: new google.maps.LatLng(latitude, longitude)
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel($('#directions-panel')[0]);
    window.trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
            position: myRoute.steps[i].start_location,
            map: map
        });
        attachInstructionText(marker, myRoute.steps[i].instructions);
        markerArray[i] = marker;
    }
}

function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on,
        // containing the text of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}

function calcRoute(start, end) {
    console.log(start, end);

    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Now, clear the array itself.
    markerArray = [];

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[$('#mode').val()]
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            if(response.routes[0].warnings != ''){
                $('#warning').slideUp(400, function(){
                    $('#warningText').html(response.routes[0].warnings);
                    $('#warning').slideDown();
                });
                response.routes[0].warnings = '';
            } else {
                if($('#warning').css('display') == 'block'){
                    $('#warning').slideUp();
                }
            }
            directionsDisplay.setDirections(response);
            showSteps(response);
        }
    });
}

function reCalcMap(){
    calcRoute(String(window.coordinates.coords.latitude) + ', ' + String(window.coordinates.coords.longitude), String(window.urlVars['latitude']) + ', ' + String(window.urlVars['longitude']));
}

function initNav() {
    window.markerArray = [];
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
/// Main js code file

// Google map object
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

// Washington DC momumnents
var locations = [
  {title: 'Lincoln Memorial', lat: 38.8893, lng: -77.0502, id: 0},
  {title: 'Washington Monument', lat: 38.9072, lng: -77.0369, id: 1},
  {title: 'The White House', lat: 38.8977, lng: -77.0365, id: 2},
  {title: 'Thomas Jefferson Memorial', lat: 38.8814, lng: -77.0365, id: 3},
  {title: 'Smithsonian National Museum of Natural History', lat: 38.8913, lng: -77.0261, id: 4}
];

var Locations = function(data) {
  this.title = ko.observable(data.title);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.id = ko.observable(data.id);
};

function mapsErorr() {
  // Handle a Google Map error
  alert("Google Maps has failed to initialize. Is your internet connection working?");
}

// Google map styling
function initMap() {
  // Constructor makes a new map - only center and zoom are required.
  // Center to Washington DC
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.9072, lng: -77.0369},
    zoom: 11,
    styles: styles,
    mapTypeControl: false
  });

  var largeInfowindow = new google.maps.InfoWindow();

  // We add a DOM event here to show info window if list item clicked
  // var ul, li, a;
  // ul = document.getElementById("myUL");
  // // console.log(ul);
  // li = ul.getElementsByTagName('li');
  // // Loop through all locations array, hiding those that don't match the search query in list and on map
  // // remove locations.length ... replace with 5 for now
  // for (i = 0; i < li.length; i++) {
  //   google.maps.event.addDomListener(li[i], 'click', function() {
  //     //window.alert('Item was clicked!');
  //     //************ largeInfowindow.open(map, markers[i]);
  //   });
  // }

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // Markers
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    // var position = locations[i].location;
    var lat = locations[i].lat;
    var lng = locations[i].lng;
    var position = new google.maps.LatLng(lat, lng);
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      // icon: defaultIcon,
      id: i
    });
    
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    
  }

  showListings();
  
}
  
// This function populates the infowindow when the marker is clicked
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    // infowindow.open(map, marker);
  }
}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}; // showListings END

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
} // markerIcon END

var viewModel = function () {
  
  // for use with the SELF trick below in incrementCounter
  var self = this;
  
  self.placeList = ko.observableArray([]);
  self.query = ko.observable('');

  locations.forEach(function(placeLocation) {
    self.placeList.push(new Locations(placeLocation));
  });

  // everytime query/placeList changes, this gets computed again
  self.filteredPlaces = ko.computed(function() {
    if (!self.query()) {
      return self.placeList();
    } else {
      return self.placeList()
        .filter(place => place.title().toLowerCase().indexOf(self.query().toLowerCase()) > -1);
    }
  });
  
  // self.placeClicked = function(data, event) {
  //   // self.places.remove(place)
  //   alert("Clicked something" + data);
  // };
  
};

ko.applyBindings(new viewModel());

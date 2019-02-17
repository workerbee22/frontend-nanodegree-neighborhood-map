/// Main js code

// Google map object
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered.
// var polygon = null;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

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

  // Washington DC momumnents
  var locations = [
    {title: 'Lincoln Memorial', location: {lat: 38.8893, lng: -77.0502}},
    {title: 'Washington Monument', location: {lat: 38.9072, lng: -77.0369}},
    {title: 'The White House', location: {lat: 38.8977, lng: -77.0365}},
    {title: 'Thomas Jefferson Memorial', location: {lat: 38.8814, lng: -77.0365}},
    {title: 'Smithsonian National Museum of Natural History', location: {lat: 38.8913, lng: -77.0261}}
  ];

  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    
    // For each location array object, create the html and append to the unordered list as a list item <li><a href="#">timeAutocomplete</a></li>
    $("#myUL").append('<li><a href="#">' + locations[i].title + '</a></li>');

  }

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', function() {
    hideMarkers(markers);
  });
}
  
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
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
    infowindow.open(map, marker);
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
} // showListings END

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
} // hideMarkers END

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

// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < places.length; i++) {
    var place = places[i];
    var icon = {
      url: place.icon,
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // Create a marker for each place.
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location,
      id: place.id
    });
    // If a marker is clicked, do a place details search on it in the next function.
    marker.addListener('click', function() {
    getPlacesDetails(this, place);
    });
    placeMarkers.push(marker);
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  }
  map.fitBounds(bounds);
} // createMarkersforPlaces END

var viewModel = {
  
  // initialise the document, initialise the map and get location data for markers
  init: function() {
    $(document).ready(function() {
      console.log( "Neighbourhood Map - Page DOM is ready." );
      viewModel.searchBar();
    });
  },
  
  // Search Bar - create the filter bar and initial list
  searchBar: function () {
    // Declare variables
    var input, filter, ul, li, a, i;
    
    input = document.getElementById('places-search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    
    // Loop through all locations array, hiding those that don't match the search query in list and on map
    // remove locations.length ... replace with 5 for now
    for (i = 0; i < 5; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
  
};

//Main app call
viewModel.init();

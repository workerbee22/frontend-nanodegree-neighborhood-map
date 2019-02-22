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
  {title: 'Lincoln Memorial', location: {lat: 38.8893, lng: -77.0502}, id: 0},
  {title: 'Washington Monument', location: {lat: 38.9072, lng: -77.0369}, id: 1},
  {title: 'The White House', location: {lat: 38.8977, lng: -77.0365}, id: 2},
  {title: 'Thomas Jefferson Memorial', location: {lat: 38.8814, lng: -77.0365}, id: 3},
  {title: 'Smithsonian National Museum of Natural History', location: {lat: 38.8913, lng: -77.0261}, id: 4}
];

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
  var ul, li, a;
  ul = document.getElementById("myUL");
  // console.log(ul);
  li = ul.getElementsByTagName('li');
  // Loop through all locations array, hiding those that don't match the search query in list and on map
  // remove locations.length ... replace with 5 for now
  for (i = 0; i < li.length; i++) {
    google.maps.event.addDomListener(li[i], 'click', function() {
      //window.alert('Item was clicked!');
      //************ largeInfowindow.open(map, markers[i]);
    });
  }

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // Markers
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
      // icon: defaultIcon,
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
    
    // Disable this - construct list using Knockout
    // For each location array object, create the html and append to the unordered list as a list item <li><a href="#">timeAutocomplete</a></li>
    // $("#myUL").append('<li><a href="#">' + locations[i].title + '</a></li>');

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

// Location object
var Location = function(data) {
  // Data created for name from locations array and the title property
  this.name = ko.observable(data.title);
  this.id = ko.observable(data.id);
};

// ViewModel - because it has logic to increase the click count when image clicked
var searchBar = function () {
  
  // Declare variables
    var input, filter, ul, li, a, i;

    input = document.getElementById('places-search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all locations array, hiding those that don't match the search query in list and on map
    // remove locations.length ... replace with 5 for now
    for (i = 0; i < li.length; i++) {
      // a = li[i].getElementsByTagName("a")[0];
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        // Show map marker
        markers[i].setMap(map);
      } else {
        li[i].style.display = "none";
        // Hide map marker
        markers[i].setMap(null);
      }
    }
}

var stuff = function () {
  
  // for use with the SELF trick below in incrementCounter
  var self = this;
  
  // catList ko observable array created, then populated with new Location objects from locations array
  this.locationList = ko.observableArray([]);
  // Using forEach for the locations array. Note: The forEach() method executes a provided function once for each array element.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // Each location object data in locations array, passed to locationitem on the anonymous function
  // that anonymous function then pushes a new location object to the locationList ko observable array
  locations.forEach(function (locationItem) {
    self.locationList.push(new Location(locationItem));
  });
  // console.dir(this.locationList);
  
  // currentLocation set to a Location object. Use just the first location Object in the locations array
  this.currentLocation = ko.observable(new Location(locations[0]));
  
  // this.incrementCounter = function () {
  //   // becuase a ko observable, need to get its value differently by calling it as a function ie. this.clickCount()
  //   // and set its value by passing in the new value ie. this.clickCount( ... )
  //   // SELF trick to keep outter function THIS
  //   self.currentCat().clickCount(self.currentCat().clickCount() + 1);
  // };
  
  this.setCurrentLocation = function (loc) {
    // console.log('***click');
    // console.log(loc);
    // change currentLocation which holds just 1 location object location that was clicked.
    self.currentLocation(loc);
    // Open infowindow of corresponding marker
    //initMap.largeInfowindow.open(map, markers.loc.id);
    
  };
  
};

ko.applyBindings(new stuff());

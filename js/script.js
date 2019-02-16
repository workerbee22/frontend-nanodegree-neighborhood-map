// Location Buddy script
// Script used with index.html for the ARCBS Location Buddy app

// From the index.html Google Maps API callback setting, call initMap in the Global Scope
// Leave initMap up here in the Global Scope rather than inside the viewMap becuase need to constantly refer to the map object

function initMap() {
  // Constructor creates a new map instance with only center and zoom needed
  map = new google.maps.Map(document.getElementById('map'), {
    // Initially center the map on Australia
    center: {lat: -25.274398, lng: 133.775136},
    zoom: 5,
    styles: stylesSilver,
    mapTypeControl: true
  });
}

// Model is local array copy of the Firebase sourced data for locations
var initialLocations =[];

// View of the map and list of locations
var view = {
  renderMap: function() {
    
  },
  renderList: function() {
    
  }
};

// Functions in the viewModel
var viewModel = {

  // initialise the document, initialise the map and get location data for markers
  init: function() {
    $(document).ready(function() {
      console.log( "DOM ready." );
      viewModel.getLocations();
    });
  },
  
  ui: function() {
    var self = this;
    
    this.locationsList = ko.observableArray([]);
  },
    
  // create the filter bar and initial list
  searchBar: function () {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    // Loop through all locations in list hiding those that don't match the search query in list and on map
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  },
    
  // get location data from Firestore and set custom map markers
  getLocations: function() {
    // Initialise Firestore to read all locations data
    firebase.initializeApp({
      apiKey: 'AIzaSyAwlziqCGRjcSkaDeKOt2en48QneMJLPgQ',
      projectId: 'productx-arcbslocbuddy'
    });
    // initialize Cloud Firestore through Firebase
    var db = firebase.firestore();
    console.log('Querying Firestore');
    db.collection("rcbsLocations")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var iconImage;
          console.log(doc.id, " has this data ", doc.data());
          // Categorise the location by its meta data properties and set iconImage for this category
          if (doc.data().category === "rcbs" && doc.data().type[0] === "donor") {iconImage = imageCustomDotLtGreen;}
          if (doc.data().category === "rcbs" && doc.data().type[0] === "processing") {iconImage = imageCustomDotRCBSRed;}
          if (doc.data().category === "rcbs" && doc.data().type[0] === "contact") {iconImage = imageCustomPinSpotlight;}
          if (doc.data().category === "hospital" && doc.data().type[0] === "nicu") {iconImage = imageCustomHospital;}
          if (doc.data().category === "hospital" && doc.data().type[0] === "scn") {iconImage = imageCustomHospitalLite;}
          // Load initialLocations array
          
          // Put a marker for this location on the map
          var marker = new google.maps.Marker({
            position: {lat: doc.data().lat, lng: doc.data().lng},
            map: map,
            title: doc.data().name,
            icon: iconImage
          });
          // Add this location to the List
          // Create the html and append to the unordered list <li><a href="#">Adele</a></li>
          $("#myUL").append('<li><a href="#">' + doc.data().name + '</a></li>');
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
    
};

viewModel.init();

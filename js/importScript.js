// Import script
// Script used with import.html to select CSV data file and import ARCBS location data to Firestore
// 1 - imports raw CSV files of locations in known fixed format for RCBS processing centres, donor centres, distribution centres and other locations
// 2 - Parses/filters and loads locations into Cloud Firestore
// 3 - Geocodes locations and places data into Cloud Firestore
// Locations then read from Cloud Firestore for use by the Location Buddy webpage of RCBS locations.

var viewModel = {

    // initialise the view for getting the file
    init: function() {
      // initialise get file page
      viewGetFile.init();
    },
    
    // pre process raw file data from the file
    processData: function(fileData) {
      // initialise firebase
      firebase.initializeApp({
        apiKey: 'AIzaSyAwlziqCGRjcSkaDeKOt2en48QneMJLPgQ',
        projectId: 'productx-arcbslocbuddy'
      });
      // initialize Cloud Firestore through Firebase
      var firestore = firebase.firestore();
      var docRef = firestore.collection("locations");
      // iterate through the raw file data
      var rowData = [];
      var name = "";
      var street = "";
      var suburb = "";
      var state = "";
      var postcode = "";
      var type = [];
      console.log('Processing data started');
      for (var row = 0; row < fileData.data.length; row++) {
        rowData = fileData.data[row];
        name = rowData[0];
        street = rowData[4];
        suburb = rowData[5];
        state = rowData[6];
        postcode = rowData[7];
        type = [];
        
        // only write to firestore if a valid location with a name, street, suburb, state, postcode AND is not the header row
        if (name != "" && street != "" && suburb != "" && state != "" && postcode != "" && street != "Address") {
          // Set the type as follows, is only ever one of:
          // type processing - if name has the word processing
          // type donor-mobile-unit - if name has DMU in the name then this is the base for a mobile unit
          // type call - if name has national call in the name
          // type donor - otherwise
          // TODO - DMU units not actually another fixed location. Indicates home base for a DMU, so is really a duplicate.
          // console.log(name.toLowerCase());
          if (name.toLowerCase().includes('processing centre')) {
            // console.log('****processing centre found');
            type.push("processing");
          } else {
          if (name.toLowerCase().includes('national contact centre')) {
            // console.log('****contact centre found');
            type.push("contact");
          } else {
          if (name.toLowerCase().includes('dmu')) {
            // console.log('****DMU');
            type.push("donor-mobile-unit");
          } else {
            type.push("donor");
          }}}
          
          // geocode the Address but in a batch, so to avoid OVER_QUERY_LIMIT use the
          // web API as recommended by the Google Maps JS API doco for batch geocoding
          
          
          // Write to firestore all valid locations with processsed data
          // Use the .add method to auto generate the document ids in firestore
          // docRef.add({
          //   name: name,
          //   street: street,
          //   suburb: suburb,
          //   state: state,
          //   postcode: postcode,
          //   type: type
          // })
          // .then(function(docRef) {
          //     // console.log("Document written with ID: ", docRef.id);
          // })
          // .catch(function(error) {
          //     // console.error("Error adding document: ", error);
          // });
        }
      }
      console.log('Processing data finished');
    }

};

var viewGetFile = {
  
  // initialises the import page view by checking document is ready and adds event handler to file picker
  // allows multiple files to be selected then processed one after another
  init: function() {
    var $button = $('#fileButton');
    $(document).ready(function(){
      $button.change(viewGetFile.handleFileSelect);
    });
  },
  
  // handles the view file selection and returns results if no errors
  handleFileSelect: function(evt) {
    var file = evt.target.files[0];
    var $result = $('#result');
    Papa.parse(file, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: function(results, file) {
        console.log("Parsing complete:\n",results,file);
        viewModel.processData(results);
        $result.text("SUCCESS: Results of the import see the browser console.");
      },
      error: function(error, file) {
        console.log("Parsing ERROR:", error, file);
        $result.text("ERROR: Something went wrong see the browser console.");
      }
    });
  },
  
  // output to the page messages as the import and processing produces various results
  // TODO - use this function to output append to screen, rather than console log
  reportMessage: function(message, level) {
    
  }
  
};

viewModel.init();

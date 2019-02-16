// Import script
// Script used with import.html to:
// 1 - select CSV data file and import rcbs location data
// 2 - select CSV data file and import Hospital location data that have NICU and specialty care nursuries
// 3 - Geocodes locations and places data into Cloud Firestore
// Locations then read from Cloud Firestore for use by the Location Buddy webpage of RCBS locations.

// ******* MODEL
// Local databse for the date while being filtered and processed
var model = [];

// ******* VIEW MODEL
var viewModel = {
    // initialise the view for getting the file
    init: function() {
      // initialise get file page
      viewGetFile.init();
    },
    
    // RCBS Loactions File Processor
    // Pre process raw CSV file data from the RCBS file on RCBS Locations
    processDataRcbs: function(fileData) {
      // iterate through the raw file data and filter out invalid data
      // write filtered data as an location object into the model
      var rowData = [];
      var location = {};
      var name = "";
      var street = "";
      var suburb = "";
      var state = "";
      var postcode = "";
      var type = [];
      var rowCount = fileData.data.length;
      var validRowCount = 0;
      console.log('*** STARTED Filtering data for invalid entries');
      console.log('File data appears to have rows numbering: ' + rowCount);
      for (var row = 0; row < rowCount; row++) {
        rowData = fileData.data[row];
        name = rowData[0];
        street = rowData[4];
        suburb = rowData[5];
        state = rowData[6];
        postcode = rowData[7];
        type = [];
        location = {};
        // Filter the data
        // only write to model if a valid location with a name, street, suburb, state, postcode AND is not the header row
        // AND is NOT a DMU (donor mobile unit)
        var isDMU = name.toLowerCase().includes("dmu") || name.toLowerCase().includes("mobile");
        if (name != "" && !isDMU && street != "" && suburb != "" && state != "" && postcode != "" && street != "Address") {
          // Increment valid row count if valid data in row, indicating not a header or other data in files
          validRowCount++;
          // Set the type as follows, is only ever one of:
          // type processing - if name has the word processing
          // type donor-mobile-unit - if name has DMU in the name then this is the base for a mobile unit
          // type call - if name has national call in the name
          // type donor - otherwise
          // DMU units not actually another fixed location. Indicates home base for a DMU and its base location
          if (name.toLowerCase().includes('processing centre')) {
            type.push("processing");
          } else {
          if (name.toLowerCase().includes('national contact centre')) {
            type.push("contact");
          } else {
          if (name.toLowerCase().includes('dmu')) {
            type.push("donor-mobile-unit");
          } else {
            type.push("donor");
          }}}
          // filtering rcbs data so category is rcbs location and not a hospital
          location.category = "rcbs";
          location.name = name;
          location.street = street;
          location.suburb = suburb;
          location.state = state;
          location.postcode = postcode;
          location.type = type;
          location.geoCoded = false;
          // write this location to the model
          model.push(location);
          // viewGetFile.reportMessage('rcbs', 'Added location: ' + location.category + ', ' + location.name, 0);
        }
      }
      console.log(model);
      console.log('Valid rows number: ' + validRowCount);
      viewGetFile.reportMessage('rcbs', "Valid row count of: " + validRowCount, 0);
    },
    
    // RCBS Hospitals File Processor
    // Pre process raw CSV file data from the RCBS file on Hospitals with Neonatal Internsive Care Units(NICUs) and special care nursuries (SCNs)
    processDataHospitals: function(fileData) {
      // iterate through the raw file data and filter out invalid data
      // write filtered data as an location object into the model
      var rowData = [];
      var location = {};
      var nameHospital = "";
      var street = "";
      var suburb = "";
      var state = "";
      var postcode = "";
      var type = [];
      var rowCount = fileData.data.length;
      var validRowCount = 0;
      console.log('*** STARTED Filtering data for invalid entries');
      console.log('File data appears to have rows numbering: ' + rowCount);
      for (var row = 0; row < rowCount; row++) {
        rowData = fileData.data[row];
        nameHospital = rowData[0];
        nicuBeds = rowData[2];
        scnBeds = rowData[3];
        state = rowData[5];
        type = [];
        location = {};
        // Filter the data
        // only write to model if a valid hospital location with no # in the nameHospital
        if (!nameHospital.toLowerCase().includes('#')) {
          // Increment valid row count if valid data in row, indicating not a header or other data in files
          validRowCount++;
          if (nicuBeds > 0) {
            type.push("nicu");
          }
          if (scnBeds > 0) {
            type.push("scn");
          }
          // filtering rcbs data so category is rcbs location and not a hospital
          location.category = "hospital";
          location.name = nameHospital;
          location.state = state;
          location.nicuBeds = nicuBeds;
          location.scnBeds = scnBeds;
          location.type = type;
          location.geoCoded = false;
          // write this location to the model
          model.push(location);
          // viewGetFile.reportMessage('hospitals', 'Added location: ' + location.category + ', ' + location.name, 0);
        }
      }
      console.log(model);
      console.log('Valid rows number: ' + validRowCount);
      viewGetFile.reportMessage('hospitals', "Valid row count of: " + validRowCount, 0);
      
    },
    
    // Google Geo-Coder
    // Geocode the RCBS location addresses and the Hospital locations with NICUs and SCNs to lat/lng values, place IDs etc.
    // Need to geo-code in batches by repeatidly pressing the button due to Google Maps JavaScript geo-coder API limits
    geoCodeData: function() {
      // geocode the Address but in a batch, so to avoid OVER_QUERY_LIMIT noting new stricter limits seem to apply on batch requests
      // global variables in theis geo-coder function
      var delay = 1000;
      var delayIncrement = 2000;
      var batchDelay = 5000;
      var batchSize = 9;
      var batchCount = 0;
      var geocoder = new google.maps.Geocoder();
      var locationIndex = 0;
      function geoCodeAddr(index, addressSearch, postCode, next) {
        // Geo-Code the locations address
        geocoder.geocode({'address': addressSearch, 'region': 'AU', componentRestrictions: {
          country: 'AU'
          // Leave out PostalCode becuase RCBS addresses have them in address and Hsopital names don't.
          // A null Postal Code causes an UNKNOWN_ERROR response.
          // postalCode: postCode
        }}, function(results, status) {
          // if search to geo-code was successful
          if (status == google.maps.GeocoderStatus.OK) {
            // get the lat an dlng from the first results object, assuming first result is correct
            var p = results[0].geometry.location;
            var lat=p.lat();
            var lng=p.lng();
            // Console log success
            console.log('*****SUCCESS GeoCode: ' + addressSearch + ', lat=' + lat + ', lng=' + lng + ', delay=' + delay + ', time= ' + Date.now());
            model[index].googleMapsData = results[0];
            model[index].geoCoded = true;
            model[index].lat = lat;
            model[index].lng = lng;
          // otherwise lets interpret the error
          } else {
            // if we were sending the requests too fast, try this one again and increase the delay
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              locationIndex--;
              delay = delay + delayIncrement;
              console.log('*****OVER_QUERY_LIMIT GeoCode:  ' + addressSearch + ', status=' + status + ', delay=' + delay + ', time= ' + Date.now());
            // otherwise console log the error
            } else {
              console.log('*****FAILED GeoCode:  ' + addressSearch + ', status=' + status + ', delay=' + delay + ', time= ' + Date.now());
            }
          }
          next();
        });
      }
      // Function to call the next Geocode operation when the reply comes back
      // But only if not at end of all locations AND have not geo-coded this location yet AND batch count in under batch size.
      // When click on button again, resets batch size to ZERO so we can run another batch.
      function geoCodeLocation() {
        while (locationIndex < model.length && model[locationIndex].geoCoded == true) {
          locationIndex++;
        }
        if (locationIndex < model.length && model[locationIndex].geoCoded == false && batchCount < batchSize) {
          var address;
          var postcode;
          if (model[locationIndex].category == 'rcbs') {
            address = model[locationIndex].street + ','+ model[locationIndex].suburb + ',' + model[locationIndex].state + ',' + model[locationIndex].postcode;
            postcode = model[locationIndex].postcode;
          } else if (model[locationIndex].category == 'hospital') {
            address = model[locationIndex].name + ',' + model[locationIndex].state;
            postcode = '';
          } else {
            console.log("ERROR - Unexpected Category of Location");
          }
          batchCount++;
          console.log('index=' + locationIndex);
          console.log('index=' + batchCount);
          // Sets a timeout of initially 100ms but may have increased delay if got OVER_QUERY_LIMIT
          // Passes a second parameter of this function. So when first geo-code finished, calls this function again width
          // possibly a longer delay.
          // Appears now to have a restriction of 20 in a batch. So if the 20th one, then add an additional batch delay
          if ((locationIndex + 2) % batchSize == 0) {
            delay = delay + batchDelay;
            console.log("*** NEW BATCH");
          }
          // passing in address in the example uses weird sytax passing the function with parameters as a string, but below is more standard
          console.log(address);
          setTimeout(geoCodeAddr(locationIndex, address, postcode, geoCodeLocation), delay);
          console.log('delay=' + delay);
          locationIndex++;
        } else {
          console.log('*** DONE geocoding locations for this batch');
          viewGetFile.reportMessage('geocode', "DONE geocoding locations for this batch, up to location: " + locationIndex, 0);
        }
      }
      // Main geocoding code
      // Loop through current model objects, grab each location address and geo-code to get lat/lng
      // Then update model with the lat/lng details for markers and grab the Google Place ID if present
      console.log('*** START Geo-coding with number of addresses: ' + model.length);
      // Don't attempt to geo-code if no addresses in the model yet
      if (model.length > 0) {
        geoCodeLocation();
      }
    },
    
    updateFirestoreData: function() {
      console.dir(model);
      // TODO Delete all Firestore data first MANUALLY by deleteding all document from the Firestore Console, to prevent accidental removals
      // initialise firebase
      firebase.initializeApp({
        apiKey: 'AIzaSyAwlziqCGRjcSkaDeKOt2en48QneMJLPgQ',
        projectId: 'productx-arcbslocbuddy'
      });
      // initialize Cloud Firestore through Firebase
      var firestore = firebase.firestore();
      var docRef = firestore.collection("rcbsLocations");
      // Write to firestore all valid locations with processsed data
      // Use the .add method to auto generate the document ids in firestore
      // But be WARNED that each Firestore document has a 1MB limit, so can't store a location object with all of the geocoded data
      for (var i = 0; i < model.length; i++) {
        
        if (model[i].category == 'rcbs') {
          docRef.add({
            name: model[i].name,
            category: model[i].category,
            street: model[i].street,
            suburb: model[i].suburb,
            state: model[i].state,
            postcode: model[i].postcode,
            type: model[i].type,
            formattedAddr: model[i].googleMapsData.formatted_address,
            lat: model[i].lat,
            lng: model[i].lng,
            placeId: model[i].googleMapsData.place_id
          })
          .then(function(docRef) {
              console.log("Document written with ID: " + docRef.id + ' for location: ' + i);
          })
          .catch(function(error) {
              console.error("Error adding document: " + error + ' for location: ' + i);
          });
        }
        if (model[i].category == 'hospital') {
          docRef.add({
            name: model[i].name,
            category: model[i].category,
            state: model[i].state,
            nicuBeds: model[i].nicuBeds,
            scnBeds: model[i].scnBeds,
            type: model[i].type,
            formattedAddr: model[i].googleMapsData.formatted_address,
            lat: model[i].lat,
            lng: model[i].lng,
            placeId: model[i].googleMapsData.place_id
          })
          .then(function(docRef) {
              console.log("Document written with ID: " + docRef.id + ' for location: ' + i);
          })
          .catch(function(error) {
              console.error("Error adding document: " + error + ' for location: ' + i);
          });
        }
        viewGetFile.reportMessage('firestore', "DONE Upoaded data to Cloud Firestore !!!", 1);
      }
      
    }
    
};

// ******* VIEW
// Only one single page view for this importing/filtering data append
var viewGetFile = {
  // initialises the import page view by checking document is ready and adds event handler to file picker
  // allows multiple files to be selected then processed one after another
  init: function() {
    var $rcbsFileButton = $('#fileButtonRCBS');
    var $hospitalsFileButton = $('#fileButtonHospitals');
    var $geocodeBtn = $('#geocodeButton');
    var $firestoreBtn = $('#firestoreButton');
    $(document).ready(function(){
      $rcbsFileButton.change(viewGetFile.handleFileSelectRcbs);
      $hospitalsFileButton.change(viewGetFile.handleFileSelectHospitals);
      $geocodeBtn.click(viewModel.geoCodeData);
      $firestoreBtn.click(viewModel.updateFirestoreData);
    });
  },
  // handles the view file selection and returns results if no errors
  handleFileSelectRcbs: function(evt) {
    var file = evt.target.files[0];
    console.log("*** STARTED - Parsing File with Papa Parse");
    Papa.parse(file, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: function(results, file) {
        console.log("Parsing complete:\n",results,file);
        // if completes then process or filter the rows adat we have read from the file
        viewModel.processDataRcbs(results);
        viewGetFile.reportMessage('rcbs', "SUCCESS: Imported CSV file of RCBS locations", 0);
      },
      error: function(error, file) {
        console.log("Parsing ERROR:", error, file);
        viewGetFile.reportMessage('rcbs', "ERROR: Something went wrong see the browser console.", 0);
      }
    });
  },
  // handles the view file selection and returns results if no errors
  handleFileSelectHospitals: function(evt) {
    var file = evt.target.files[0];
    console.log("*** STARTED - Parsing File with Papa Parse");
    Papa.parse(file, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: function(results, file) {
        console.log("Parsing complete:\n",results,file);
        // if completes then process or filter the rows adat we have read from the file
        viewModel.processDataHospitals(results);
        viewGetFile.reportMessage('hospitals', "SUCCESS: Imported CSV file of Hospital locations", 0);
      },
      error: function(error, file) {
        console.log("Parsing ERROR:", error, file);
        viewGetFile.reportMessage('hospitals', "ERROR: Something went wrong see the browser console.", 0);
      }
    });
  },
  // output to the page messages as the import and processing produces various results
  // TODO - use this function to output append to screen, rather than console log
  reportMessage: function(section, message, level) {
    var $result;
    switch (section) {
      case 'rcbs':
        $result = $('#resultRcbs');
        break;
      case 'hospitals':
        $result = $('#resultHospitals');
        break;
      case 'geocode':
        $result = $('#resultGeoCode');
        break;
      case 'firestore':
        $result = $('#resultFirestore');
        break;
      default:
    }
    
    switch (level) {
      case 1:
        $result.append("<h4>" + message + "</h4>");
        break;
      case 0:
        $result.append("<h5>" + message + "</h5>");
        break;
      default:
        // whatever man
    }
  }
  
};

viewModel.init();

// Styles of icons for markers
var imageBlue = 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png';
var imageRed = 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png';
var imageGreen = 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png';
var imageLtBlue = 'https://maps.gstatic.com/mapfiles/ms2/micons/ltblue-dot.png';
var imageYellow = 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png';
var imagePurple = 'https://maps.gstatic.com/mapfiles/ms2/micons/purple-dot.png';
var imagePink = 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png';
// Custom images below taken from source images URLs of new Google Maps
// Can change HEX color values, scale=1 is small, scale=2 is bigger, scale=3 is biggest
var scale = 1.5;
var imageCustomPinSpotlight = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/spotlight/spotlight_pin_v2_shadow-1-small.png,assets/icons/spotlight/spotlight_pin_v2-1-small.png,assets/icons/spotlight/spotlight_pin_v2_dot-1-small.png,assets/icons/spotlight/spotlight_pin_v2_accent-1-small.png&highlight=ff000000,ea4335,960a0a,ffffff&color=ff000000?scale=' + scale;
var imageCustomAirport = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/airport_pinlet-1-small.png&highlight=ff000000,10bdff,ffffff&color=ff000000?scale=' + scale;
var imageCustomHospital = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/hospital_H_pinlet-1-small.png&highlight=ff000000,f88181,ffffff&color=ff000000?scale=' + scale;
var imageCustomHospitalLite = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/hospital_H_pinlet-1-small.png&highlight=ff000000,F5AFAF,ffffff&color=ff000000?scale=' + scale;
var imageCustomDotLtGreen = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/dot_pinlet-1-small.png&highlight=ff000000,4db546,ffffff&color=ff000000?scale=' + scale;
var imageCustomDotRCBSRed = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/dot_pinlet-1-small.png&highlight=ff000000,E42313,ffffff&color=ff000000?scale=' + scale;
var imageCustomStar = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/constellation_star_pinlet-1-small.png&highlight=ff000000,ffffff,fbc02d,ffffff&color=ff000000?scale=' + scale;
var imageCustomHeart = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/heart_pinlet-1-small.png&highlight=ff000000,ffffff,fa507d,ffffff&color=ff000000?scale=' + scale;
var imageCustomFlag = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/nickname_pinlet-1-small.png&highlight=ff000000,ffffff,4285f4,ffffff&color=ff000000?scale=' + scale;
var imageCustomHome = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,4285f4,ffffff&color=ff000000?scale=' + scale;

// Styles for the map
var midnightCommander =
[
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 13
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#144b53"
          },
          {
              "lightness": 14
          },
          {
              "weight": 1.4
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "color": "#08304b"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#0c4152"
          },
          {
              "lightness": 5
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0b434f"
          },
          {
              "lightness": 25
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0b3d51"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
          {
              "color": "#146474"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#021019"
          }
      ]
  }
];
var stylesSilver =
[
{
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#f5f5f5"
    }
  ]
},
{
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#f5f5f5"
    }
  ]
},
{
  "featureType": "administrative.land_parcel",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#bdbdbd"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#eeeeee"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#e5e5e5"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#9e9e9e"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#ffffff"
    }
  ]
},
{
  "featureType": "road.arterial",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#dadada"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "featureType": "road.local",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#9e9e9e"
    }
  ]
},
{
  "featureType": "transit.line",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#e5e5e5"
    }
  ]
},
{
  "featureType": "transit.station",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#eeeeee"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#c9c9c9"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#9e9e9e"
    }
  ]
}
];

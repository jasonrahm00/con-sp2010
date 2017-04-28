var clinicData = [
  {
    name: 'Anschutz Campus Health Center',
    baseContent: '<a href="https://goo.gl/maps/2tJeYvNkWoQ2" target="_blank">12348 E. Montview Blvd. | 2nd Floor<br/>Aurora, CO 80045</a><br/>Phone: 303-724-6242<br/><a href="/academics/colleges/nursing/clinical-practice-community/PatientServices/CHC/Pages/default.aspx">Visit Clinic Page</a>',
    services: '<ul><li>Behavioral and Counseling Services</li><li>Flu Shots</li>  <li>Physical and General Services</li></ul>',
    hours: '<span>7am - 7pm (Weekdays)<br/>9am - 1pm (Sat)</span>',
    lat: 39.7470331,
    long: -104.8438491,
    latLong: ''
  },
  {
    name: 'Boulder Health Center',
    baseContent: '<a href="https://goo.gl/maps/cZvaqSVZf6v" target="_blank">5495 Arapahoe Ave<br/>Boulder, CO 80303</a><br/>Phone: 720-494-3128<br/><a href="/academics/colleges/nursing/clinical-practice-community/PatientServices/Pages/Center-for-Midwifery.aspx">Visit&#160;Clinic Page</a>',
    services: '<ul><li>Annual Gynecologic Exams</li><li>Breastfeeding Consultation</li><li>Family Planning</li><li>Gynecologic Care</li><li>Labor and Birth</li><li>Labor Support</li><li>Nitrous Oxide</li><li>Preconception Counseling</li><li>Prenatal Care</li><li>Postpartum Care</li><li>Vaginal Birth after Cesarean Section</li><li>Water Birth</li></ul>',
    hours: '<span>8am - 5pm (Mon &amp; Thur)</span>',
    lat: 40.0150815,
    long: -105.226161,
    latLong: ''
  }
]

/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Initial Variable Declarations ***************************/
  
  var geocoder, infoWindow, map, miles, mapBounds, mapDistanceMatrix, matrixDestinations, searchLat, searchLatLong, searchLong, searchRadius, searchResults, zip,
      allLatLongs = [],
      errorCodes = [
        "Enter a valid U.S. Zip Code",
        "Select search radius",
        "Geolocation not supported by browser"
      ];
      //clinicData = [],
      //clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr')),
  
  //Since SharePoint 2010 sucks and reloads the page whenever a button is clicked and strips out any attributes, extra crap is needed to make the search function work
    //A click event could be called on another element, but a button is best for accessibility purposes
  $('#locationFilter button').attr('type', 'button');
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/
    
//  function getData(tableRow) {
//    return {
//      name: $(tableRow).find('td.ms-vb2:first-child')[0].textContent,
//      baseContent: $(tableRow).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
//      services: $(tableRow).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
//      hours: $(tableRow).find('td.ms-vb2:nth-child(4)')[0].innerHTML,
//      lat: $(tableRow).find('td.ms-vb2:nth-child(5)')[0].textContent,
//      long: $(tableRow).find('td.ms-vb2:nth-child(6)')[0].textContent,
//      latLong: ''
//    }
//  }
//  
//  //Take location info from table, create object for each location and push to data array
//  $.each(clinics, function(index, value) {
//    clinicData.push(getData(value));
//  });
  
  
  //Creates clinic cards and adds them to the page, expects an object array as input
  function showDriveMiles(x) {    
    return x.driveMiles ? '<div class="drive-miles"><p>Approximate Distance: ' + x.driveMiles + ' Miles</p></div>' : '';
  }
  
  function createClinicCards(x) {
    $.each(x, function(index, value) {
      $('#clinicLocations').append('<section class="clinic-card"><h2>' + value.name + '</h2><section class="location"><h3>Location</h3>' + value.baseContent + '</section><section class="services"><h3>Services</h3>' + value.services + '</section><section class="hours"><h3>Hours</h3>' + value.hours + '</section>' + showDriveMiles(value) + '</section>');
    });
  }

  
  
  /*************************** Re-Add Location Info to Page ***************************/
  
  //Remove extraneous nested table code that SharePoint creates so there is a clean slate to manipulate the page
  function cleanContainer() {
    $('#clinicLocations').html('');
  }
  
  cleanContainer();
  
  //Create individual <sections> for each location and append them to the now clean container
  createClinicCards(clinicData);  
  
  
  
  /**************************************************************************
                          Load gMap and Markers
  **************************************************************************/
  
  function initMap(clinics) {
    
    allLatLongs = [];
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      zoom: 8,
      center: {lat: 39.7392, lng: -104.9903}//The map is initially centered on the geographical center Denver
    });
    
    var startIcon = "stick-figure.png"
    searchLatLong ? (setMarkers(map, ({name: "You Are Here", baseContent: ""}), startIcon, searchLatLong), allLatLongs.push(searchLatLong)) : '';
    
    //Iterate over each object in clinicData
    $.each(clinics, function(index, value) {
      value.latLong = new google.maps.LatLng(value.lat, value.long);
      
      //Create marker at each location
      setMarkers(map, value, '', value.latLong);
      
      //Add location LatLng to array for use in bounding method
      allLatLongs.push(value.latLong);
    });
    
    //Change bounds of map and recenter so all markers are visible using gmaps api fitBounds method
    mapBounds = new google.maps.LatLngBounds();
    allLatLongs.forEach(function(latLng) {
      mapBounds.extend(latLng);
    });
    
    map.setCenter(mapBounds.getCenter());
    map.fitBounds(mapBounds);

  }

  //Create and place map markers and content
  function setMarkers(map, location, mapIcon, currentLatLong) {
    var marker,
        markerContent = '<div class="markerInfo"><strong>' + location.name + '</strong><br>' + location.baseContent + '</div>',
        markerOptions = {
          position: currentLatLong,
          map: map,
          icon: mapIcon
        };
    
    marker = new google.maps.Marker(markerOptions);
    
    //Add click event to markers so content is displayed
    google.maps.event.addListener(marker, 'click', function() {
      if(infoWindow !== void 0) {
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(markerContent);
      infoWindow.open(map, marker);
    });

  }
 
  initMap(clinicData);

  
  
  /**************************************************************************
                          Location Filtering
  **************************************************************************/

  //Reset search values when a new search is initiated
  function resetValues() {
    filterResults = [];
    matrixDestinations = [];
    searchLat = '';
    searchLatLong = '';
    searchLong = '';
    zip = '';
  }
  
  function setSearchRadius() {
    return Number($('#searchRadius').val());
  }


  
  /************************** Search by Zip Code **************************/

  //Validate Zip Code using Regex code
  function validateZip(x) {
    var validZip = false;
    //Regex validation test found on http://stackoverflow.com/questions/160550/zip-code-us-postal-code-validation
    validZip = /^\b\d{5}(-\d{4})?\b$/.test(x);
    return validZip;
  }

  $('#zipSearch').click(function() {
    filterByZip();
  });
  
  function filterByZip() {
    resetValues();
    searchRadius = setSearchRadius();
    zip = $("#zipCode").val();
    
    if(!validateZip(zip)) {
      $('#errorMessage').html(errorCodes[0]);
    } else if(!searchRadius) {
      $('#errorMessage').html(errorCodes[1]);
    } else {
      $('#errorMessage').html('');
      cleanContainer();
      filterClinics(zip);
    }
  }
  
  
  
  /************************** Search by Browser Geo Location **************************/
  
  function showPosition(position) {
    searchLat = position.coords.latitude;
    searchLong = position.coords.longitude;
  }
  
  $('#geoSearch button').click(function() {
    resetValues();
    searchRadius = setSearchRadius();
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      $('#errorMessage').html(errorCodes[2]);
    }
  });
  
  
  
  /************************** Dependant Search Functions **************************/
  
  function checkDistance() {

    //Promise object created to handle asynchornous calls to gmaps distance matrix service
    return new Promise(function(resolve, reject) {
      
      //getDistanceMatrix checks distance between origin and destination
      mapDistanceMatrix.getDistanceMatrix(
        {
          origins: [searchLatLong],
          destinations: matrixDestinations,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL, //Convert distance units to miles
          avoidHighways: false,
          avoidTolls: false
        }, callback
      );

      function callback(response, status) {
        if(status === "OK") {
          resolve(response);
        } else {
          console.log("Error: " + status);
          reject(err);
        }
      }
      
    });

  }
  
  //Displays results of filter
  function displayResults() {
    if(filterResults.length === 0) {
      //If there are no clinics within given parameters of start location and search radius, message displayed on page
      $('#clinicLocations').html('<p>No Results</p>');
    } else {
      
      //Sort results so the closest displays first
      filterResults.sort(function(a,b) {
        return (a.driveMiles - b.driveMiles);
      });
      
      //Re-Add clinic cards to page and include drive distance from start to destination
      createClinicCards(filterResults);
      
      //Reinitiate the map to include only the filter results and the searchLocation
      initMap(filterResults);
    }
  }
    
  function filterClinics(startLocation) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': startLocation, 'componentRestrictions':{'country': 'US'}}, function(results, status) {
      if(status !== google.maps.GeocoderStatus.OK) {
        console.log(status);
      } else {
        if(results[0].formatted_address === "United States") {
          errorMessage.innerHTML = errorCodes[0];
        } else {

          mapDistanceMatrix = new google.maps.DistanceMatrixService();
          
          //Push clinic latLong into separate array for use in checkDistance function
          $.each(clinicData, function(index, value) {
            value.driveMiles = null;
            matrixDestinations.push(value.latLong);
          });
          
          //Set latitude and longitude of search zip
          searchLatLong = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          
          //Call checkDistanhce function which returns a promise containing array of distances from start to all destinations
          checkDistance().then(function(data) {
            
            //Loop through clinicData, using the clinic index to check drive distance returned by the Promise
            $.each(clinicData, function(index, value) {
              //Promise returns drive distance in meteres, which needs to be converted to miles to compare against searchRadius 
              miles = Math.round(data.rows[0].elements[index].distance.value * 0.000621371);
              
              //If the distance to the clinic is within the search radius, the clinic is pushed to the filterResults array
              miles <= searchRadius ? (value.driveMiles = miles, filterResults.push(value)) : '';
            });
            
            //Display results is called to re-paint the content and map to show only results of the search
            displayResults();
          })
          .catch(function(err) {
            console.error(err);
          });
        }
      }
    });
  }



  /**************************************************************************
                  Unhide components when page is loaded
  **************************************************************************/
    
  $('#loadingMessage').remove();
  $('#clinics').removeClass('hidden');
  
});
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
  
  var clinicPromises, filterPromises, geocoder, infoWindow, map, mapBounds, mapDistanceMatrix, searchLatLong, searchRadius, searchResults, zip,
      allLatLongs = [];
      //clinicData = [],
      //clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr')),
  
  
  
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
  function createClinicCards(x) {
    $.each(x, function(index, value) {
      $('#clinicLocations').append('<section class="clinic-card"><h2>' + value.name + '</h2><section class="location"><h3>Location</h3>' + value.baseContent + '</section><section class="services"><h3>Services</h3>' + value.services + '</section><section class="hours"><h3>Hours</h3>' + value.hours + '</section></section>');
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
  
  function initMap() {
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      zoom: 8,
      center: {lat: 39.7392, lng: -104.9903}//The map is initially centered on the geographical center Denver
    });
    
    //Iterate over each object in clinicData
    $.each(clinicData, function(index, value) {
      value.latLong = new google.maps.LatLng(value.lat, value.long);
      
      //Create marker at each location
      setMarkers(map, value, value.latLong);
      
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
  function setMarkers(map, location, currentLatLong) {
    var marker,
        markerContent = '<div class="markerInfo"><strong>' + location.name + '</strong><br>' + location.baseContent + '</div>',
        markerOptions = {
          position: currentLatLong,
          map: map
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
 
  initMap();

  
  
  /**************************************************************************
                          Location Filtering
  **************************************************************************/
  
  var geocoder, errorCodes = [
    "Please enter a valid U.S. Zip Code",
    "<span style='color: red;'>Sorry, there are no distributor locations within your search radius.</span>"
  ];
  
  //Validate Zip Code using Regex code
  function validateZip(x) {
    var validZip = false;
    //Regex validation test found on http://stackoverflow.com/questions/160550/zip-code-us-postal-code-validation
    validZip = /^\b\d{5}(-\d{4})?\b$/.test(x);
    return validZip;
  }
  
  
  
  /************************** Search by Zip Code **************************/

  //Since SharePoint 2010 sucks and reloads the page whenever a button is clicked and strips out any attributes, extra crap is needed to make the search function work
    //A click event could be called on another element, but a button is best for accessibility purposes
  $('#locationFilter button').attr('type', 'button');
  
  $('#zipSearch').click(function() {
    filterByZip();
  });
  
  function filterByZip() {
    resetValues();
    searchRadius = Number($('#searchRadius').val());
    zip = $("#zipCode").val();
    
    if(!validateZip(zip)) {
      $('#errorMessage').html(errorCodes[0]);
    } else {
      $('#errorMessage').html('');
      filterClinics(zip);
    }
  }
  
  
  
  /************************** Dependant Search Functions **************************/
  
  function resetValues() {
    searchLatLong = '';
    zip = '';
  }
  
  function checkDistance(clinic) {

    clinic.driveMiles = null;
    
    //Promise object created to handle asynchornous calls to gmaps distance matrix service
    return new Promise(function(resolve, reject) {
      
      //getDistanceMatrix checks distance between origin and destination
      mapDistanceMatrix.getDistanceMatrix(
        {
          origins: [searchLatLong],
          destinations: [clinic.latLong],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL, //Convert distance units to miles
          avoidHighways: false,
          avoidTolls: false
        }, callback
      );
      
      //
      function callback(response, status) {
        if(status === "OK") {
          results = response.rows[0].elements[0];
          var miles = Math.round(results.distance.value * 0.000621371);
          miles <= searchRadius ? clinic.driveMiles = miles : '';
          resolve(clinic);
        } else {
          console.log("Error: " + status);
          reject(err);
        }
      }
      
    });
      
    
//      
//    //Sort results so the closest is displayed first
//    filtered.sort(function(a,b) {
//      return (a.driveMiles - b.driveMiles);
//    });
//
//    return filterResults;
  }
  
  //Displays results of filter
  function displayResults() {
    if(filterResults.length === 0) {
      //If there are no clinics within given parameters of start location and search radius, message displayed on page
      $('#clinicLocations').html('<p>No Results</p>');
    } else {
      //If there are clinics in the given search radius
        //Matching clinic cards are added to page (ordered with closest first)
        //Map is reinitialized to show start location and nearby clinics only
      cleanContainer();
      createClinicCards(filterResults);      
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
          
          //Reset values when filter function is called
          clinicPromises = [];
          filterResults = [];
          mapDistanceMatrix = new google.maps.DistanceMatrixService();
          
          //Set latitude and longitude of search zip
          searchLatLong = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          
          //For each clinic, call checkDistance function which will return an array of promises for the clinics
            //The promise data includes drive miles to nearest clinic from given start zip or location (if available)
          $.each(clinicData, function(index, value) {
            clinicPromises.push(checkDistance(value));
          });
          
          //Once all of the calls to the gmaps API are complete and the promises are returned, the data is pushed into filterResults array for additional use
          Promise.all(clinicPromises).then(function(clinic) {
            
            $.each(clinic, function(index, value) {
              if(value.driveMiles) {
                filterResults.push(value);
              }
            });
            
            displayResults();
            
          }).catch(function(err) {
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
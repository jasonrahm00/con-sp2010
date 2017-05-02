
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
];

/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Initial Variable Declarations ***************************/
  
  var cityState, geocoder, infoWindow, map, miles, mapBounds, mapDistanceMatrix, matrixDestinations, oldStart, searchLat, searchLatLong, searchLong, searchRadius, searchResults,
      allLatLongs = [],
      autoExpandRadius = false,
      errorCodes = [
        "Enter a City or Zip Code"
      ],
      searchCount = 0,
      singleMapPoint = false,
      startLocation = '';
      //clinicData = [],
      //clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr'));
  
  //Since SharePoint 2010 sucks and reloads the page whenever a button is clicked and strips out any attributes, extra crap is needed to make the search function work
    //A click event could be called on another element, but a button is best for accessibility purposes
  $('#locationFilter button').attr('type', 'button');
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/

  /*
  function getData(tableRow) {
    return {
      name: $(tableRow).find('td.ms-vb2:first-child')[0].textContent,
      baseContent: $(tableRow).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
      services: $(tableRow).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
      hours: $(tableRow).find('td.ms-vb2:nth-child(4)')[0].innerHTML,
      lat: $(tableRow).find('td.ms-vb2:nth-child(5)')[0].textContent,
      long: $(tableRow).find('td.ms-vb2:nth-child(6)')[0].textContent,
      latLong: '',
      driveMiles: null
    }
  }

  //Take location info from table, create object for each location and push to data array
  $.each(clinics, function(index, value) {
    clinicData.push(getData(value));
  });
*/
  
  
  //Creates clinic cards and adds them to the page, expects an object array as input
  function showDriveMiles(clinic) {
    if(clinic.driveMiles === null) {
      return '';
    } else {
      if(!autoExpandRadius) {
        return clinic.driveMiles ? '<div class="drive-miles"><p>Approximate Distance: ' + clinic.driveMiles + ' Miles</p></div>' : '';
      } else {
        return clinic.driveMiles ? '<div class="drive-miles"><p>Approximate Distance: ' + clinic.driveMiles + ' Miles</p><p><em>No clinics were found within your search parameters. The closest is listed above.</em></p></div>' : '';
      }
    }    
  }
  
  function createClinicCards(clinics) {
    $.each(clinics, function(index, value) {
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
  
  function initMap(mapData) {
    
    allLatLongs = [];
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      zoom: 8,
      center: new google.maps.LatLng(39.7392, -104.9903) //The default center is the geographical center Denver
    });
    
    geocoder = new google.maps.Geocoder();
    mapDistanceMatrix = new google.maps.DistanceMatrixService();
    mapBounds = new google.maps.LatLngBounds();
    
    //Add Start Location marker to page at the search lat long
    var startIcon = "/academics/colleges/nursing/test/Documents/Styles_Scripts/clinic-locator/stick-figure.png"
    searchLatLong ? (setMarkers(map, ({name: "You Are Here", baseContent: ""}), startIcon, searchLatLong), allLatLongs.push(searchLatLong)) : '';
    
    //Iterate over each object in clinicData
    $.each(mapData, function(index, value) {
      value.latLong = new google.maps.LatLng(value.lat, value.long);
      
      //Create marker at each location
      setMarkers(map, value, '', value.latLong);
      
      //Add location LatLng to array for use in bounding method
      allLatLongs.push(value.latLong);
    });
    
    //Change bounds of map and recenter so all markers are visible using gmaps api fitBounds method
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


  
  /************************** Filter Search Function **************************/

  function initiateSearch() {
    oldStart = startLocation;
    startLocation = $('#searchInput').val();
    if(startLocation === '') {
      $('#errorMessage').html(errorCodes[0]);
    } else if(oldStart === startLocation && searchRadius === setSearchRadius()) {
      $('#errorMessage').html('');
      return
    } else {
      $('#errorMessage').html('');
      resetValues();
      searchRadius = setSearchRadius();
      geoCodeFilter(startLocation);
      searchCount++;
    }
  }
  
  $('#filterSearch').click(function() {
    initiateSearch();
  });
  
  $('#searchInput').keypress(function(e) {
    if(e.which === 13) {
      e.preventDefault();
      initiateSearch();
    }
  });

  //Reset filter button event handler resets data on page
  $('#resetFilter').click(function() {
    //Initial if/else test determines whether a search has been run based on the driveMiles property (if not, nothing happens)
    if(clinicData[0].driveMiles === null) {
      return
    } else if(searchCount === 0){
      return 
    } else {
      
      //Reset everything to default initial values
      $.each(clinicData, function(index, value) {
        value.driveMiles = null;
      });
      clinicData.sort(function(a,b) {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });
      searchCount = 0;
      resetValues();
      oldStart = undefined;
      startLocation = '';
      autoExpandRadius = false;
      cleanContainer();
      $('#errorMessage').html('');
      $('#searchInput').val('');
      $('#searchRadius').val('5');

      //Repaint the page
      createClinicCards(clinicData);
      initMap(clinicData);
    }    
  })
  
  /************************** Search by Browser Geo Location **************************/
  //Not available on SharePoint 2010 site
    //Site must be served over secure connection (https) for geolocation api to work
  /*
  function showPosition(position) {
    searchLat = position.coords.latitude;
    searchLong = position.coords.longitude;
    searchLatLong = new google.maps.LatLng(searchLat, searchLong);
    filterClinics();
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
  */
  
  
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
          avoidHighways: true,
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
    
    //Sort results so the closest is listed first in object array
    clinicData.sort(function(a,b) {
      return (a.driveMiles - b.driveMiles);
    });
    
    //Check to see if each location is within the search radius
      //Push to filterResults array if it is
    $.each(clinicData, function(index, value) {
      if(value.driveMiles <= searchRadius) {
        filterResults.push(value);
      }
    });
    
    if(filterResults.length === 0) {
      //If there are no clinics within given parameters of start location and search radius
        //The closest clinic is added to the page and map along with messaging saying as much
      
      autoExpandRadius = true;
      
      //Display single clinic on page, the closest one to the entered parameters
        //Since clinic data is sorted by distance, the first in the array is the closest
      createClinicCards([clinicData[0]]);      
      initMap([clinicData[0]]);

    } else {

      autoExpandRadius = false;
      //Re-Add clinic cards to page and include drive distance from start to destination
      createClinicCards(filterResults);
      
      //Reinitiate the map to include only the filter results and searchLocation
      initMap(filterResults);
    }
  }
  
  //Get geo coordinates of the search parameter
    //The geoCode service is restricted to search only within the United States
  function geoCodeFilter(searchStart) {
    geocoder.geocode({'address': searchStart, 'componentRestrictions':{'country': 'US'}}, function(results, status) {
      if(status !== google.maps.GeocoderStatus.OK) {
        console.error(status);
      } else if (results[0].address_components.length == 1){
        $('#errorMessage').html(errorCodes[0]);
        searchCount++;
      } else {
        
        //Set latitude and longitude of search zip
        searchLat = results[0].geometry.location.lat();
        searchLong = results[0].geometry.location.lng();
        searchLatLong = new google.maps.LatLng(searchLat, searchLong);
        
        filterClinics();
      }
    });
  }

  function filterClinics() {
    cleanContainer();

    //Push clinic latLong into separate array for use in checkDistance function
    $.each(clinicData, function(index, value) {
      value.driveMiles = null;
      matrixDestinations.push(value.latLong);
    });

    //Call checkDistanhce function which returns a promise containing array of distances from start to all destinations
    checkDistance().then(function(data) {

      //Loop through clinicData, using the clinic index to check drive distance returned by the Promise
      $.each(clinicData, function(index, value) {
        //Promise returns drive distance in meters, which needs to be converted to miles to compare against searchRadius 
        miles = Math.round(data.rows[0].elements[index].distance.value * 0.000621371);

        //Drive miles property changed on each clinic
        value.driveMiles = miles;
      });

      //Display results is called to re-paint the content and map to show only results of the search
      displayResults();
    })
    .catch(function(err) {
      console.error(err);
    });
  }



  /**************************************************************************
                  Unhide components when page is loaded
  **************************************************************************/
    
  $('#loadingMessage').remove();
  $('#clinics').removeClass('hidden');
  
});
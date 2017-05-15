/*
//Test Data for local development
const clinics = [
  {
    name: 'Anschutz Campus Health Center',
    address: '12348 E. Montview Blvd. | 2nd Floor',
    cityStateZip: 'Aurora, CO 80045',
    phone: '303-724-6242',
    pageUrl: '/academics/colleges/nursing/clinical-practice-community/PatientServices/CHC/Pages/default.aspx',
    mapUrl: 'https://goo.gl/maps/2tJeYvNkWoQ2',
    services: '<ul><li>Behavioral and Counseling Services</li><li>Flu Shots</li><li>Physical and General Services</li></ul>',
    hours: '<ul><li>7am - 7pm (Weekdays)</li><li>9am - 1pm (Sat)</li></ul>',
    lat: 39.7470331,
    long: -104.8438491,
    latLong: ''
  },
  {
    name: 'Boulder Health Center',
    address: '5495 Arapahoe Ave',
    cityStateZip: 'Boulder, CO 80303',
    phone: '720-494-3128',
    pageUrl: '/academics/colleges/nursing/clinical-practice-community/PatientServices/Pages/Center-for-Midwifery.aspx',
    mapUrl: 'https://goo.gl/maps/cZvaqSVZf6v',
    services: '<ul><li>Annual Gynecologic Exams</li><li>Breastfeeding Consultation</li><li>Family Planning</li><li>Gynecologic Care</li><li>Labor and Birth</li><li>Labor Support</li><li>Nitrous Oxide</li><li>Preconception Counseling</li><li>Prenatal Care</li><li>Postpartum Care</li><li>Vaginal Birth after Cesarean Section</li><li>Water Birth</li></ul>',
    hours: '<ul><li>8am - 5pm (Mon &amp; Thur)</li></ul>',
    lat: 40.0150815,
    long: -105.226161,
    latLong: ''
  },
  {
    name: 'Belleview Point Clinic',
    address: '5001 S. Parker Rd. | Suite 215',
    cityStateZip: 'Aurora, CO 80015',
    phone: '303-315-6200',
    pageUrl: '#',
    mapUrl: 'https://goo.gl/maps/DwoP1WDhDCx',
    services: '',
    hours: '',
    lat: 39.6252013,
    long: -104.8228108,
    latLong: ''
  },
  {
    name: 'Lowry Clinic',
    address: '8111 East Lowry Blvd | Suite 120',
    cityStateZip: 'Denver, CO 80230',
    phone: '720-848-1700',
    pageUrl: '#',
    mapUrl: 'https://goo.gl/maps/HvoHh9VQwvP2',
    services: '',
    hours: '',
    lat: 39.7187081,
    long: -104.893519,
    latLong: ''
  },
  {
    name: 'Sheridan Community Clinic',
    address: '3525 West Oxford Ave. | Unit G3',
    cityStateZip: 'Denver, CO 80236',
    phone: '303-315-6150',
    pageUrl: '#',
    mapUrl: 'https://goo.gl/maps/abmfwEYtD8B2',
    services: '',
    hours: '',
    lat: 39.642831,
    long: -105.033712,
    latLong: ''
  }
];
*/


/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Initial Variable Declarations ***************************/
  
  var cityState, geocoder, infoWindow, map, mapBounds, mapDistanceMatrix, matrixDestinations, searchLat, searchLatLong, searchLong,
      autoExpandRadius = false,
      dataLoaded = false,
      dataLoadError = false,
      searchCount = 0,
      singleMapPoint = false,
      clinicData = [],
      errorCodes = [
      "Enter a city or zip code",
      "Enter Colorado city or zip code",
      "No change in results",
      "Enter new parameters"
      ],
      minSpinTimer = 1000,
      resultCount = 0,
      searchRadius = 5,
      startLocation = '';
  
  var clinics = $('table[summary="clinic-locations-2 "] tr').not($('table[summary="clinic-locations-2 "] tr.ms-viewheadertr.ms-vhltr'));
  
  //Since SharePoint 2010 sucks and reloads the page whenever a button is clicked and strips out any attributes, extra crap is needed to make the search function work
    //A click event could be called on another element, but a button is best for accessibility purposes
  $('#locationFilter button').attr('type', 'button');
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/
/*
  //Used to load test data
  function getData(clinic) {
    return {
      name: clinic.name,
      address: clinic.address,
      cityStateZip: clinic.cityStateZip,
      phone: clinic.phone,
      pageUrl: clinic.pageUrl,
      services: clinic.services,
      hours: clinic.hours,
      mapUrl: clinic.mapUrl,
      lat: clinic.lat,
      long: clinic.long,
      latLong: '',
      driveMiles: null
    }
  }
*/
  //Function to be called whenever the array needs to be sorted alphabetically
    //Takes the array variable and sort property key as inputs
  function alphaClinics() {
    clinicData.sort(function(a,b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  }
  
  function displayCount(x) {
    $('#resultCount').html('Results: ' + x);
  }

  //Returns an object with data loaded from the table cells
  function getData(tableRow) {
  
    return {
      name: $(tableRow).find('td.ms-vb2:first-child')[0].textContent,
      address: $(tableRow).find('td.ms-vb2:nth-child(2)')[0].textContent,
      cityStateZip: $(tableRow).find('td.ms-vb2:nth-child(3)')[0].textContent,
      phone: $(tableRow).find('td.ms-vb2:nth-child(4)')[0].textContent,
      pageUrl: $(tableRow).find('td.ms-vb2:nth-child(5)')[0].textContent,
      services: $(tableRow).find('td.ms-vb2:nth-child(6)')[0].innerHTML.replace(/\u200B/g,''),
      hours: $(tableRow).find('td.ms-vb2:nth-child(7)')[0].innerHTML.replace(/\u200B/g,''),
      mapUrl: $(tableRow).find('td.ms-vb2:nth-child(8)')[0].textContent,
      lat: $(tableRow).find('td.ms-vb2:nth-child(9)')[0].textContent,
      long: $(tableRow).find('td.ms-vb2:nth-child(10)')[0].textContent,
      latLong: '',
      driveMiles: null
    }
    
  }

  //Perform try/catch test to make sure data loads properly, if it doesn't the "Clinics Loading" message will remain and the page will stop loading
  try {
    getData(clinics[0]);
  }
  catch(err) {
    dataLoadError = true;
    console.log(err);
  }

  if(!dataLoadError) {
    $.each(clinics, function(index, value) {
      clinicData.push(getData(value));
    });
    dataLoaded = true;
  }  
  
  //Take location info from table, create object for each location and push to data array
  function showDriveMiles(clinic) {

    if(clinic.driveMiles === null) {
      return '';
    } else {
      //Round drive miles to nearest whole number or decimal place for results less than one mile
      $.each(clinicData, function(index, value) {
        value.driveMiles = value.driveMiles > 1 ? Math.round(value.driveMiles) : Math.round(value.driveMiles * 10) / 10;
      });
      
      if(!autoExpandRadius) {
        return '<div class="drive-miles"><p>Approximate Distance: ' + clinic.driveMiles + (clinic.driveMiles === 1 ? ' mile' : ' miles') + '</p></div>';
      } else {
        return '<div class="drive-miles"><p>Approximate Distance: ' + clinic.driveMiles + ' miles</p><p><em>No clinics were found within your search parameters. The closest is listed above.</em></p></div>';
      }
    }    
  }

  function createClinicCards(clinicArray) {
    $.each(clinicArray, function(index, value) {

      var locationContent = '<div><a href="' + value.mapUrl + '" target="_blank">' + value.address + '<br>' + value.cityStateZip + '</a><span>' + value.phone + '</span><a href="' + value.pageUrl + '">Visit Clinic Page</a></div>'
        
      $('#clinicLocations').append('<section class="clinic-card"><h2>' + value.name + '</h2><section class="location"><h3>Location</h3>' + locationContent + '</section><section class="services"><h3>Services</h3>' + value.services + '</section><section class="hours"><h3>Hours</h3>' + value.hours + '</section>' + showDriveMiles(value) + '</section>');
    });
  }

  
  
  /*************************** Re-Add Location Info to Page ***************************/
  
  //Remove extraneous nested table code that SharePoint creates so there is a clean slate to manipulate the page
  function cleanContainer() {
    $('#clinicLocations').html('');
  }
  
  cleanContainer();
  
  //Alphabetize the clinicData array before the clinics are initially re-added to the page
  alphaClinics();
  
  //Create individual <sections> for each location and append them to the now clean container
  createClinicCards(clinicData);  
  
  displayCount(clinicData.length);
  
  
  /**************************************************************************
                          Load gMap and Markers
  **************************************************************************/
  
  function initMap(mapData) {
    
    var allLatLongs = [];
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      center: new google.maps.LatLng(39.7392, -104.9903), //The default center is the geographical center Denver
      scrollwheel: false,
      zoom: 8
    });
    
    geocoder = new google.maps.Geocoder();
    mapDistanceMatrix = new google.maps.DistanceMatrixService();
    mapBounds = new google.maps.LatLngBounds();
    
    //Add Start Location marker to page at the search lat long
    
    //var startIcon = "star-icon.png"; //Local path for localhost testing
    var startIcon = "../Documents/Styles_Scripts/clinic-locator/star-icon.png"
    searchLatLong ? (setMarkers(map, ({name: "Search Location"}), startIcon, searchLatLong), allLatLongs.push(searchLatLong)) : '';
    
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
    
    function setMarkerContent() {
      if(location.name === "Search Location") {
        var startLocation = $('#searchInput').val();
        return '<div class="marker-info"><strong>' + location.name + '</strong><span>"' + startLocation + '"</span></div>';
      } else {
        return '<div class="marker-info"><span class="marker-header">' + location.name + '</span><a href="' + location.mapUrl + '" target="_blank">' + location.address + '<br>' + location.cityStateZip + '</a><span>'  + location.phone + '</span>' + location.hours + '<a href="' + location.pageUrl + '">Visit Clinic Page</a></div>';
      }
    }
    
    var marker,
        markerContent = setMarkerContent(),
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
    matrixDestinations = [];
    searchLat = '';
    searchLatLong = '';
    searchLong = '';
    zip = '';
  }
  
  //Display error codes using errorCodse variable index
  function displayError(errorCodeIndex) {
    $('#resultCount').html('');
    $('#errorMessage').html(errorCodes[errorCodeIndex]);
  }
  
  //Add spinner to the page as visual cue that the data is about to change
  function addSpinner() {
    $('#errorMessage').html('');
    $('#clinicLocations').html('<div class="location-container-message"><div class="spinner"></div></div>');
  }
  
  function spinTimer(nextFunction) {
    setTimeout(function() {
      nextFunction;
    }, minSpinTimer)
  }
  
  /************************** Filter Search Function **************************/
  
  function countResults() {
    var count = 0;
    $.each(clinicData, function(index, value) {
      if(value.driveMiles <= searchRadius) {
        count++;
      }
    });
    return count;
  }
  
  function initiateSearch() {
    
    var oldRadius = searchRadius;
    var oldStart = startLocation;
    searchRadius = Number($('#searchRadius').val());
    startLocation = $('#searchInput').val();
    
    if(startLocation === '') {
      displayError(0);
    } else if(oldStart === startLocation && oldRadius === searchRadius) {
      displayError(3);
    } else if(oldStart === startLocation && oldRadius !== searchRadius) {
      var newResultCount = countResults();
      if(newResultCount === resultCount) {
        displayError(2)
      } else {
        resultCount = newResultCount;
        addSpinner();        
        setTimeout(function() {
          displayResults();
        }, minSpinTimer)
      }
    } else {
      resetValues();
      addSpinner();
      setTimeout(function() {
        geoCodeFilter(startLocation);
      }, minSpinTimer)
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
          unitSystem: google.maps.UnitSystem.IMPERIAL,
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
    
    //Clear out clinic card container    
    cleanContainer();
    
    //Set filterResults equal to slice of sorted array that falls within search radius
    var filterResults = clinicData.slice(0,resultCount);

    if(resultCount === 0) {
      autoExpandRadius = true;
      createClinicCards([clinicData[0]]);
      initMap([clinicData[0]]);
      displayCount(1);
    } else {
      autoExpandRadius = false;
      createClinicCards(filterResults);
      initMap(filterResults);
      displayCount(resultCount);
    }
    
  }
  
  //Get geo coordinates of the search parameter
    //The geoCode service is restricted to search only within the United States
  function geoCodeFilter(searchStart) {
    geocoder.geocode({'address': searchStart, 'componentRestrictions':{'country': 'US'}}, function(results, status) {
      if(status !== google.maps.GeocoderStatus.OK) {
        console.error(status);
      } else if(results[0].address_components.length == 1) {
        //If the results address components has a length of 1
          //The geocode didn't find the location so it defaulted to the center of the US
            //In this instance, an error code is added to the page prompting the user can try again
        
        displayError(0);
        $('#clinicLocations').html('<div class="location-container-message"><h2 class="center">No Results</h2></div>');
        
      } else if(!results[0].formatted_address.includes('CO')) {
        
        displayError(1);
        $('#clinicLocations').html('<div class="location-container-message"><h2 class="center">No Results</h2></div>');
        
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

    //Push clinic latLong into separate array for use in checkDistance function
    $.each(clinicData, function(index, value) {
      value.driveMiles = null;
      matrixDestinations.push(value.latLong);
    });

    //Call checkDistance function which returns a promise containing array of distances from start to all destinations
    checkDistance().then(function(data) {
      
      //Loop through clinicData, using the clinic index to check drive distance returned by the Promise
      $.each(clinicData, function(index, value) {
        //Promise returns drive distance in meters, which needs to be converted to miles to compare against searchRadius 
        value.driveMiles = data.rows[0].elements[index].distance.value * 0.000621371;        
      });
      
      //Sort results so the closest is listed first in object array
      clinicData.sort(function(a,b) {
        return (a.driveMiles - b.driveMiles);
      });

      resultCount = countResults();

      //Display results is called to re-paint the content and map to show only results of the search
      displayResults();
      searchCount++;
      
    })
    .catch(function(err) {
      console.error(err);
    });
  }



  /**************************************************************************
                Unhide components when data and map are loaded
  **************************************************************************/
  
  if(dataLoaded) {
    $('#loadingMessage').remove();
    $('#clinics').removeClass('hidden');
  }
  
});
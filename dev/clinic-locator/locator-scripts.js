/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Initial Variable Declarations ***************************/
  
  var geocoder, infoWindow, map, mapBounds, searchLatLong, searchRadius, searchResults, zip,
      allLatLongs = [],
      clinicData = [],
      clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr'));
  
  
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/
    
  function getData(tableRow) {
    return {
      name: $(tableRow).find('td.ms-vb2:first-child')[0].textContent,
      baseContent: $(tableRow).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
      services: $(tableRow).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
      hours: $(tableRow).find('td.ms-vb2:nth-child(4)')[0].innerHTML,
      lat: $(tableRow).find('td.ms-vb2:nth-child(5)')[0].textContent,
      long: $(tableRow).find('td.ms-vb2:nth-child(6)')[0].textContent,
      latLong: ''
    }
  }
  
  //Take location info from table, create object for each location and push to data array
  $.each(clinics, function(index, value) {
    clinicData.push(getData(value));
  });
  
  
  
  /*************************** Re-Add Location Info to Page ***************************/
  
  //Remove extraneous nested table code that SharePoint creates so there is a clean slate to manipulate the page
  $('#clinicLocations').html('');
  
  //Create individual <sections> for each location and append them to the now clean container
  $.each(clinicData, function (index, value) {
    
    $('#clinicLocations').append('<section class="clinic-card"><h2>' + value.name + '</h2><section class="location"><h3>Location</h3>' + value.baseContent + '</section><section class="services"><h3>Services</h3>' + value.services + '</section><section class="hours"><h3>Hours</h3>' + value.hours + '</section></section>');
    
  });

  
  
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
  
  function checkDistance() {
    var mapDistanceMatrix = new google.maps.DistanceMatrixService(),
        searchResults = [];
    
    $.each(clinicData, function (index, value) {
      
      mapDistanceMatrix.getDistanceMatrix(
        {
          origins: [value.latLong],
          destinations: [searchLatLong],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL, //Convert distance units to miles
          avoidHighways: false,
          avoidTolls: false
        }, callback
      );
      
      function callback(response, status) {
        if(status === "OK") {
          results = response.rows[0].elements[0];
          var miles = Math.round(results.distance.value * 0.000621371);
          miles <= searchRadius ? (value.driveMiles = miles, searchResults.push(value)) : '';
        } else {
          console.log("Error: " + status);
        }
      }
      
    });
    
    //Sort results so the closest is displayed
    searchResults.sort(function(a,b) {
      return (a.crowDistance - b.crowDistance);
    });
    
    console.log(searchResults);
    
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
      
          //Set latitude and longitude of search zip
          searchLatLong = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          
          //Call getClosest function to calculate distance between each distributor and the entered zip code
          checkDistance();
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
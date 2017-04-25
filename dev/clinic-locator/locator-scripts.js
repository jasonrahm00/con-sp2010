/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/
  
  var currentLatLong, infoWindow, map, mapBounds,
      allLatLongs = [],
      clinicData = [],
      clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr'));
  
  function getData(tableRow) {
    return {
      name: $(tableRow).find('td.ms-vb2:first-child')[0].textContent,
      baseContent: $(tableRow).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
      services: $(tableRow).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
      hours: $(tableRow).find('td.ms-vb2:nth-child(4)')[0].innerHTML,
      lat: $(tableRow).find('td.ms-vb2:nth-child(5)')[0].textContent,
      long: $(tableRow).find('td.ms-vb2:nth-child(6)')[0].textContent
    }
  }
  
  $.each(clinics, function(index, value) {
    clinicData.push(getData(value));
  });

  /*************************** Map ***************************/
  
  function initMap() {
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      zoom: 8,
      center: {lat: 39.7392, lng: -104.9903}//The map is initially centered on the geographical center Denver
    });
    
    $.each(clinicData, function(index, value) {
      currentLatLong = new google.maps.LatLng(value.lat, value.long);
      setMarkers(map, value, currentLatLong);
      allLatLongs.push(currentLatLong);
    });
    
    //Extend bounds of map and recenter so all markers are visible using gmaps api fitBounds method
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
  
  
  
  /*************************** Reformat Table Datat to Display Better ***************************/
  //Reformatting has to be done after map data is loaded, or map won't load
  
  $('#clinicLocations').html('');
  
  $(clinicData).each(function () {
    
    $('#clinicLocations').append('<section class="clinic-card"><h2>' + this.name + '</h2><section class="location"><h3>Location</h3>' + this.baseContent + '</section><section class="services"><h3>Services</h3>' + this.services + '</section><section class="hours"><h3>Hours</h3>' + this.hours + '</section></section>');
    
  });
  
  $('#loadingMessage').remove();
  $('#clinics').removeClass('hidden');
  
  
  
  /*************************** Location Filtering ***************************/
  
  
});
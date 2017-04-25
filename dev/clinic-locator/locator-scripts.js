/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Sharepoint Table Data Option ***************************/
  
  var clinics = $('table[summary="clinic-locations "] tr').not($('table[summary="clinic-locations "] tr.ms-viewheadertr.ms-vhltr'));
  
  $(clinics).each(function () {
    
    var name = $(this).find('td.ms-vb2:first-child')[0].textContent,
        location = $(this).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
        services = $(this).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
        hours = $(this).find('td.ms-vb2:nth-child(4)')[0].innerHTML,
        lat = $(this).find('td.ms-vb2:nth-child(5)')[0].innerHTML,
        long = $(this).find('td.ms-vb2:nth-child(6)')[0].innerHTML;
    
    $(this).html('<td><section class="clinic-card"><h2>' + name + '</h2><section class="location"><h3>Location</h3>' + location + '</section><section class="services"><h3>Services</h3>' + services + '</section><section class="hours"><h3>Hours</h3>' + hours + '</section></section></td>');
    
  });
    
  /*************************** Map ***************************/
  /*
  function initMap() {
    var allLatLongs = [];
    
    map = new google.maps.Map(document.getElementById('clinicMap'), {
      zoom: 8,
      center: {lat: 39.7392, lng: -104.9903}//The map is initially centered on the geographical center Denver
    });
    
    $.each(clinics, function(index, value) {
      var currentLatLong = new google.maps.LatLng(value.lat, value.long);
      setMarkers(map, value, currentLatLong);
      allLatLongs.push(currentLatLong);
    });
    
    //Extend bounds of map and recenter so all markers are visible using gmaps api fitBounds method
    var mapBounds = new google.maps.LatLngBounds();
    allLatLongs.forEach(function(latLng) {
      mapBounds.extend(latLng);
    });
    
    map.setCenter(mapBounds.getCenter());
    map.fitBounds(mapBounds);

  }

  //Create and place map markers and content
  function setMarkers(map, location, currentLatLong) {
    var marker,
        markerContent = '<div class="markerInfo"><strong>' + location.name + '</strong><br>' + basicContent(location) + '</div>',
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
  */
  
  $('#loadingMessage').remove();
  $('#clinics').removeClass('hidden');
});
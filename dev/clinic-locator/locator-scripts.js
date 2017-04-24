/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  /*************************** Clinic Cards ***************************/
  
  var clinicCard, infoWindow, map;
    
  clinics.sort(function(a, b) {
    return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
  });
  
  function createServiceList(y) {
    var serviceSpan = $('<span/>'),
        serviceHeader = $('<h3/>').text('Services').appendTo(serviceSpan),
        ul = $('<ul/>').appendTo(serviceSpan);
    
    y.sort();
    
    $.each(y, function(index, value) {
      var li = $('<li/>').text(value);
      $(ul).append(li);    
    });
    
    return $(serviceSpan).html();
  }
  
  function basicContent(y) {
    var address = '<a href="' + y.mapUrl + '" target="_blank">' + y.street + '<br>' + y.city + ' ' + y.zip + '</a><br>',
        phone = 'Phone: ' + y.phone + '<br>',
        website = '<a href="' + y.pageUrl + '">Visit Clinic Page</a></div>';
    return address + phone + website;
  }
  
  function createClinicCard(x) {
    var header = '<section class="clinic-card"><h2>' + x.name + '</h2>',
        services = createServiceList(x.services),
        hours = '<div class="hours"><h3>Hours</h3></div></section>';
    
    clinicCard = header + '<div class="location"><h3>Location</h3>' +  basicContent(x) + '<div class="services">' + services + '</div>' + hours;
    
    return clinicCard;
  }
  
  $.each(clinics, function(index, value) {
    $('.clinics').append(createClinicCard(value));
  });
  
  
  
  /*************************** Map ***************************/
  
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
  
});
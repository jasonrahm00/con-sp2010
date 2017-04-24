/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  var clinicCard, map;
    
  clinics.sort(function(a, b) {
    return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
  });
  
  function createServiceList(y) {
    var serviceSpan = $('<span/>'),
        serviceHeader = $('<h3/>').text('Services').appendTo(serviceSpan),
        ul = $('<ul/>').appendTo(serviceSpan);
    
    $.each(y, function(index, value) {
      var li = $('<li/>').text(value);
      $(ul).append(li);    
    });
    
    return $(serviceSpan).html();
  }
  
  function createClinicCard(x) {
    var header = '<section class="clinic-card"><h2>' + x.name + '</h2>',
        address = '<div><h3>Location</h3><a href="' + x.mapUrl + '" target="_blank">' + x.street + '<br>' + x.city + ' ' + x.zip + '</a><br>',
        phone = 'Phone: ' + x.phone + '<br>',
        website = '<a href="' + x.pageUrl + '">Visit Clinic Page</a></div>',
        services = createServiceList(x.services),
        hours = '<div><h3>Hours</h3></div></section>';
    
    clinicCard = header + address + phone + website + '<div class="services">' + services + '</div>' + hours;
    
    return clinicCard;
  }
  
  $.each(clinics, function(index, value) {
    $('.clinics').append(createClinicCard(value));
  });
  
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {lat: 39.8282172, lng: -98.5795122}//The map is centered on the geographical center of the contiguous US
    });
  }
  
  initMap();
  
});
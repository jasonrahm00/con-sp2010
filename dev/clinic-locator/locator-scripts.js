/**************************************************************************
                  Custom Clinic Locator Logic ~jrahm
**************************************************************************/

$(document).ready(function() {
  var clinicCard;
  
  clinics.sort(function(a,b) {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
  });
  
  function createServiceList(y) {
//    y.sort(function (a, b) {
//      return a - b;
//    });
//    
//    $.each(y, function(index, value) {
//      return '<li>' + value + '</li>';
//    });
    
    return y;
  }
  
  function createClinicCard(x) {
    var header = '<section class="clinic-card"><h2>' + x.name + '</h2>';
    var address = '<div><h3>Location</h3><a href="' + x.mapUrl + '" target="_blank">' + x.street + '<br>' + x.city + ' ' + x.zip + '</a><br>';
    var phone = 'Phone: ' + x.phone + '<br>';
    var website = '<a href="' + x.pageUrl + '">Visit Clinic Page</a></div>';
    var services = '<div><h3>Services</h3><ul>' + createServiceList(x.services) + '</ul></div>';
    var hours = '<div><h3>Hours</h3></div></section>';
    clinicCard = header + address + phone + website + services + hours;
    return clinicCard;
  }
  
  $.each(clinics, function(index, value) {
    $('.clinics').append(createClinicCard(value));
  });
  
});
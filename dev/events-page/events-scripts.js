$(document).ready(function() {
  var dateCell = $('#conEvents td.ms-vb2:nth-child(1)')[0],
      eventDate = new Date(dateCell.innerText),
      eventMonth = eventDate.toLocaleString(locale, {month: "short"}),
      eventDay = eventDate.getDate(),
      locale = "en-us",
      today = new Date();
                  
  $(dateCell).html('<span class="month">' + eventMonth + '</span><span class="day">' +  eventDay + '</span>');
  
  function removeUniCode() {
    var abc = document.body.innerHTML,
        a = String(abc).replace(/\u200B/g,'');
    document.body.innerHTML = a;
  }
  
  removeUniCode();
  
});
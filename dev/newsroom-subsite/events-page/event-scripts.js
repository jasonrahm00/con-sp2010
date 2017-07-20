$(document).ready(function() {
  
  /**************************************************************************
                          Events Page Scripts
  **************************************************************************/
  
  if(window.location.href.indexOf('events.aspx') > -1) {
    var eventRows = $('table[summary="event-list "] tr').not($('table[summary="event-list "] tr.ms-viewheadertr.ms-vhltr')),
      months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      today = new Date();
  
    $(eventRows).each(function () {

      var dateString = $(this).find('td.ms-vb2:first-child')[0].textContent,
          dateParts = dateString.split('/'),
          eventDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);

      if(eventDate > today) {
        var eventDay = eventDate.getDate(),
            eventMonth = months[eventDate.getMonth()],
            eventTitle = $(this).find('td.ms-vb2:nth-child(2)')[0].innerHTML,
            eventTime = $(this).find('td.ms-vb2:nth-child(3)')[0].innerHTML,
            eventLocation = $(this).find('td.ms-vb2:nth-child(4)')[0].innerHTML;

        $(this).html('<td class="date"><span class="month">' + eventMonth + '</span><span class="day">' + eventDay + '</span></td><td class="details"><span class="event-title">' + eventTitle + '</span>' + eventTime + ' | ' + eventLocation + '</td>');

        $(this).find('a').attr('target', '_blank');
      } else {
        $(this).remove();
      }

      $('#loadingMessage').remove();
      $('#conEvents').removeClass('hidden');

    });
  }

});
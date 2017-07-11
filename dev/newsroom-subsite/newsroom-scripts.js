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
  
  
  
  /**************************************************************************
                            Newsroom Scripts
  **************************************************************************/

  if(window.location.href.indexOf('news-stories.aspx') > -1) {
    
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        newsStories = $('table[summary="News Items "] tr').not($('table[summary="News Items "] tr.ms-viewheadertr.ms-vhltr'));
    
    function getCategories(cellContents) {
      return(cellContents.split(','))
    }
    
    function getPublishDate(dateString) {
      var dateParts = dateString.split('/');
      return months[dateParts[0] - 1] + ', ' + dateParts[2];
    }
    
    function getNewsData(newsTableRow) {
      return {
        name: $(newsTableRow).find('td.ms-vb2:first-child')[0].innerHTML,
        summary: $(newsTableRow).find('td.ms-vb2:nth-child(2)')[0].textContent,
        publishDate: getPublishDate($(newsTableRow).find('td.ms-vb2:nth-child(3)')[0].textContent),
        categories: getCategories($(newsTableRow).find('td.ms-vb2:nth-child(4)')[0].textContent)
      }
    }

    $.each(newsStories, function(index, value) {
      var story = getNewsData(value);
      $(this).html('<td colspan="4" style="padding: 0;"><div class="margin-bottom-medium"><h4>' + story.name + '</h4><p><strong>' + story.publishDate + '</strong></p><p>' + story.summary + '</p></div></td>');
    });
      
    $('#localNav li a').each(function (index, value) {
      if(window.location.href.indexOf($(this).attr('href')) > -1) {
        $(this).parent().addClass('active');
        if(window.location.href.indexOf('older-news') > -1) {
          $('#subHeader').text('Archived News');
        } else {
          $('#subHeader').text($(this).text());
        }
      }
    });

    $('table[summary="News Items "] tr.ms-viewheadertr.ms-vhltr').remove();
    $('#loadingMessage').remove();
    $('#newsContainer').removeClass('hidden');
  }

});
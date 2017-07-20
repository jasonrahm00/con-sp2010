$(document).ready(function() {
    
  /**************************************************************************
                            Newsroom Scripts
  **************************************************************************/

  if(window.location.href.indexOf('stories.aspx') > -1) {
    
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        newsStories = $('table[summary="news-items "] tr').not($('table[summary="news-items "] tr.ms-viewheadertr.ms-vhltr'));
    
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
      
    function getFirstWord(x) {
      var textString = x.toLowerCase().split(' ');
      if(textString.length > 1) {
        return textString[0];
      } else {
        return 'older-news';
      }
    }
    
    $('#localNav li a').each(function (index, value) {
      if(window.location.href.indexOf('FilterValue1=' + getFirstWord($(this).text())) > -1) {
        $(this).parent().addClass('active');
        if(window.location.href.indexOf('older-news') > -1) {
          $('#subHeader').text('Archived News');
        } else {
          $('#subHeader').text($(this).text());
        }
      }
    });

    $('table[summary="news-items "] tr.ms-viewheadertr.ms-vhltr').remove();
    $('#loadingMessage').remove();
    $('#newsContainer').removeClass('hidden');
  }

});
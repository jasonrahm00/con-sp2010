/**************************************************************************
                  Custom Tooltip Widget ~jrahm
**************************************************************************/

$(document).ready(function() {
  var tooltips = document.getElementsByClassName('tooltip');
  
  if(tooltips.length === 0) {
    return
  } else {
    
    var leftPosition, topPosition, contentWidth;
    var currentTarget = null;
    function closeTooltip() {
      $('.tooltip .tooltip-content').hide();
      currentTarget = null;
    }

    //Position tooltip content to be just right of the target
    $('.tooltip .tooltip-target').each(function() {
      topPosition = ($(this).next().height() * 0.5) + ($(this).height()) + 2;
      leftPosition = $(this).width() + 35;
      $(this).next().css({
        'top': '-' + topPosition + 'px',
        'left': leftPosition + 'px'
      });
      $(this).next().append('<span class="close">X</span>');
    });

    $('.tooltip .tooltip-target').click(function (event){
      event.preventDefault(); //In case target is an <a> tag, disable default behavior
      if(currentTarget == this) {
        closeTooltip();
      } else {
        closeTooltip();
        currentTarget = this;
        $(currentTarget).next().show();
      }
    });

    //Close tooltip if anything other than the content box is clicked on
    $(document).click(function(event) {
      var clickTarget = $(event.target); 
      if($(clickTarget).hasClass('tooltip-target') || $(clickTarget).hasClass('tooltip-content') || $(clickTarget).parents().hasClass('tooltip-content')) { 
        return;
      } else {
        closeTooltip();
      }
    });

    $('.tooltip .tooltip-content .close').click(function() {
      closeTooltip();
    });

    $(document).bind('keydown', function(e) {
      if(e.which == 27 && currentTarget !== null) {
        closeTooltip();
      }
    });
  }  
  
});
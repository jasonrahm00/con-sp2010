$(document).ready(function() {
  var currentTarget, leftPosition, topPosition;
  
  function closeTooltip() {
    $('.tooltip-content').removeClass('active').hide();
    currentTarget = null;
  }
  
  //Position tooltip content to be just right of the target
  $('.tooltip-target').each(function() {
    topPosition = ($(this).next().height() * 0.5) + ($(this).height() * 0.5);
    leftPosition = $(this).width() + 25;
    $(this).next().css('top', '-' + topPosition + 'px');
    $(this).next().css('left', leftPosition + 'px');
  });
  
  $('.tooltip-target').click(function (){
    if(currentTarget == this) {
      closeTooltip();
    } else {
      closeTooltip();
      currentTarget = this;
      $(currentTarget).next().show().addClass('active');
    }
  });
  
  $(document).click(function(event) {
    var clickTarget = $(event.target);
    if($(clickTarget).hasClass('tooltip-target') || $(clickTarget).hasClass('tooltip-content') || $(clickTarget).parents().hasClass('tooltip-content')) { 
      return;
    } else {
      closeTooltip();
    }
  });
  
  $('.tooltip-content .close').click(function() {
    closeTooltip();
  });
  
});
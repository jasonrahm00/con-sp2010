$(document).ready(function() {
  var currentTarget, topPosition;
  
  $('.tooltip-target').each(function() {
    topPosition = $(this).next().height() * 0.5;
    $(this).next().css('top', '-' + topPosition + 'px');
  });
  
  $('.tooltip-target').click(function (){
    if(currentTarget == this) {
      $(this).next().removeClass('active');
      currentTarget = null;
    } else {
      $('.tooltip-target').not(this).next().removeClass('active').hide();
      currentTarget = this;
      $(currentTarget).next().show().addClass('active');
    }
  });
  
  $(document).click(function(event) {
    var clickTarget = $(event.target);
    if($(clickTarget).hasClass('tooltip-target') || $(clickTarget).hasClass('tooltip-content') || $(clickTarget).parents().hasClass('tooltip-content')) {
      return;
    } else {
      $('.tooltip-content.active').removeClass('active').hide();
      currentTarget = null;
    }
  });
  
});
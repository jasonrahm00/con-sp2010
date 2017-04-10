$(document).ready(function() {
  var currentTarget, topPosition;
  
  $('.tooltip-target').click(function (){
    if(currentTarget == this) {
      $(this).next().removeClass('active');
      currentTarget = null;
    } else {
      $('.tooltip-target').not(this).next().removeClass('active').hide();
      currentTarget = this;
      topPosition = ($(currentTarget).next().height()) * 0.5;
      $(currentTarget).next().css('top', '-' + topPosition + 'px').addClass('active');
    }
  });
  
});
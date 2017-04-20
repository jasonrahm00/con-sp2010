/**************************************************************************
                  Custom Toggle Widget ~jrahm
**************************************************************************/

$(document).ready(function() {
  
  var toggles = document.getElementsByClassName('toggle');
  
  if(toggles.length === 0) {
    return;
  } else {
    var currentTarget;
    $('.toggle .toggle-target').click(function () {
      if(currentTarget == this) {
        $(this).next().slideUp();
        currentTarget = null;
      } else {
        $('.toggle .toggle-target').not(this).next().slideUp();
        $(this).next().slideDown();
        currentTarget = this;
      }
    });
  }  
  
});
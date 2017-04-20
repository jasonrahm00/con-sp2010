//JS contained in nursing-theme.js

/**************************************************************************

          Dynamic Audience Sorting for Programs Landing Page ~jrahm

**************************************************************************/

var currentTarget, 
    degreeLevel = "all";

$(document).ready(function() {
  
//  $('.toggle-target').click(function () {
//    if(currentTarget == this) {
//      $(this).next().slideUp();
//      currentTarget = null;
//    } else {
//      $('.toggle-target').not(this).next().slideUp();
//      $(this).next().slideDown();
//      currentTarget = this;
//    }
//  });
  
  //Click event fired when different program is category is chosen
  //Cards whose class don't match the input value are hidden
  $('#programSorting input:radio').click(function() {
    if(degreeLevel !== $(this).val()) {
      degreeLevel = $(this).val();
      $('.program-cards>div').removeClass('hidden');
      $('#programSorting label').removeClass('active');
      $(this).parent().addClass('active');
      if(degreeLevel !== "all") {
        $('.program-cards>div').not('.' + degreeLevel).addClass('hidden');
      } else {
        $('.program-cards>div').removeClass('hidden');
      }
    }
    
  });
  
});
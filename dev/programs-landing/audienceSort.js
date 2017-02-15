//JS contained in nursing-theme.js

/**************************************************************************

          Dynamic Audience Sorting for Programs Landing Page
    
                              ~Jason Rahm

**************************************************************************/
var currentTarget, 
    degreeLevel = "all", 
    toggleTargets = document.getElementsByClassName('toggle-target');

$(document).ready(function() {
  
  $('.toggle-target').click(function () {
    if(currentTarget == this) {
      $(this).next().slideUp();
      currentTarget = null;
    } else {
      $('.toggle-target').not(this).next().slideUp();
      $(this).next().slideDown();
      currentTarget = this;
    }
  });
  
  //Click event fired when different program is category is chosen
  //Program cards <div> is cleared out and new set of cards are added that only show programs available for current selection
  $('#programSorting input:radio').click(function() {
    if(degreeLevel !== $(this).val()) {
      degreeLevel = $(this).val();
      $('.program-cards>div').removeClass('hidden');
      $('#programSorting label').removeClass('active');
      $(this).parent().addClass('active');
      if(degreeLevel !== "all") {
        $('.program-cards>div').not('[data-programLevel="' + degreeLevel + '"]').addClass('hidden');
      } else {
        $('.program-cards>div').removeClass('hidden');
      }
    }
    
  });
  
});
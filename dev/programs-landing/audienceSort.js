/**************************************************************************
        Dynamic Audience Sorting for Programs Landing Page ~jrahm
**************************************************************************/

var degreeLevel = "all";

$(document).ready(function() {
    
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
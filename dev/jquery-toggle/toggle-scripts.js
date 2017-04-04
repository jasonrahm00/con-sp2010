$(document).ready(function() {
  
  $('.toggle-header').click(function() {
    if($(this).hasClass('active')) {
      $(this).removeClass('active');
      $(this).next('.toggle-content').slideToggle();
    } else {
      $(this).addClass('active');
      $(this).next('.toggle-content').slideToggle();
    }
   });
  
});
$(document).ready(function() {
  $('.tooltip-target').click(function (){
    $(this).next().addClass('active');
  });
});
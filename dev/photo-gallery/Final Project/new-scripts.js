$(document).ready(function() {
  
  var currentThumb, selectedThumb, selectedFull, selectedPre;
  var firstImage = $('.gallery-thumbnails img')[0];
  
  function setImage(x) {
    selectedThumb = $(x).attr('src');
    selectedFull = selectedThumb.replace('_thumbnail', '_fullsize');
    selectedPre = selectedThumb.replace('_thumbnail', '_preview');
  }
  
  function placeImage() {
    $('.gallery-preview').html('<img alt ="" src="' + selectedPre + '">');    
    $('.gallery-full').html('<img alt ="" src="' + selectedFull + '">');
  }
  
  //Click function that selects image when clicked on
  $('.gallery-thumbnails img').click(function () { 
    
    if(currentThumb !== this) {
      $('.gallery-thumbnails img').removeClass('selected');
      $(this).addClass('selected');
      
      setImage(this);

      $('.gallery-preview').fadeOut(400, function() {
        setTimeout(placeImage(), 400);
        $('.gallery-preview').fadeIn(400);
      });  

      currentThumb = this;
    }
    
  });
  
  //Set Default Image on Page Load
  function setDefaultImage() {
    setImage(firstImage);
    placeImage(firstImage);
    $(firstImage).addClass('selected');
    currentThumb = firstImage;
  }
  
  setDefaultImage();
  
  //Display full-size image
  //Need to add event listener when new image is dynamically loaded so click event will work
  
});
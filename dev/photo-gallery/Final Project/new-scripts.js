$(document).ready(function() {
  
  var currentThumb, selectedThumb, selectedFull, selectedPre;
  var backdrop = '<div class="backdrop"></div>';
  var firstImage = $('.gallery-thumbnails img')[0];
  
  function setImage(x) {
    selectedThumb = $(x).attr('src');
    selectedFull = selectedThumb.replace('_thumbnail', '_fullsize');
    selectedPre = selectedThumb.replace('_thumbnail', '_preview');
  }
  
  function placeImage() {
    $('.gallery-preview').html('<img alt ="" src="' + selectedPre + '">');    
    $('.lightbox-content').html('<img alt ="" src="' + selectedFull + '">');
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
  
  //Display full image in lightbox
    //http://jsfiddle.net/MrGarretto/97dns8u5/
    //https://codepen.io/anon/pen/dvQEGj
    //http://jsfiddle.net/d6DH6/7/
    //Create overlay programmatically instead of coded into page
  
  var overlay = ('<div class="overlay"></div>');
  
  $('.gallery-preview').click(function() {
    $('body').append(overlay);
    $('.overlay').animate({"opacity": "0.7"}, 500);
    $('.lightbox').animate({"opacity": "1.0"}, 500, function() {
      $('.lightbox').css('display', 'block');
    });
    $('.overlay').click(function() {
      $('.overlay, .lightbox').animate({"opacity": "0.0"}, 500, function() {
        $('.lightbox').css("display", "none");
        $('.overlay').remove();
      });
    });
  });

});
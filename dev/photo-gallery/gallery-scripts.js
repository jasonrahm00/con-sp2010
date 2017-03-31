$(document).ready(function() {
  
  var currentThumb, selectedThumb, selectedFull, selectedPre;
  var backdrop = '<div class="backdrop"></div>';
  var firstImage = $('.gallery-thumbnails img')[0];
  var fadeTimerShort = 250;
  var fadeTimerMedium = 500;
  var overlay = '<div class="overlay"></div>';
  var lightboxClose = '<span class="lightbox-close">X</span>';
  
  function setImage(x) {
    selectedThumb = $(x).attr('src');
    selectedFull = selectedThumb.replace('-thumb', '-full');
    selectedPre = selectedThumb.replace('-thumb', '-pre');
  }
  
  function placeImage() {
    $('.gallery-preview').html('<img alt ="" src="' + selectedPre + '"><span class="view-full-image">View Full Image</span>');    
    $('.lightbox-content').html('<img alt ="" src="' + selectedFull + '">' + lightboxClose);
  }
  
  //Click function that selects image when clicked on
  $('.gallery-thumbnails img').click(function () { 
    
    if(currentThumb !== this) {
      $('.gallery-thumbnails img').removeClass('selected');
      $(this).addClass('selected');
      
      setImage(this);

      $('.gallery-preview').fadeOut(fadeTimerShort, function() {
        setTimeout(placeImage(), fadeTimerShort);
        $('.gallery-preview').fadeIn(fadeTimerShort);
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

  $('.gallery-preview').click(function() {
    $('body').append(overlay);
    $('.lightbox').css('display', 'block');
    $('.overlay').animate({"opacity": "0.7"}, fadeTimerMedium);
    $('.lightbox-content').animate({"opacity": "1.0"}, fadeTimerMedium);
    $('.overlay, .lightbox-close').click(function() {
      $('.overlay, .lightbox-content').animate({"opacity": "0.0"}, fadeTimerMedium, function() {
        $('.lightbox').css("display", "none");
        $('.overlay').remove();
      });
    });
  });

});
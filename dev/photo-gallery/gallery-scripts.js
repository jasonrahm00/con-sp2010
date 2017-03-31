$(document).ready(function() {
  
  var caption, currentThumb, selectedIndex, selectedFull, selectedPre, selectedThumb;
  var backdrop = '<div class="backdrop"></div>';
  var firstImage = $('.gallery-thumbnails img')[0];
  var fadeTimerShort = 250;
  var fadeTimerMedium = 500;
  var overlay = '<div class="overlay"></div>';
  var lightboxClose = '<span class="lightbox-close">X</span>';
  
  //Called in the setImage function If image has alt text, use that as a caption, else no caption shows
  function getCaption(y) {
    if($(y).attr('alt') !== '') {
      return '<figcaption class="image-caption">' + $(y).attr('alt') + '</figcaption>';
    } else {
      return '';
    } 
  }
  
  //Called in the setImage function for later use in the next/previous buttons
  function setIndex(y) {
    return $('.gallery-thumbnails img').index(y);
  }
  
  //Hide/show controls depending on the index of the current image
  function indexCheck() {
    if(selectedIndex === 0) {
      $('.previous-image').addClass('inactive');
    } else {
      $('.previous-image').removeClass('inactive');
    }
    
    if((selectedIndex + 1) === $('.gallery-thumbnails img').length) {
      $('.next-image').addClass('inactive');
    } else {
      $('.next-image').removeClass('inactive');
    }
  }
  
  //Set the selected image when a thumbnail is clicked
  function setImage(x) {
    selectedIndex = setIndex(x);
    indexCheck();
    caption = getCaption(x);
    selectedThumb = $(x).attr('src');
    selectedFull = selectedThumb.replace('-thumb', '-full');
    selectedPre = selectedThumb.replace('-thumb', '-pre');
  }
  
  //Place selected image preview and full versions in their respective containers  
  function placeImage() {
    $('.preview-wrapper').html('<figure><img alt ="Image preview" src="' + selectedPre + '">' + caption + '</figure><span class="view-full-image"><img alt="Magnifying glass icon" src="/PublishingImages/UCDLayoutImages/searchButton.png"></span>');    
    $('.lightbox-content').html('<img alt ="" src="' + selectedFull + '">' + caption + lightboxClose);
  }
  
  function swapImage() {
    $('.preview-wrapper').fadeOut(fadeTimerShort, function() {
      setTimeout(placeImage(), fadeTimerShort);
      $('.preview-wrapper').fadeIn(fadeTimerShort);
    });
    
    $('.gallery-thumbnails img').removeClass('selected');
    currentThumb = $('.gallery-thumbnails img')[selectedIndex];
    $(currentThumb).addClass('selected');
    
  }

  //Click event that selects image when clicked on
  $('.gallery-thumbnails img').click(function () { 
    
    if(currentThumb !== this) {
      setImage(this);
      swapImage();
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
  $('.preview-wrapper').click(function() {
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
  
  //Gallery controls
  $('.gallery-controls span').click(function() {
    
    if($(this).hasClass('inactive')) return;
    
    if($(this).hasClass('previous-image')) {
      setImage($('.gallery-thumbnails img')[selectedIndex - 1]);
    }
    if($(this).hasClass('next-image')) {
      setImage($('.gallery-thumbnails img')[selectedIndex + 1]);
    }
    swapImage();
  });

});
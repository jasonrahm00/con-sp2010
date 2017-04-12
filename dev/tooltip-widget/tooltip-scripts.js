$(document).ready(function() {
  var leftPosition, topPosition, contentWidth;
  var currentTarget = null;
  
  function closeTooltip() {
    $('.tooltip-content').removeClass('active').hide();
    currentTarget = null;
  }
  
  function setWidth() {
    if($('.tooltip').attr('data-contentWidth')) {
      contentWidth = $('.tooltip').attr('data-contentWidth')
    } else {
      contentWidth = 250;
    }
  }
  
  //Position tooltip content to be just right of the target
  $('.tooltip-target').each(function() {
    setWidth();
    topPosition = ($(this).next().height() * 0.5) + ($(this).height());
//    leftPosition = $(this).parents('.tooltip').width() + 25;
    leftPosition = $(this).width() + 25;
    $(this).next().css('top', '-' + topPosition + 'px');
    $(this).next().css('left', leftPosition + 'px');
    $(this).next().css('width', contentWidth + 'px');
  });
  
  $('.tooltip-target').click(function (){
    if(currentTarget == this) {
      closeTooltip();
    } else {
      closeTooltip();
      currentTarget = this;
      $(currentTarget).next().show().addClass('active');
    }
  });
  
  $(document).click(function(event) {
    var clickTarget = $(event.target);
    if($(clickTarget).hasClass('tooltip-target') || $(clickTarget).hasClass('tooltip-content') || $(clickTarget).parents().hasClass('tooltip-content')) { 
      return;
    } else {
      closeTooltip();
    }
  });
  
  $('.tooltip-content .close').click(function() {
    closeTooltip();
  });
  
  $(document).bind('keydown', function(e) {
    if(e.which == 27 && currentTarget !== null) {
      closeTooltip();
    }
  });
  
  /* Test Get Request */
  //https://msdn.microsoft.com/en-us/library/office/hh185007(v=office.14).aspx
  console.log($.get("/academics/colleges/nursing/clinical-practice-community/Lists/Questions%20Contact%20information%20below/Clinical%20Placement%20Contacts.aspx"));
});
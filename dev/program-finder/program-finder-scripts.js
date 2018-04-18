$(document).ready(function() {
  
  /*************************** Initial Variable Declarations ***************************/
  
  var dataLoaded = false,
      dataLoadError = false,
      programCards = "",
      programs = [];
  
  var tableRows = $('table[summary="program-list "] tr').not($('table[summary="program-list "] tr.ms-viewheadertr.ms-vhltr'));
  
  /*************************** Get Data from Sharepoint Table on Page ***************************/
  
  //Returns an object with data loaded from the table cells
  function getData(tableRow) {
    return {
      name: tableRow.children[0].innerText,
      url: tableRow.children[1].innerText,
      degree: tableRow.children[2].innerText,
      format: tableRow.children[3].innerText
    }
  }
  
  function createProgramCard(x) {
    var card = "<div class='program-card'>";
        card += "<span class='card-title'>" + x.name + "</span>";
        card += "<div class='card-body'>";
        card += "<ul>";
        card += "<li>" + x.degree + "</li>";
        card += "<li>" + x.format + "</li>";
        card += "</ul>";
        card += "<a href='" + x.url + "'>Visit Page</a>"
        card += "</div></div>";
    programCards += card;
  }
  
  function cleanCardContainer() {
    $("#programCards").html("");
  }
  
  function buildFilters() {
    //filters for
      //degree earned (bs, dnp, phd, ms, etc)
      //specialty
      //format
      //current ed level
  }

  try {
    getData(tableRows[0]);
  }
  catch(err) {
    dataLoadError = true;
    console.log(err);
  }
  
  if(!dataLoadError) {
    programCards = "";
    $.each(tableRows, function(index, value) {
      var data = getData(value)
      programs.push(data);
      createProgramCard(data);
    });
    cleanCardContainer();
    $("#programCards").html(programCards);
    dataLoaded = true;
  }  

  /**************************************************************************
                Unhide components when content is fomatted
  **************************************************************************/
  
  if(dataLoaded) {
    $("#loadingMessage").remove();
    $("#visWrapper").show();
  }
  
});
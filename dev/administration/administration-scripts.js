$(document).ready(function() {
  
  /**************************************************************************
                          Administration Page Scripts
  **************************************************************************/
  
  if(window.location.href.indexOf('administration-test.aspx') > -1) {
    var listUrl = 'http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/_vti_bin/listdata.svc/ConStaff';
    var tableData = [];
    
    $.getJSON(listUrl, function(data) {
      
      $.each(data.d.results, function(index, value) {
        tableData.push(
          {
            id: value.Id,
            email: value.Email.split(', '),
            jobTitle: value.JobTitle,
            name: value.Name,
            phone: value.Phone,
            profilePage: value.Profile ? value.Profile.split(', ') : null,
            subTeam: value.SubTeam,
            team: value.Team          
          }
        )
      });
      
      console.log(tableData);
      
    });
  }
  
});
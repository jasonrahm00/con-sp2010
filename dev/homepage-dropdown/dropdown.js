//JS contained in nursing-theme.js

/**********************************************

    Dynamic Dropdown Code ~Jason Rahm

**********************************************/
//Array of objects used to store information about program names and url to page
  //Easier to manage and change positioning, titles and urls if they only exist in one place as opposed to select and options elements for each audience
  //Audience array values correspond to option values in the education level dropdown
var programOptions = [
  {
    "name": "Traditional Pathway Program",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/undergraduate-programs/nursing-bs/Pages/nursing-bs.aspx",
    "audience": [3, 5]
  },
  {
    "name": "BS Degreee - Prerequisites",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/undergraduate-programs/nursing-bs/Pages/requirements.aspx",
    "audience": [1, 3]
  },
  {
    "name": "Integrated Nursing Pathway Program",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/undergraduate-programs/Pages/IntegratedNursingPathway.aspx",
    "audience": [1, 3]
  },
  {
    "name": "RN-BS Degree",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/undergraduate-programs/rn-to-nursing-bs/Pages/default.aspx",
    "audience": [2]
  },
  {
    "name": "MS (indirect care)",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/ms-program/Pages/ms-program.aspx",
    "audience": [4]
  },
  {
    "name": "MS (advanced practice)",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/ms-program/Pages/ms-program.aspx",
    "audience": [4]
  },
  {
    "name": "BS-DNP",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/bs-dnp-program/Pages/BS-DNP-program.aspx",
    "audience": [4]
  },
  {
    "name": "BS-PhD (Research/Administration)",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/bs-phd-program/Pages/bs-phd-program.aspx",
    "audience": [4]
  },
  {
    "name": "Accelerated (UCAN) Program",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/undergraduate-programs/UCAN/Pages/default.aspx",
    "audience": [5]
  },
  {
    "name": "Post-Graduate Certificate",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/post-graduate-certificates/Pages/post-graduate-certificate.aspx",
    "audience": [6]
  },
  {
    "name": "DNP (Practice/Education)",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/doctor-nursing-practice/Pages/doctor-of-nursing-practice.aspx",
    "audience": [6]
  },
  {
    "name": "PhD (Research/Administration)",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/doctor-philosophy/Pages/doctor-of-philosophy.aspx",
    "audience": [6]
  },
  {
    "name": "Continuing Education and Professional Development",
    "url": "http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/CE-PD/Pages/default.aspx",
    "audience": [4, 6]
  }
]


$(document).ready(function(){
  $('#resourcesFor').change(function() {

  var vals = [];
  var audience = parseInt(this.value);
  $('#edOptions').hide().html('<option selected disabled>-- Choose Option --</option>');//Hide selector when value changes

  //Loop through programOptions objects and audience array values to find instances where the object audience matches the selected audience value
  for(var i = 0; i < programOptions.length; i++) {
    var programOption = programOptions[i];
    for(var j = 0; j < programOption.audience.length; j++) {
      if(programOption.audience[j] === audience) {
        vals.push(programOption);//If there is an audience value match, the object is pushed to the vals array
      }
    }
  }

  //Each object in vals array is turned into an option element and appended to the education options selector
  for(var i = 0; i < vals.length; i++) {
    var val = vals[i];
    var newOption = '<option value="' + val.url + '">' + val.name + '</option>';
    $(newOption).appendTo('#edOptions');
  }

  $('#edOptions').slideToggle();//Show selector after new values are populated gives visual cue that something has happened

    });

    $('#edOptions').change(function() {
    window.location.href = this.value;
        }
    );
});
var defaultFaculty = {
  Bio: "<div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</p><p>Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.</p></div>",
  Biosketch: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Documents/cv-sample.pdf",
  CV: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Documents/cv-sample.pdf",
  Degree: "PhD, MS",
  Education: "<ul><li>PhD, Harvard</li><li>MS, Yale</li><li>BSN, CU Boulder</li></ul>",
  EMail: "somewhere@email.com",
  Headshot: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/PublishingImages/default-profile.png",
  Name: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Pages/fred-faculty.aspx, Faculty, Fred",
  Office: "12345",
  Phone: "555-555-5555",
  Specialization: "<ul><li><a href='http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/graduate-specialties/healthcareinformatics/Pages/default.aspx'>Health Care Informatics</a></li><li>Research</li></ul>",
  Title: "Assistant Professor"
};

function stripSpaces(strng) {
  return strng.replace(/[\u200B]/g, '');
}

function facultyDataObj(obj) {
  return {
          bio: stripSpaces(obj.Bio),
          biosketch: obj.Biosketch,
          cv: obj.CV,
          degree: obj.Degree,
          education: obj.Education,
          email: obj.EMail,
          headshot: obj.Headshot,
          firstName: obj.Name.split(',')[2],
          lastName: obj.Name.split(',')[1],
          office: obj.Office,
          phone: obj.Phone,
          specialization: obj.Specialization,
          title: obj.Title,
          url: obj.Name.split(',')[0]
        };
}

angular.module("facultyBios", [])
.filter("renderHTMLCorrectly", function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
})
.service("dataService", function($http, $q){

  "use strict";

  // getData method to be called from controller
    // Returns promise with announcement data object array upon success
  this.getData = function(url) {

    var deferred = $q.defer();

    // Get function that retrieves data from Internal Annoucements list
    return $http.get(url)
      .then(function(response) {
        deferred.resolve(response);
        return deferred.promise;
    }, function(error) {
        deferred.reject(error);
        return deferred.promise;
    });
  };

})
.controller("mainController", function($scope, dataService){

  var smallList = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/_vti_bin/listdata.svc/FacultyDirectory?$orderby=Name asc",
      fullList = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/_vti_bin/listdata.svc/Faculty?$orderby=Name asc",
      michaelRice = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/_vti_bin/listdata.svc/Faculty?$filter=(LastName eq 'Rice') and (FirstName eq 'Michael')",
      news = "http://www.ucdenver.edu/academics/colleges/nursing/about-us/news/_vti_bin/ListData.svc/NewsItems?$expand=Category,Faculty&$orderby=PublishDate desc";

  $scope.url = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Pages/m_rice.aspx";

  dataService.getData(fullList).then(function(response) {
    var results = response.data.d.results;

    console.log(results);

    results.forEach(function(elem) {
      if (elem.Name.split(',')[0] == $scope.url) {
        $scope.data = facultyDataObj(elem);
      } else {
        $scope.data = facultyDataObj(defaultFaculty);
      }
    });

  }, function(error) {
    console.log(error);
  })

});

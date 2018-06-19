const name="";

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
  this.getData = function() {

    var deferred = $q.defer();

    // Get function that retrieves data from Internal Annoucements list
    return $http.get("http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/_vti_bin/listdata.svc/FacultyDirectory")
      .then(function(response) {

        var results = response.data.d.results[0],
            data = {
              bio: results.Bio,
              biosketch: results.Biosketch,
              cv: results.CV,
              degree: results.Degree,
              education: results.Education.split(','),
              email: results.Email,
              headshot: results.Headshot.split(',')[0],
              name: results.Name,
              firstName: results.Name.split(',')[1],
              lastName: results.Name.split(',')[0],
              office: results.Office,
              phone: results.Phone,
              specialization: results.Specialization.split(','),
              title: results.Title
            };

        // Resolves $q.defer() and returns data promise
        deferred.resolve(data);
        return deferred.promise;
    }, function(error) {
        deferred.reject(error);
        return deferred.promise;
    });
  };

})
.controller("mainController", function($scope, dataService){

  dataService.getData().then(function(response) {
    console.log(response);
    $scope.data = response;
  }, function(error) {
    console.log(error);
  });

});

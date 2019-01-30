angular.module("directory")
.directive("providerList", function() {
  return {
    template: '<div class="people-list" data-ng-include="templateUrl"></div>',
    restrict: 'E',
    replace: true,
    link: function(scope) {
      if(currentPage.indexOf('Center-for-Midwifery.aspx') > -1) {
        scope.templateUrl = 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/directory/clinic-providers/cfm-provider-list-template.txt';
      } else if(currentPage.indexOf('PatientServices/Sheridan') > -1) {
        scope.templateUrl = 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/directory/clinic-providers/sheridan-provider-list-template.txt'
      } else {
        scope.templateUrl = 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/directory/clinic-providers/single-provider-list-template.txt';
      }
    }
  }
})
.directive("providerListItem", function() {
  return {
    templateUrl: 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/directory/clinic-providers/provider-list-item-template.txt',
    restrict: 'E',
    replace: true
  }
})
.filter("clinicKey", function() {

  return function(input, clinicKey, secondKey) {
    var filterMatch = [];

    for(var i = 0; i < input.length; i++) {
      input[i].clinics.forEach(function(elem) {
        if (secondKey && elem.key === secondKey) {
          filterMatch.push(input[i]);
        } else if (elem.key === clinicKey) {
          filterMatch.push(input[i]);
        }
      });
    }

    return filterMatch;

  }

})
.controller("clinicProvidersController", ["$scope", "DirectoryService", function($scope, DirectoryService){
  $scope.dataLoaded = false;
  $scope.loadError = false;
  $scope.people = [];

  // Page must be loaded for SPJS to be available, else CAML query in service will not execute
    // Once page is ready, loadData function called to retrieve info from directory
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  // getData service called to retrieve entries from the directory list
  function loadData() {
    DirectoryService.getDirectory().then(function(response) {
      $scope.people = response;
      $scope.dataLoaded = true;
    }, function(error) {
      $scope.dataLoaded = true;
      $scope.loadError = true;
      console.error(error);
    });
  }

}]);

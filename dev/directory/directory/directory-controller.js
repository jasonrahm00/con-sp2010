angular.module("directory")
.controller("directoryController", ["$scope", "DirectoryService", function($scope, DirectoryService){
  $scope.dataLoaded = false;
  $scope.loadError = false;
  $scope.query = "";
  $scope.people = [];
  $scope.filteredPeople = [];
  $scope.directory = template;

  $scope.clearFilters = function() {
    if ($scope.filteredPeople !== $scope.people) {
      $scope.expertise = null;
      $scope.query = "";
      $scope.filteredPeople = angular.copy($scope.people);
    }
  };

  // Page must be loaded for SPJS to be available, else CAML query in service will not execute
    // Once page is ready, loadData function called to retrieve info from directory
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  // getData service called to retrieve entries from the directory list
  function loadData() {
    DirectoryService.getDirectory().then(function(response) {
      $scope.people = response;
      $scope.filteredPeople = angular.copy($scope.people);
      $scope.dataLoaded = true;
    }, function(error) {
      $scope.dataLoaded = true;
      $scope.loadError = true;
      console.error(error);
    });
  }

}]);

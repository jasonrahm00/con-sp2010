angular.module("directory")
.controller("preceptorController", ["$scope", "DirectoryService", function($scope, DirectoryService){
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
      console.log($scope.people);
      $scope.dataLoaded = true;
    }, function(error) {
      $scope.dataLoaded = true;
      $scope.loadError = true;
      console.error(error);
    });
  }

}]);

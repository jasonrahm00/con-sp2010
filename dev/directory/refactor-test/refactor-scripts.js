angular.module('refactor', ['directoryService'])
.controller('mainController', ['$scope', 'DirectoryService', function($scope, DirectoryService){

  // Page must be loaded for SPJS to be available, else CAML query in service will not execute
    // Once page is ready, loadData function called to retrieve info from directory
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, 'sp.js');
  });

  // getData service called to retrieve entries from the directory list
  function loadData() {
    DirectoryService.getDirectory().then(function(response) {
      console.log(response)
    }, function(error) {
      console.error(error);
    });
  }

}]);
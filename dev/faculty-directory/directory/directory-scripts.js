angular.module("facultyDirectory", [])
.service("dataService", ['$q', function($q) {

}])
.controller("mainController", ['$scope', 'dataService', function($scope, dataService){
  $scope.dataLoaded = true;
}]);

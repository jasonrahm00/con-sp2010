angular.module("news")
.controller("newsroomController", ['$scope', 'NewsService', function($scope, NewsService){

  $scope.data;
  $scope.dataLoaded = false;
  $scope.loadError = false;

  // Document has to be ready before SPJS can be called and CAML query executed
    // Once SPJS is available, load data is triggered which queries newsService and dataService
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  function loadData() {

    // Get news
      // Executes getNews function in the newsService
      // Takes current page URL as dependency
      // Expects object array containing all news articles that have the faculty member's bio page url assigned to Faculty Pages field
    NewsService.getNews(currentPage).then(function(response) {
      console.log(response);
    }, function(error) {
      console.log(error);
    });

  }

}]);

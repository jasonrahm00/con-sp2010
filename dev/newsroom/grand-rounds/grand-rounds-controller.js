angular.module("news")
.filter("renderHTMLCorrectly", ['$sce', function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
}])
.controller("newsroomController", ['$scope', 'NewsService', function($scope, NewsService){

  $scope.data;
  $scope.dataLoaded = false;
  $scope.loadError = false;

  // Document has to be ready before SPJS can be called and CAML query executed
    // Once SPJS is available, load data is triggered which queries newsService
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  function loadData() {

    // Get news
    NewsService.getNews().then(function(response) {
      var filteredNews = [];
      response.forEach(function(elem) {
        if(filteredNews.length < 13 && elem.category.indexOf('grand-rounds') > -1) {
          filteredNews.push(elem);
        }
      });
      $scope.data = filteredNews;
      $scope.dataLoaded = true;
      $scope.loadError = false;
    }, function(error) {
      $scope.dataLoaded = false;
      $scope.loadError = true;
      console.log(error);
    });

    $scope.$watch('data', function() {
      jQuery('.accordion-header').click(function() {
        if($(this).hasClass('active')) {
          $(this).next().slideUp();
          $(this).removeClass('active');
        } else {
          $('.accordion-header').next().slideUp();
          $('.accordion-header').removeClass('active');
          $(this).next().slideDown();
          $(this).addClass('active');
        }
      });

      jQuery('.accordion > div:first-child .accordion-header').addClass('active').next().show();

    });

  }

}]);

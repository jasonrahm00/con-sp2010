var now = Date.now()

function addMonth(x) {
  var y = new Date(x);
  return y.setDate(y.getDate() + 30);
}

angular.module("directory")
.filter("renderHTMLCorrectly", ['$sce', function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
}])
.service("newsService", ['$q', function($q) {
  var listUrl = "/academics/colleges/nursing/about-us/news/",
      listName = "news-items";

  // Executes CAML query on news list taking current url as a dependency
    // All news items are looped through in using While loop
      // Checks each news item to see if current page is in Faculty Pages array
      // If present, news object created with various pieces of data
    // Top six news item in data array returned to controller
  this.getNews = function(currentPage) {
    var deferred = $q.defer(),
        clientContext = new SP.ClientContext(listUrl),
        web = clientContext.get_web(),
        list = web.get_lists().getByTitle(listName),
        items = list.getItems(SP.CamlQuery.createAllItemsQuery());

    clientContext.load(items);
    clientContext.executeQueryAsync(onQuerySucceed, onQueryFail);

    function onQuerySucceed() {
      var data = [],
          itemEnumerator = items.getEnumerator();

      while (itemEnumerator.moveNext()) {

        var item = itemEnumerator.get_current(),
            obj = {},
            facultyArray = item.get_item("Faculty_x0020_Pages") !== null ? item.get_item("Faculty_x0020_Pages").split(",") : null;

        if (facultyArray !== null) {
          facultyArray.forEach(function(elem) {
            elem = elem.replace(/\s+/g, ' ').trim();
            if(currentPage.indexOf(elem) > -1) {
              obj["title"] = item.get_item("Name").get_description();
              obj["link"] = item.get_item("Name").get_url();
              obj["published"] = new Date(item.get_item("Publish_x0020_Date"));
              obj["category"] = item.get_item("Category");
              obj["promoted"] = item.get_item("Promoted");

              data.push(obj);
            }
          });
        }

      }

      data = data.sort(function(a, b) {
        return b.published - a.published;
      });

      deferred.resolve(data.slice(0,7));

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;
  }

}])
.controller("bioController", ['$scope', 'DirectoryService', 'newsService', function($scope, DirectoryService, newsService){

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
    newsService.getNews(currentPage).then(function(response) {

      var x = [];

      response.forEach(function(elem) {
        if (!$scope.promotedNews && elem.promoted && addMonth(elem.published) > now) {
          // News element only added to promoted variable if the following conditions are true
            // There isn't already a promoted item
            // The current item is listed as promoted
            // The item to be promoted was published within the last month
          $scope.promotedNews = elem;
        } else {
          // All other news items are pushed the 'x' array which eventually becomes the main news items
          x.push(elem);
        }
      });

      $scope.news = x;

    }, function(error) {
      console.log(error);
    });

    // Get fac data
      // Sends page template to DirectoryService getDirectory function
      // Expects object array as return, with the first object being the faculty member from the directory
      // Data set is matched by the page url
    DirectoryService.getDirectory().then(function(response) {
      // If check to test whether data was returned from the list
      if (response[0] === undefined) {
        $scope.loadError = true;
        $scope.dataLoaded = false;
        console.error("Unable to retrieve faculty data. Make sure list item exists and page URL field is correct.");
      } else {
        // If test passes, object is assigned to the data variable
          // loadError and dataLoaded booleans changed so loading spinner is removed and faculty info will display
        $scope.data = response[0];
        $scope.loadError = false;
        $scope.dataLoaded = true;
      }
    }, function(error) {
      $scope.dataLoaded = false;
      $scope.loadError = true;
      console.log(error);
    });

  }

}]);

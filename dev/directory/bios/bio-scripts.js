var now = Date.now(),
    currentPage = window.location.href;

function addMonth(x) {
  var y = new Date(x);
  return y.setDate(y.getDate() + 30);
}

function stripSpaces(strng) {
  return strng !== null ? strng.replace(/[\u200B]/g, '') : null;
}

angular.module("facultyBio", [])
.filter("renderHTMLCorrectly", ['$sce', function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
}])
.service("dataService", ['$q', function($q) {

  var listUrl = "/academics/colleges/nursing/faculty-staff/admin/",
      listName = "Directory";

  // Executes CAML query on faculty directory list taking current url as a dependency
    // If current url match Page_URL field in list, data object created with various data points
    // While loop breaks after first match
    // Data object containing faculty bio details returned to controller
  this.getData = function(currentPage) {

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
            obj = {};

        if (item.get_item("Page_URL") && item.get_item("Page_URL").get_url() == currentPage) {
          obj["name"] = {
            "firstName": item.get_item("First_Name"),
            "lastName": item.get_item("Last_Name")
          };
          obj["title"] = item.get_item("Title");
          obj["headshot"] = item.get_item("Profile_Headshot") ? item.get_item("Profile_Headshot").get_url() : null;
          obj["bio"] = stripSpaces(item.get_item("Bio"));
          obj["biosketch"] = item.get_item("Biosketch");
          obj["cv"] = item.get_item("CV");
          obj["degree"] = item.get_item("Degree");
          obj["education"] = stripSpaces(item.get_item("Education"));
          obj["email"] = item.get_item("EMail");
          obj["office"] = item.get_item("Office");
          obj["phone"] = item.get_item("PrimaryNumber");

          obj["specialty"] = (function(x) {
            if (x !== null) {
              return {
                "text": item.get_item("Specialty").get_description(),
                "url": item.get_item("Specialty").get_url()
              }
            } else {
              return {
                "text": '',
                "url": ''
              }
            }
          })(item.get_item("Specialty"));

          obj["clinic"] = (function(x) {
            if (x !== null) {
              return {
                "text": item.get_item("Clinic_x0020_Location").get_description(),
                "url": item.get_item("Clinic_x0020_Location").get_url()
              }
            } else {
              return {
                "text": '',
                "url": ''
              }
            }
          })(item.get_item("Clinic_x0020_Location"));

          obj["awards"] = stripSpaces(item.get_item("Awards"));
          obj["quote"] = stripSpaces(item.get_item("Quote"));
          obj["video"] = (function(x) {
            if (x !== null) {
              return '<iframe width="225" height="126" src="https://www.youtube.com/embed/' + stripSpaces(x) + '?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
            }
          })(item.get_item("Video"))



          data.push(obj);

          break;
        }

      }

      deferred.resolve(data);

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;

  };

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
.controller("mainController", ['$scope', 'dataService', 'newsService', function($scope, dataService, newsService){

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
      // Sends current page to the dataService getData function
      // Expects object array as return, with the first object being the faculty member from the directory
      // Data set is matched by the page url
    dataService.getData(currentPage).then(function(response) {
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

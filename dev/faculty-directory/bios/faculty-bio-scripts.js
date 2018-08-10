var now = Date.now(),
    currentPage = window.location.href;

function addMonth(x) {
  let y = new Date(x);
  return y.setDate(y.getDate() + 30);
}

function stripSpaces(strng) {
  return strng !== null ? strng.replace(/[\u200B]/g, '') : null;
}

angular.module("facultyBio", [])
.filter("renderHTMLCorrectly", function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
})
.service("dataService", function($q) {

  var listUrl = "/academics/colleges/nursing/faculty-staff/faculty/",
      listName = "Faculty";

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

        if (item.get_item("Name").get_url() == currentPage) {
          obj["page"] = item.get_item("Name").get_url();
          obj["name"] = {
            "firstName": item.get_item("Name").get_description().split(',')[1],
            "lastName": item.get_item("Name").get_description().split(',')[0]
          };
          obj["title"] = item.get_item("Title");
          obj["headshot"] = item.get_item("Headshot");
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

})
.service("newsService", function($q) {
  var listUrl = "/academics/colleges/nursing/about-us/news/",
      listName = "news-items";

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

})
.controller("mainController", function($scope, dataService, newsService){

  $scope.data;
  $scope.dataLoaded = false;
  $scope.loadError = false;

  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  function loadData() {

    // Get fac data
    dataService.getData(currentPage).then(function(response) {
      $scope.data = response[0];
    }, function(error) {
      $scope.loadError = true;
      console.log(error);
    });

    // Get news
    newsService.getNews(currentPage).then(function(response) {

      var x = [];

      response.forEach(function(elem) {
        if (!$scope.promotedNews && elem.promoted && addMonth(elem.published) > now) {
          $scope.promotedNews = elem;
        } else {
          x.push(elem);
        }
      });

      $scope.news = x;

      $scope.dataLoaded = true;
      $scope.loadError = false;

    }, function(error) {
      $scope.dataLoaded = false;
      $scope.loadError = true;
      console.log(error);
    });


  }

});

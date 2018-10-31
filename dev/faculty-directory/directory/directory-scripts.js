var currentPage = window.location.href,
    directory = currentPage.indexOf('staff-directory.aspx') > -1 ? 'Staff' : 'Faculty';

angular.module("facultyDirectory", [])
.service("dataService", ['$q', function($q) {
  var listUrl = "/academics/colleges/nursing/faculty-staff/faculty/",
      listName = "Faculty",
      filters = [];

  function getLinkField(x,y) {

    if (x !== null) {

      var linkText = x.get_description(),
          linkUrl = x.get_url();

      if (y === "specialty") {
        if (filters.indexOf(linkText) < 0) {
          filters.push(linkText);
        }
      }

      return {
        "text": linkText,
        "url": linkUrl
      }
    } else {
      return {
        "text": '',
        "url": ''
      }
    }

  }

  this.getData = function() {

    var deferred = $q.defer(),
        clientContext = new SP.ClientContext(listUrl),
        web = clientContext.get_web(),
        list = web.get_lists().getByTitle(listName),
        items = list.getItems(SP.CamlQuery.createAllItemsQuery());

    clientContext.load(items);
    clientContext.executeQueryAsync(onQuerySucceed, onQueryFail);

    function onQuerySucceed() {
      filters = [];

      var data = {
            "expertiseFilters": [],
            "people": []
          },
          itemEnumerator = items.getEnumerator();

      while (itemEnumerator.moveNext()) {
        var item = itemEnumerator.get_current(),
            obj = {};

        if (item.get_item("Hidden") !== true) {

          var listPresence = item.get_item("List_Presence");

          if (listPresence.indexOf(directory) > -1) {
            obj["page"] = item.get_item("Page_URL") ? item.get_item("Page_URL").get_url() : null;
            obj["name"] = {
              "firstName": item.get_item("First_Name"),
              "lastName": item.get_item("Last_Name")
            };
            obj["title"] = item.get_item("Title");
            obj["headshot"] = item.get_item("Headshot");
            obj["degree"] = item.get_item("Degree");
            obj["email"] = item.get_item("EMail");
            obj["office"] = item.get_item("Office");
            obj["phone"] = item.get_item("PrimaryNumber") == "N/A" ? undefined : item.get_item("PrimaryNumber");
            obj["hidden"] = item.get_item("Hidden");

            obj["specialty"] = getLinkField(item.get_item("Specialty"), "specialty");

            obj["clinic"] = getLinkField(item.get_item("Clinic_x0020_Location"), null);

            obj["listPresence"] = listPresence;

            data.people.push(obj);
          }
        }
      }

      data.people = data.people.sort(function(a, b) {
        if (a.name.lastName < b.name.lastName)
          return -1;
        if (a.name.lastName > b.name.lastName)
          return 1;
        return 0;
      });

      data.expertiseFilters = filters.sort();

      console.log(data);
      deferred.resolve(data);

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;

  };

}])
.controller("mainController", ['$scope', 'dataService', function($scope, dataService){
  $scope.dataLoaded = false;
  $scope.loadError = false;
  $scope.expertise = null;
  $scope.query = "";
  $scope.people = [];
  $scope.filteredPeople = [];
  $scope.directory = directory;

  $scope.clearFilters = function() {
    if ($scope.filteredPeople !== $scope.people) {
      $scope.expertise = null;
      $scope.query = "";
      $scope.filteredPeople = angular.copy($scope.people);
    }
  };

  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  function loadData() {
    dataService.getData().then(function(response) {
      $scope.expertiseFilters = response.expertiseFilters;
      $scope.people = response.people;
      $scope.filteredPeople = angular.copy($scope.people);
      $scope.dataLoaded = true;
    }, function(error) {
      $scope.dataLoaded = true;
      $scope.loadError = true;
      console.error(error);
    });
  }

  $scope.$watch("expertise", function(newVal, oldVal) {
    if(newVal !== oldVal) {
      var filteredPeople = [];
      $scope.people.forEach(function(elem, index) {
        if(elem.specialty.text === newVal)
          filteredPeople.push(elem);
      });
      if (filteredPeople.length > 0) {
        $scope.filteredPeople = filteredPeople;
      }

    }
  });

}]);

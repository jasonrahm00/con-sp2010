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

  // Executes CAML query on directory list returning an object array of faculty/staff members
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

      // While loop runs as long as there is another entry on the list
      while (itemEnumerator.moveNext()) {
        var item = itemEnumerator.get_current(),
            obj = {};

        if (item.get_item("Hidden") !== true) {

          // listPresence is an array that is used to determine which list the person should be displayed on
            // "Faculty" and "Staff" are the only two choice
              // The field is multiple choice as people can be listed in both directories
          var listPresence = item.get_item("List_Presence");

          // Directory variable examines current URL to determine if the app is on the staff directory
            // If current list entry is supposed to show up on the current directory as determined by the page URL
              // Person object created with various data points and pushed into data.people array
          if (listPresence.indexOf(directory) > -1) {
            obj["page"] = item.get_item("Page_URL") ? item.get_item("Page_URL").get_url() : null;
            obj["name"] = {
              "firstName": item.get_item("First_Name"),
              "lastName": item.get_item("Last_Name")
            };
            obj["title"] = item.get_item("Title");
            obj["headshot"] = item.get_item("Profile_Headshot") ? item.get_item("Profile_Headshot").get_url() : null;
            obj["degree"] = item.get_item("Degree");
            obj["email"] = item.get_item("EMail");
            obj["office"] = item.get_item("Office");
            obj["phone"] = item.get_item("PrimaryNumber") == "N/A" ? undefined : item.get_item("PrimaryNumber");
            obj["hidden"] = item.get_item("Hidden");

            obj["specialty"] = getLinkField(item.get_item("Specialty"), "specialty");

            obj["clinic"] = getLinkField(item.get_item("Clinic_x0020_Location"), null);

            data.people.push(obj);
          }
        }
      }

      // People array sorted alphabetically by last name then returned to controller
      data.people = data.people.sort(function(a, b) {
        if (a.name.lastName < b.name.lastName)
          return -1;
        if (a.name.lastName > b.name.lastName)
          return 1;
        return 0;
      });

      data.expertiseFilters = filters.sort();

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

  // Page must be loaded for SPJS to be available, else CAML query in service will not execute
    // Once page is ready, loadData function called to retrieve info from directory
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  // getData service called to retrieve entries from the directory list
  function loadData() {
    dataService.getData().then(function(response) {
      // expertiseFilters field used to populate expertise dropdown filter in DOM
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

  // Watcher established to detect changes in the "expertise" model
    // If there are changes, list is filtered and DOM is updated
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

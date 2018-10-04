var sortOrder = {
  "degree": [
    "Bachelor's",
    "Master's",
    "DNP",
    "PhD",
    "Graduate Certificate",
    "Post-Graduate Certificate",
    "Non-Degree"
  ],
  "level": [
    "Some College",
    "Associate's Degree",
    "Associate's Degree in Nursing",
    "RN (ADN) License",
    "Non-Nursing Bachelor's",
    "ADN and Non-Nursing Bachelor's",
    "RN (ADN) License and Bachelor's",
    "Nursing Bachelor's",
    "BSN and Advanced Degree",
    "Nursing Master's"
  ],
  "pathway": [
    "Post BS Master's",
    "BS to DNP",
    "Post-Graduate DNP",
    "Post-Bachelor's BS-PhD",
    "Post-Bachelor’s MS-PhD",
    "Post-Master’s PhD"
  ]
};

var sortObj = {};

sortOrder["degree"].forEach(function(value, index) {
  sortObj[value] = index;
});

angular.module("programFinder", [])
.filter("filterOrder", function() {

  return function(arr, strng) {
    return sortOrder[strng];
  }

})
.directive("filterGroup", function() {
  return {
    scope: {
      index: '@',
      label: '@',
      groupString: '@',
      inputValue: '=',
      count: '@',
      selectedInput: '@',
      disableInput: '='
    },
    templateUrl: "http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/program-finder/filter-group-template.txt",
    restrict: 'E',
    replace: true,
    link: function(scope, elem, attrs) {

      if(attrs.selectedInput !== undefined) {
        scope.$watch('selectedInput', function(newVal, oldVal) {
          if(!newVal || newVal === scope.label) {
            scope.disableInput = false;
          } else {
            scope.disableInput = true;
          }
        });
      }

    }
  }
})
.service("dataService", ['$q', function($q) {
  var listUrl = "/academics/colleges/nursing/programs-admissions/",
      listName = "program-list";

  this.getData = function() {

    var deferred = $q.defer(),
        clientContext = new SP.ClientContext(listUrl),
        web = clientContext.get_web(),
        list = web.get_lists().getByTitle(listName),
        items = list.getItems(SP.CamlQuery.createAllItemsQuery());

    clientContext.load(items);
    clientContext.executeQueryAsync(onQuerySucceed, onQueryFail);

    function onQuerySucceed() {
      var data = {
            "filterGroups": {
              "pathway": [],
              "degree": [],
              "level": [],
              "format": []
            },
            "programs": []
          },
          itemEnumerator = items.getEnumerator();

      function checkPresence(x,y) {
        if(data.filterGroups[x].indexOf(y) < 0) {
          return true;
        } else {
          return false;
        }
      }

      while (itemEnumerator.moveNext()) {
        var item = itemEnumerator.get_current(),
            obj = {};

        obj["page"] = item.get_item("Page_x0020_URL");
        obj["name"] = item.get_item("Title");
        obj["format"] = item.get_item("Learing_x0020_Format");
        obj["level"] = item.get_item("Current_x0020_Education_x0020_Le");
        obj["specialty"] = item.get_item("Graduate_x0020_Specialty");
        obj["degree"] = item.get_item("Degree");
        obj["pathway"] = item.get_item("Pathway");
        obj["blurb"] = item.get_item("Blurb");
        obj["levelOverride"] = item.get_item("Entry_x0020_Deg_x0020_Override");

        angular.forEach(obj, function(value, key) {
          if (data.filterGroups[key] && value !== null) {
            if(Array.isArray(value)) {
              for(var i = 0; i < value.length; i++) {
                if(checkPresence(key, value[i])) {
                  data.filterGroups[key].push(value[i]);
                }
              }
            } else if (checkPresence(key, value)) {
              data.filterGroups[key].push(value);
            } else {
              return;
            }
          }
        });

        data.programs.push(obj);

      }

      data.programs = data.programs.sort(function(a,b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      deferred.resolve(data);

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;
  }

}])
.controller("mainController", ['$scope', 'dataService', function($scope, dataService){

  $scope.filteredPrograms = [];
  $scope.programs = [];
  $scope.dataLoaded = false;
  $scope.loadError = false;



  /****************************************************************
    Loading Data
  ****************************************************************/

  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(getData, "sp.js");
  });

  function getData() {
    dataService.getData().then(function(response) {
      $scope.programs = response.programs;
      $scope.degreeGroup = response.filterGroups.degree;
      $scope.formatGroup = response.filterGroups.format;
      $scope.levelGroup = response.filterGroups.level;
      $scope.pathwayGroup = response.filterGroups.pathway;
      $scope.dataLoaded = true;
      $scope.loadError = false;
    }, function(err) {
      $scope.dataLoaded = false;
      $scope.loadError = true;
      console.error(err);
    });
  }



  /****************************************************************
    Filtering
  ****************************************************************/

  $scope.disableCheck = function(x) {
    console.log(x);
    return false;
  }

  $scope.useDegree = {};
  $scope.useFormat = {};
  $scope.useLevel = {};
  $scope.usePathway = {};

  $scope.resetResults = function() {
    if ($scope.filteredPrograms !== $scope.programs) {
      $scope.filteredPrograms = $scope.programs;
      $scope.useDegree = {};
      $scope.useFormat = {};
      $scope.useLevel = {};
      $scope.usePathway = {};
    }
  };

  $scope.count = function (prop, value) {
    return function (el) {
      return el[prop] !== null ? el[prop].indexOf(value) > -1 : '';
    };

  };

  $scope.selectedDegree = null;
  $scope.selectedLevel = null;

  $scope.$watch(function () {
    return {
      programs: $scope.programs,
      useDegree: $scope.useDegree,
      useFormat: $scope.useFormat,
      useLevel: $scope.useLevel,
      usePathway: $scope.usePathway
    }
  }, function (value) {
      var selected;

      var filterAfterDegree = [];
      selected = false;
      for (var j in $scope.programs) {
        var p = $scope.programs[j];
        for (var i in $scope.useDegree) {
          if ($scope.useDegree[i]) {
            selected = true;
            // If check to allow for up to two degrees per program
              // If more than two, refactor into a loop
            if (i == p.degree[0] || i == p.degree[1]) {
              filterAfterDegree.push(p);
              break;
            }
          }
        }
      }

      if (selected) {
        angular.forEach($scope.useDegree, function(value, key) {
          if(value === true) {
            $scope.selectedDegree = key;
          }
        });
      } else {
        $scope.selectedDegree = null;
        filterAfterDegree = $scope.programs;
      }

      var filterAfterFormat = [];
      selected = false;
      for (var j in filterAfterDegree) {
        var p = filterAfterDegree[j];
        for (var i in $scope.useFormat) {
          if ($scope.useFormat[i]) {
            selected = true;
            if (i == p.format) {
              filterAfterFormat.push(p);
              break;
            }
          }
        }
      }
      if (!selected) {
        filterAfterFormat = filterAfterDegree;
      }

      var filterAfterLevel = [];
      selected = false;
      for (var j in filterAfterFormat) {
        var p = filterAfterFormat[j];
        for (var i in $scope.useLevel) {
          if ($scope.useLevel[i] && p.level) {
            selected = true;
            if (i == p.level[0] || i == p.level[1]) {
              filterAfterLevel.push(p);
              break;
            }
          }
        }
      }

      if (selected) {
        angular.forEach($scope.useLevel, function(value, key) {
          if(value === true) {
            $scope.selectedLevel = key;
          }
        });
      } else {
        $scope.selectedLevel = null;
        filterAfterLevel = filterAfterFormat;
      }

      var filterAfterPathway = [];
      selected = false;
      for (var j in filterAfterLevel) {
        var p = filterAfterLevel[j];
        for (var i in $scope.usePathway) {
          if ($scope.usePathway[i]) {
            selected = true;
            if (i == p.pathway) {
              filterAfterPathway.push(p);
              break;
            }
          }
        }
      }
      if (!selected) {
        filterAfterPathway = filterAfterLevel;
      }

      $scope.filteredPrograms = filterAfterPathway;
  }, true);

}]);

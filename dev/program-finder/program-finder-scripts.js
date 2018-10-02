var degreeOrder = [
        "Bachelor's",
        "Master's",
        "DNP",
        "PhD",
        "Graduate Certificate",
        "Post-Graduate Certificate",
        "Non-Degree"
      ],
      levelOrder = [
        "High School Diploma",
        "RN (ADN) License",
        "Nursing Bachelor's",
        "Non-Nursing Bachelor's",
        "Nursing Master's",
        "Non-Nursing Master's"
      ];

function compare(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

angular.module("programFinder", [])
.filter("filterOrder", function() {

  return function(arr, strng) {
    if (arr.length > 0) {
      if (strng === "degree") {
        return degreeOrder;
      } else if (strng === "level") {
        return levelOrder;
      } else {
        return arr.sort();
      }
    }
  }

})
.directive("filterGroup", function() {
  return {
    scope: {
      index: '@',
      label: '=',
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

      if(scope.groupString === 'degree') {
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
.service("dataService", function($q) {
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
      var data = [],
          itemEnumerator = items.getEnumerator();

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

        data.push(obj);

      }

      data.sort(compare);

      deferred.resolve(data);

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;
  }

})
.controller("mainController", function($scope, dataService){

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
      $scope.programs = response;
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

  /*

    checkbox with radio button functionality
        http://jsfiddle.net/ivangrs/5HdcG/

    disable other options when one selected???
        http://jsfiddle.net/HWa2m/287/

  */

  var uniqueItems = function (data, key) {
    var result = [];

    function resultCheck(x) {
      if (result.indexOf(x) == -1) {
        result.push(x);
      }
    }

    for (var i = 0; i < data.length; i++) {
      var value = data[i][key];

      if(Array.isArray(value)) {
        for (var j = 0; j < value.length; j++) {
          resultCheck(value[j]);
        }
      } else {
        resultCheck(value);
      }

    }
    return result;
  };

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

  $scope.selectedInput = null;

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

      $scope.degreeGroup = uniqueItems($scope.programs, 'degree');
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
            $scope.selectedInput = key;
          }
        });
      } else {
        $scope.selectedInput = null;
        filterAfterDegree = $scope.programs;
      }

      $scope.formatGroup = uniqueItems($scope.programs, 'format');
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

      $scope.levelGroup = uniqueItems($scope.programs, 'level');
      var filterAfterLevel = [];
      selected = false;
      for (var j in filterAfterFormat) {
        var p = filterAfterFormat[j];
        for (var i in $scope.useLevel) {
          if ($scope.useLevel[i]) {
            selected = true;
            if (i == p.level) {
              filterAfterLevel.push(p);
              break;
            }
          }
        }
      }
      if (!selected) {
        filterAfterLevel = filterAfterFormat;
      }

      $scope.pathwayGroup = uniqueItems($scope.programs, 'pathway');
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

});

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
    "Nursing Bachelor's and Active RN License",
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

var categories = [
  {
    "name": "Bachelor’s Degree",
    "description": "Gain entry into the nursing field with a bachelor’s degree. Applicants must have at least an associate’s degree or be on their way towards an associate’s degree.",
    "count": 0
  },
  {
    "name": "Master's Degree",
    "description": "Choose a specialty field in which to gain a master’s degree. Applicants must have a nursing bachelor’s and an active nursing license.",
    "count": 0
  },
  {
    "name": "BS to DNP Pathway",
    "description": "This option provides applicants with a bachelor’s degree a pathway to the DNP, and they earn a master’s degree along the way. After earning the master’s degree, students have a year to begin the DNP coursework without having to reapply to the college.",
    "count": 0
  },
  {
    "name": "Post-Graduate DNP Pathway",
    "description": "Applicants who already have a master’s degree and who want a DNP have several options from which to choose.",
    "count": 0
  },
  {
    "name": "DNP/MPH",
    "description": "Applicants with at least a bachelor’s degree in nursing can earn a DNP and Master’s of Public Health with this option.",
    "count": 0
  },
  {
    "name": "Post-Bachelor's BS-PhD Pathway",
    "description": "This option offers direct admission to the PhD program for applicants who already hold a bachelor’s degree in nursing. Completion of the GRE is required as well.",
    "count": 0
  },
  {
    "name": "Post-Bachelor’s MS-PhD Pathway",
    "description": "This pathway offers a 30-credit MS degree (or an advanced practice specialty) leading into PhD coursework and research.",
    "count": 0
  },
  {
    "name": "Post-Master’s PhD Pathway",
    "description": "This option is designed for applicants who already hold a master’s degree in nursing. Two to three years of post-master’s doctoral course work leads to the PhD dissertation and PhD degree.",
    "count": 0
  },
  {
    "name": "Graduate Certificate",
    "description": "Graduate-level certificates consist of academic credit offerings focused on a specialized area of study with defined outcomes. They are designed to provide extended study education to graduate-level and post-graduate-level professionals.",
    "count": 0
  },
  {
    "name": "Post-Graduate Certificate",
    "description": "Students who hold at least a master’s degree in nursing can be certified in another specialty area through the post-graduate certification program.",
    "count": 0
  },
  {
    "name": "Non-Degree",
    "description": "",
    "count": 0
  }
];

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
    templateUrl: 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/program-finder/filter-group-template.txt',
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
.directive("tooltip", function() {
  return {
    scope: {
      text: '@'
    },
    replace: true,
    restrict: 'E',
    templateUrl: 'http://www.ucdenver.edu/academics/colleges/nursing/Documents/Styles_Scripts/program-finder/pathway-tooltip-template.txt',
    link: function(scope, elem, attrs) {

      var contentBox = $(elem).children('.tooltip-content'),
          trigger = $(elem).children('.tooltip-trigger');

      $(trigger).click(function() {
        var topPosition = ($(contentBox).outerHeight() * 0.5) + ($(trigger).height());
        $(contentBox).css({
          'top': '-' + topPosition + 'px'
        });

        $(contentBox).toggleClass('active');

      });

      $(contentBox).children('.close').click(function() {
        $(contentBox).removeClass('active');
      });

    }
  }
})
.service("dataService", ['$q', function($q) {
  var listUrl = "/academics/colleges/nursing/programs-admissions/",
      listName = "program-list";

  // Retrieves items from Sharepoint list
    // Each item becomes a program object

  // Additional logic is used to build out filter groups based on the data in the fields
    // Filter inputs are not static, so they're easier to change and update
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
        obj["category"] = item.get_item("Category");

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

  // Once page is loaded and SPJS is available, getData function triggers
  jQuery(document).ready(function() {
    ExecuteOrDelayUntilScriptLoaded(getData, "sp.js");
  });

  // Call getData function in the dataService
    // Service returns program list and filter groups
  function getData() {
    dataService.getData().then(function(response) {
      $scope.programs = response.programs;
      $scope.degreeGroup = response.filterGroups.degree;
      $scope.formatGroup = response.filterGroups.format;
      $scope.levelGroup = response.filterGroups.level;
      $scope.dataLoaded = true;
      $scope.loadError = false;
    }, function(err) {
      $scope.dataLoaded = false;
      $scope.loadError = true;
      console.error(err);
    });
  }

  // Click event used to control tooltips
  $(document).click(function(event) {
    var clickTarget = $(event.target);
    if($(clickTarget).hasClass('tooltip-trigger') || $(clickTarget).hasClass('tooltip-content') || $(clickTarget).parents().hasClass('tooltip-content')) {
      return;
    } else {
      $('.tooltip-content').removeClass('active');
    }
  });



  /****************************************************************
    Filtering
  ****************************************************************/

  $scope.useDegree = {};
  $scope.useFormat = {};
  $scope.useLevel = {};

  // Resets all fitlers to empty objects, so programs are displayed on page
  $scope.resetResults = function() {
    if ($scope.filteredPrograms !== $scope.programs) {
      $scope.filteredPrograms = $scope.programs;
      $scope.useDegree = {};
      $scope.useFormat = {};
      $scope.useLevel = {};
    }
  };

  // Count filter used to conditionally activate/deactivate filter inputs
  $scope.count = function (prop, value) {
    return function (el) {
      return el[prop] !== null ? el[prop].indexOf(value) > -1 : '';
    };
  };

  $scope.selectedDegree = null;
  $scope.selectedLevel = null;

  // Watcher that keeps an eye on the filter objects
    // If there's a change, the filters are run to remove un-matched results
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
            // If check to allow for multiple degree outcomes for a program
            if (p.degree.indexOf(i) > -1) {
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
            if (p.level.indexOf(i) > -1) {
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

      $scope.filteredPrograms = filterAfterLevel;

      $scope.categories = angular.copy(categories);

      $scope.filteredPrograms.forEach(function(elem) {
        for(var i = 0; i < $scope.categories.length; i++) {
          if($scope.categories[i].name === elem.category) {
            $scope.categories[i].count += 1;
          }
        }
      });

  }, true);

}]);

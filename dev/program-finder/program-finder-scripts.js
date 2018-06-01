var dataLoaded = false,
    programs = [];

/*******************************************************************

  Load data from in-page table using jQuery

*******************************************************************/

$(document).ready(function() {

  /*******************************************************************
    Initial Variable Declarations
  *******************************************************************/

  var dataLoadError = false,
      tableRows = $("table[summary='program-list '] tr").not($("table[summary='program-list '] tr.ms-viewheadertr.ms-vhltr"));

  /*******************************************************************
    Load Data and Build Components
  *******************************************************************/

  //Returns an object with data loaded from the table cells
  function getData(tableRow) {
    return {
      name: tableRow.children[0].innerText,
      url: tableRow.children[1].innerText,
      degree: tableRow.children[2].innerText,
      format: tableRow.children[3].innerText,
      level: tableRow.children[4].innerText,
      specialty: tableRow.children[5].innerText
    }
  }

  try {
    getData(tableRows[0]);
  }
  catch(err) {
    dataLoadError = true;
    console.log(err);
  }

  //Remove duplicates from array
    //https://gist.github.com/Vheissu/71dd683ad647e82a0d132076cf6eeef2#file-duplicate-remover-js
  function removeDuplicates (array, keyToCompare) {

    let listOfValuesForKeyToCompare = array.map(object => object[keyToCompare]);

    let arrayWithoutDuplicates = array.filter( (object, index, array) => {

      if ( listOfValuesForKeyToCompare.indexOf(object[keyToCompare]) === index ) {
        return true; // Keep it. No other object with the same value for this key exists.
      }
      else {
        return false; // Filter it out. There's another object in the list with the same value for this key.
      }

    });

    return arrayWithoutDuplicates;
  }

  /********************* Initial Build Function *********************/

  if(!dataLoadError) {
    $.each(tableRows, function(index, value) {
      var data = getData(value);

      //Push data into programs array
      programs.push(data);
    });
    programs = removeDuplicates(programs, 'name');
    $("#dataTable").remove();
    dataLoaded = true;
  }

});



/*******************************************************************

  Create app with AngularJS

*******************************************************************/

angular.module("programFinder", ["ngAnimate"])
.controller("mainController", function($scope){
  $scope.programs = programs;
  $scope.filteredPrograms;

  var uniqueItems = function (data, key) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
      var value = data[i][key];

      if (result.indexOf(value) == -1) {
        result.push(value);
      }

    }
    return result;
  };

  $scope.useDegree = {};
  $scope.useFormat = {};
  $scope.useLevel = {};
  $scope.useSpecialty = {};

  $scope.$watch(function () {
    return {
      programs: $scope.programs,
      useDegree: $scope.useDegree,
      useFormat: $scope.useFormat,
      useSpecialty: $scope.useSpecialty,
      useLevel: $scope.useLevel
    }
  }, function (value) {
      var selected;

      $scope.count = function (prop, value) {
        return function (el) {
          return el[prop] == value;
        };
      };

      $scope.degreeGroup = uniqueItems($scope.programs, 'degree');
      var filterAfterDegree = [];
      selected = false;
      for (var j in $scope.programs) {
        var p = $scope.programs[j];
        for (var i in $scope.useDegree) {
          if ($scope.useDegree[i]) {
            selected = true;
            if (i == p.degree) {
              filterAfterDegree.push(p);
              break;
            }
          }
        }
      }
      if (!selected) {
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

      $scope.specialtyGroup = uniqueItems($scope.programs, 'specialty');
      var filterAfterSpecialty = [];
      selected = false;
      for (var j in filterAfterLevel) {
        var p = filterAfterLevel[j];
        for (var i in $scope.useSpecialty) {
          if ($scope.useSpecialty[i]) {
            selected = true;
            if (i == p.specialty) {
              filterAfterSpecialty.push(p);
              break;
            }
          }
        }
      }
      if (!selected) {
        filterAfterSpecialty = filterAfterLevel;
      }


      $scope.filteredPrograms = filterAfterSpecialty;
  }, true);

});

/*********** Unhide components After Initial Build ***********/

$(document).ready(function() {
  if(dataLoaded) {
    $("#loadingMessage").remove();
    $("#visWrapper").show();
  }
});

var dataLoaded = false,
    programs = [];

// Load data from in-page table using jQuery
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
      format: tableRow.children[3].innerText
    }
  }

  try {
    getData(tableRows[0]);
  }
  catch(err) {
    dataLoadError = true;
    console.log(err);
  }

  /********************* Initial Build Function *********************/

  if(!dataLoadError) {
    $.each(tableRows, function(index, value) {
      var data = getData(value);

      //Push data into programs array
      programs.push(data);
    });
    dataLoaded = true;
  }

  /*********** Unhide components After Initial Build ***********/

  if(dataLoaded) {
    $("#loadingMessage").remove();
    $("#visWrapper").show();
  }

});

// Create app with AngularJS
angular.module("programFinder", [])
.controller("mainController", function($scope){
  $scope.programs = programs;
  console.log($scope.programs);


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

  $scope.$watch(function () {
    return {
      programs: $scope.programs,
      useDegree: $scope.useDegree,
      useFormat: $scope.useFormat
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

      $scope.filteredPrograms = filterAfterFormat;
  }, true);

});


var defaultFaculty = {
  bio: "<div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac fringilla orci. Fusce at ornare mi, sed vestibulum nibh. Etiam efficitur libero at lorem semper, in suscipit justo vehicula. Phasellus sollicitudin metus volutpat sem sodales posuere. Cras commodo commodo augue, eget mollis dolor lobortis ac. Sed imperdiet dui non leo fermentum pretium. In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean dui tellus, tempor at bibendum vitae, tempus id felis. Donec condimentum id orci ut ornare. Nunc eu ligula tincidunt, rhoncus tortor eu, condimentum turpis. Nam dictum mollis suscipit. Praesent orci nunc, pharetra sit amet blandit quis, dapibus ut mi. Quisque vel varius arcu. Integer ultrices hendrerit neque, nec blandit quam elementum quis.</p><p>Sed eget ex quis enim ultrices rutrum. Sed dolor orci, efficitur in vulputate at, tincidunt vitae leo. Phasellus in rhoncus ligula. Nunc blandit viverra facilisis. Curabitur eget vehicula elit. Integer eget velit elit. Aliquam viverra nisi est, sit amet rutrum nisi convallis nec. Duis eget fermentum ex, sit amet maximus est. Praesent eleifend dolor ac bibendum rutrum. Mauris tristique eu enim sed semper. Morbi ac pharetra elit. In in tempor lacus. Mauris porttitor interdum bibendum. Aenean et felis consequat, consectetur ex at, sollicitudin diam. Nullam tempor aliquam nisi, et pretium risus lacinia et.</p><p>Donec semper accumsan ligula a dapibus. Sed vitae finibus mauris, et porta tellus. Nullam sagittis, tortor in ultrices suscipit, ligula orci aliquet augue, id varius lorem libero eget felis. Aliquam at augue augue. Pellentesque pulvinar sed magna vitae aliquet. Nullam sed erat est. Vivamus congue odio id ex auctor faucibus. Vestibulum posuere viverra ornare. Donec vitae lobortis massa, ut suscipit risus. Suspendisse commodo facilisis orci, et commodo risus posuere sit amet. Etiam interdum purus elit, auctor scelerisque ante sodales a. Integer sit amet nulla ipsum. Sed facilisis orci ex, varius scelerisque arcu iaculis et.</p><p>Cras id est eu turpis pellentesque gravida id vel elit. Quisque bibendum est non bibendum convallis. Sed egestas risus vel elit hendrerit dapibus. Aliquam et fermentum neque. Aliquam lacinia auctor lorem eget laoreet. Integer vel magna neque. Proin ex eros, tempor ut est et, tincidunt auctor sapien. Morbi in fermentum ex. Vivamus at lorem ut diam dictum tempor. Pellentesque odio dolor, ullamcorper et tortor ac, luctus commodo lorem. Praesent id diam eget orci facilisis hendrerit. Nunc porttitor ligula ac arcu facilisis euismod. Morbi mattis leo et nisl cursus, eget lacinia diam semper. Donec dapibus porttitor lorem, eget luctus ipsum luctus non. Donec ut tellus vel purus rutrum viverra at nec sapien. Duis tempor, mi sed ornare interdum, magna ex porttitor neque, fermentum convallis dolor mauris nec elit.</p><p>In ornare augue ut nisi faucibus, posuere dictum leo mollis. Duis pretium diam et feugiat molestie. Aenean vel nibh consequat, posuere mauris ac, rutrum risus. Praesent sit amet justo eleifend, ullamcorper eros vel, accumsan ligula. Mauris sodales mollis massa. Aenean molestie eros nec gravida eleifend. In sed nisi consequat, pellentesque justo cursus, facilisis tellus. Integer tristique massa id consequat posuere. Vestibulum eget finibus.</p></div>",
  biosketch: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Documents/cv-sample.pdf",
  awards: "<ul><li>Being Awesome Award, 2018</li><li>Excellence in Teaching, 2017</li><li>Getting Stuff Done Award, 2015</li></ul>",
  cv: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Documents/cv-sample.pdf",
  degree: "PhD, MS",
  education: "<ul><li>PhD, Harvard</li><li>MS, Yale</li><li>BSN, CU Boulder</li></ul>",
  email: "somewhere@email.com",
  headshot: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/PublishingImages/default-profile.png",
  name: "Faculty, Fred",
  office: "12345",
  page: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Pages/fred-faculty.aspx",
  phone: "555-555-5555",
  specialty: "<ul><li><a href='http://www.ucdenver.edu/academics/colleges/nursing/programs-admissions/graduate-programs/graduate-specialties/healthcareinformatics/Pages/default.aspx'>Health Care Informatics</a></li><li>Research</li></ul>",
  title: "Assistant Professor",
  quote: "An important extract from the bio. Or something this faculty member has said that is memorable and life-changing.",
  video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/O6-0QmxYotU?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
  firstName: "Fred",
  lastName: "Faculty"
};

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
          obj["name"] = item.get_item("Name").get_description();
          obj["firstName"] = item.get_item("Name").get_description().split(',')[1];
          obj["lastName"] = item.get_item("Name").get_description().split(',')[0];
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
          obj["specialty"] = stripSpaces(item.get_item("Specialty"));
          obj["awards"] = stripSpaces(item.get_item("Awards"));
          obj["quote"] = stripSpaces(item.get_item("Quote"));
          obj["video"] = stripSpaces(item.get_item("Video"));

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

      deferred.resolve(data);

    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;
  }

})
.controller("mainController", function($scope, dataService, newsService){

  $scope.faculty = "default";
  $scope.currentPage = window.location.href;
  $scope.data;

  jQuery(document).ready(function($) {
    if ($scope.faculty === "default") {
      $scope.data = defaultFaculty;
    } else {
      ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
    }
  });

  function loadData() {

    // Get fac data
    dataService.getData($scope.currentPage).then(function(response) {
      $scope.data = response[0];
    }, function(error) {
      console.log(error);
    });

    // Get news
    newsService.getNews($scope.currentPage).then(function(response) {

      var x = [];

      response.forEach(function(elem) {
        if (elem.promoted && !$scope.promotedNews) {
          $scope.promotedNews = elem;
        } else {
          x.push(elem);
        }
      });

      $scope.news = x;

    }, function(error) {
      console.log(error);
    }) ;


  }

  $scope.$watch("faculty", function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data = [];
      $scope.news = null;
      $scope.promotedNews = null;

      if (newVal === 'default') {
        $scope.currentPage = window.location.href;
        $scope.data = defaultFaculty;
      } else {
        $scope.currentPage = newVal;
        loadData();
      }


    }
  });

  // Elements to add for testing and demo
  $scope.quote = defaultFaculty.quote;
  $scope.video = defaultFaculty.video;
  $scope.components = "none";

});

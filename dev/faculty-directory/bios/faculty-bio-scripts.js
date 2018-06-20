var defaultFaculty = {
  bio: "<div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</p><p>Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.</p></div>",
  biosketch: "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Documents/cv-sample.pdf",
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
  title: "Assistant Professor"
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
.service("dataService", function($http, $q){

  "use strict";

  this.getData = function(queryObj) {

    var deferred = $q.defer(),
        clientContext = new SP.ClientContext(queryObj.listUl),
        web = clientContext.get_web(),
        list = web.get_lists().getByTitle(queryObj.listName);

    var items = list.getItems(SP.CamlQuery.createAllItemsQuery());

    clientContext.load(items);
    clientContext.executeQueryAsync(onQuerySucceed, onQueryFail);

    function onQuerySucceed() {
      var data = [],
          itemEnumerator = items.getEnumerator();

      while (itemEnumerator.moveNext()) {
        var item = itemEnumerator.get_current(),
            obj = {};

        if (item.get_item("Name").get_url() == queryObj.currentPage) {
          obj["page"] = item.get_item("Name").get_url();
          obj["name"] = item.get_item("Name").get_description();
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
.controller("mainController", function($scope, dataService){

  $scope.currentPage = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Pages/m_rice.aspx";
  $scope.currentPage = "http://www.ucdenver.edu/academics/colleges/nursing/faculty-staff/faculty/Pages/c_jankowski.aspx";

  var queryObj = {
        listUrl: "/academics/colleges/nursing/faculty-staff/faculty/",
        listName: "Faculty",
        currentPage: $scope.currentPage
      };

  jQuery(document).ready(function($) {
    ExecuteOrDelayUntilScriptLoaded(loadData, "sp.js");
  });

  function loadData() {
    dataService.getData(queryObj).then(function(response) {

      $scope.data = response.length > 0 ? response[0] : defaultFaculty;

    }, function(error) {
      console.log(error);
    })
  }


});

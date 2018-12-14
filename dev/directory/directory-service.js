var currentPage = window.location.href,
    listUrl = "/academics/colleges/nursing/faculty-staff/admin/",
    listName = "Directory",
    template = null;

function stripSpaces(strng) {
  return strng !== null ? strng.replace(/[\u200B]/g, "") : null;
}

function getLinkField(x,y) {

  if (x !== null) {
    return {
      "text": x.get_description(),
      "url": x.get_url()
    }
  } else {
    return {
      "text": "",
      "url": ""
    }
  }
}

(function() {
  if ((currentPage.indexOf("directory.aspx") > -1) || (currentPage.indexOf("staff-directory.aspx") > -1)) {
    template = currentPage.indexOf("staff-directory.aspx") > -1 ? "staff" : "faculty";
  } else if (currentPage.indexOf("nursing/faculty-staff/faculty/Pages") > -1) {
    template = "bio";
  } else  if (currentPage.indexOf("PatientServices") > -1) {
    template = "clinic";
  }
})();

angular.module("directoryService",[]).service("DirectoryService", ["$q", function($q) {

  // Executes CAML query on directory list returning an object array of faculty/staff members
  this.getDirectory = function() {

    var deferred = $q.defer(),
        clientContext = new SP.ClientContext(listUrl),
        web = clientContext.get_web(),
        list = web.get_lists().getByTitle(listName),
        items = list.getItems(SP.CamlQuery.createAllItemsQuery());

    clientContext.load(items);
    clientContext.executeQueryAsync(onQuerySucceed, onQueryFail);

    function onQuerySucceed() {

      var people = [],
          itemEnumerator = items.getEnumerator();

      // While loop runs as long as there is another entry on the list
      while (itemEnumerator.moveNext()) {
        var item = itemEnumerator.get_current(),
            obj = {};

        if (item.get_item("Hidden") !== true) {
          obj["page"] = item.get_item("Page_URL") ? item.get_item("Page_URL").get_url() : null;
          obj["name"] = {
            "firstName": item.get_item("First_Name"),
            "lastName": item.get_item("Last_Name")
          };
          obj["title"] = item.get_item("Title");
          obj["headshot"] = item.get_item("Profile_Headshot") ? item.get_item("Profile_Headshot").get_url() : null;
          obj["bio"] = stripSpaces(item.get_item("Bio"));
          obj["cv"] = item.get_item("CV");
          obj["degree"] = item.get_item("Degree");
          obj["email"] = item.get_item("EMail");
          obj["education"] = stripSpaces(item.get_item("Education"));
          obj["office"] = item.get_item("Office");
          obj["phone"] = item.get_item("PrimaryNumber") == "N/A" ? undefined : item.get_item("PrimaryNumber");
          obj["hidden"] = item.get_item("Hidden");
          obj["specialty"] = getLinkField(item.get_item("Specialty"), "specialty");
          obj["clinic"] = getLinkField(item.get_item("Clinic_x0020_Location"), null);
          obj["awards"] = stripSpaces(item.get_item("Awards"));
          obj["quote"] = stripSpaces(item.get_item("Quote"));
          obj["listPresence"] = item.get_item("List_Presence");
          obj["video"] = (function(x) {
            if (x !== null) {
              return "<iframe width='225' height='126' src='https://www.youtube.com/embed/" + stripSpaces(x) + "?rel=0' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>";
            }
          })(item.get_item("Video"));

          // Before pushing object into people array
            // If check used to filter list items based on passed in pageTemplate value
          if(template === "faculty" || template === "staff") {
            obj.listPresence.forEach(function(elem) {
              if (elem.toLowerCase() === template) {
                people.push(obj);
              }
            })
          } else if (template === "clinic") {
            if (obj.clinic.url === currentPage) {
              people.push(obj);
            }
          } else if (template === "bio") {
            if (obj.page === currentPage) {
              people.push(obj);
            }
          } else {
            continue;
          }

        }
      }

      // People array sorted alphabetically by last name then returned to controller
      if (people.length > 1) {
        people = people.sort(function(a, b) {
          if (a.name.lastName < b.name.lastName)
            return -1;
          if (a.name.lastName > b.name.lastName)
            return 1;
          return 0;
        });
      }

      deferred.resolve(people);
    }

    function onQueryFail() {
      deferred.reject();
    }

    return deferred.promise;

  };
}]);

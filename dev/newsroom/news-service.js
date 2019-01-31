var currentPage = window.location.href;

angular.module("newsService",[]).service("NewsService", ["$q", function($q) {
  var listUrl = "/academics/colleges/nursing/about-us/news/",
      listName = "news-items";

  // Executes CAML query on news list taking current url as a dependency
    // All news items are looped through in using While loop
      // Checks each news item to see if current page is in Faculty Pages array
      // If present, news object created with various pieces of data
    // Top six news item in data array returned to controller
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
            obj = {};

        obj["title"] = item.get_item("Name").get_description();
        obj["link"] = item.get_item("Name").get_url();
        obj["published"] = new Date(item.get_item("Publish_x0020_Date"));
        obj["category"] = item.get_item("Category");
        obj["promoted"] = item.get_item("Promoted");

        data.push(obj);

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

}]);
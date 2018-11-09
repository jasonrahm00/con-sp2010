$(document).ready(function() {

  var adminTables = $('table[summary="Directory "]'),
      tableCount = adminTables.length,
      currentTable = 0;

  function createRowObj(x) {
    var obj = {
      headshot: x[0].innerHTML ? x[0].innerHTML : null,
      lastName: x[1].innerHTML ? x[1].innerHTML : null,
      firstName: x[2].innerHTML ? x[2].innerHTML : null,
      degree: x[3].innerHTML ? x[3].innerHTML : null,
      email: x[4].innerHTML ? x[4].innerHTML : null,
      phone: x[5].innerHTML ? x[5].innerHTML : null,
      title: x[6].innerHTML ? x[6].innerHTML : null
    };

    console.log(obj);
  }

  while (currentTable < tableCount) {
    var tableRows = $(adminTables[currentTable]).find('tr');

    $.each(tableRows, function(index, value) {
      if (index === 0) {
        return;
      } else {
        createRowObj($(value).children())
      }
    })

    currentTable++;
  };

});

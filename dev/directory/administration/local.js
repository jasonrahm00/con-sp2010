$(document).ready(function() {

  var adminTables = $('table[summary="Directory "]'),
      tableCount = adminTables.length,
      currentTable = 0;

  function createRowObj(x) {
    var obj = {
      headshot: x[2].innerHTML ? x[2].innerHTML : null,
      lastName: x[3].innerHTML ? x[3].innerHTML : null,
      firstName: x[4].innerHTML ? x[4].innerHTML : null,
      degree: x[5].innerHTML ? x[5].innerHTML : null,
      email: x[6].innerHTML ? x[6].innerHTML : null,
      phone: x[7].innerHTML ? x[7].innerHTML : null,
      title: x[8].innerHTML ? x[8].innerHTML : null,
      page: x[9].textContent ? x[9].textContent : null
    };
    return(obj);
  }

  function linkToBio(x) {
    if (!x.page) {
      return '<strong>' + x.lastName + ', ' + x.firstName + (x.degree ? ', ' + x.degree : '') + '</strong><br>';
    } else {
      return '<a href="' + x.page + '"><strong>' + x.lastName + ', ' + x.firstName + (x.degree ? ', ' + x.degree : '') + '</strong><span class="page-link"></span></a><br>';
    }
  }

  function createRowContent(x) {
    var rowContent = '<td colspan="1">';
          rowContent += x.headshot ? x.headshot : '';
        rowContent += '</td>';
        rowContent += '<td colspan="3">';
          rowContent += linkToBio(x);
          rowContent += '<span>' + x.title + '</span>';
        rowContent += '</td>';
        rowContent += '<td colspan="3">';
          rowContent += '<ul>';
            rowContent += '<li>Phone: ' + x.phone + '</li>' ;
            rowContent += '<li>Email: ' + x.email + '</li>';
          rowContent += '</ul>';
        rowContent += '</td>';
    return rowContent;
  }

  while (currentTable < tableCount) {
    var tableRows = $(adminTables[currentTable]).find('tr');

    $.each(tableRows, function(index, value) {
      if (index === 0) {
        return;
      } else {
        var person = createRowObj($(value).children());
        $(value).html(createRowContent(person));
        $(value).addClass('directory-row');
      }
    });

    $(adminTables[currentTable]).find('tr.ms-viewheadertr.ms-vhltr').remove();
    $(adminTables[currentTable]).show();

    currentTable++;
  };

});

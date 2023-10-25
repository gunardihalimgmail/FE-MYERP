// $(document).ready(function () {
  $(function(){
    $("#myInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
// });

// $(document).ready(function () {
  // Bind normal buttons
  Ladda.bind(".ladda-button", { timeout: 5000 });
// });

// $(document).ready(function () {
  $(".i-checks").iCheck({
    checkboxClass: "icheckbox_square-green",
  });
// });

// $(document).ready(function () {
  $("#showCheckedRowButton").on('click',function (e) {
      var rows = $("table.filterclass tr");
      var btnShowAll = $("button#showAll");
      var btnFilter = $("button#showCheckedRowButton");
      var black = rows.filter(".showChecked").show();
      rows.not(black).hide();
      btnShowAll.show();
      btnFilter.hide();
  });
  
  $("#showAll").on('click',function (e) {
      var rows = $("table.filterclass tr");
      var btnShowAll = $("button#showAll");
      var btnFilter = $("button#showCheckedRowButton");

      rows.show();
      btnFilter.show();
      btnShowAll.hide();
  });
// });

// $(document).ready(function () {
  $("#sortButton").on('click',function () {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("mytableSort");
    switching = true;
    /*Make a loop that will continue until
  no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
    first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
      one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        //check if the two rows should switch place:
        if (Number(y.innerHTML) > Number(x.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  });
// });
})

// $(document).ready(function (){
//   $("#myTableSort").tablesorter({
//     theme : "materialize"
//   });

// });

// $(document).ready(function () {
//   var t = $(".dataTables").DataTable({
//     pageLength: 10,
//     responsive: true,
//     lengthChange: false,
//     info: false,
//     aaSorting: [],
//     // "searching": false,
//     dom: '<"html5buttons"B>lTfgitp',
//     buttons: [],
//   });

//   t.on("order.dt search.dt", function () {
//     t.column(0, { search: "applied", order: "applied" })
//       .nodes()
//       .each(function (cell, i) {
//         cell.innerHTML = i + 1;
//       });
//   }).draw();
// });



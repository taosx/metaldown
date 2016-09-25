let select = require("./events");
let Btn = require("../buttons");

// datatable contains the initialization config for the datatable
function datatable(size) {
    // "serverSide": true, retrieve: true, paging: false

    let options = {
        "processing": true,
        "ajax": {"url": "/elements/get", "type": "GET"},
        "columns": [
            {"data": "Type"},
            {"data": "Size"},
            {"data": "Price"},
            {"data": "Weight"},
            {"data": "InitialQuantity"},
            {"data": "Sold"},
            {"data": "RemainingQuantity"},
            {"data": "WarnLimit"}
        ],
        buttons: [{
            text: `<div class="pull-xs-left btn-contain btn-group" role="group">
              <button type="button" id="newBtn" class="btn btn-secondary action-btn" data-toggle="modal" data-target="#newElem">
                <img class="btn-img-fix" src="public/icons/add.png" width="18px" /> Καταχώρηση
              </button>`,
            action: function(e, dt, node, config) {

                let btn = Btn(dt);

                btn.add()
            }
        }, {
            extend: 'selected',
            text: `<div class="btn-contain btn-group" role="group" data-placement="right" title="Επιλεξτε πρωτα ενα αντικειμενο απο τον παρακατω πινακα.">
                    <button type="button" id="editBtn" class="btn btn-secondary  action-btn" data-toggle="modal" data-target="#editElem" disabled>
                      <img class="btn-img-fix" src="public/icons/edit.png" width="18px" /> Επεξεργασία
                    </button>`,
            action: function (e, dt, node, config) {
              editButton(e, dt, node, config)
            }
        }, {
          extend: 'selected',

            text: `<button type="button" id="delBtn" class="btn btn-secondary  action-btn" data-toggle="modal" data-target="#delElem" disabled>
                    <img class="btn-img-fix" src="public/icons/remove.png" width="18px" /> Διαγραφή
                   </button>
                  </div>
                </div>`,
                action: function(e, dt, node, config) {

                    let btn = Btn(dt);

                    let inputs = $("#delElem .modal-body .form-control");

                    let data = dt.row({
                        selected: true
                    }).data();

                    btn.switch(false)

                    btn.del(data)
                }
        }],
        destroy: true,
        responsive: true,
        deferRender: true,
        scrollY: size(),
        scrollCollapse: true,
        scroller: true,
        select: { style: 'single' },
        language: {
            url: "/public/Greek.json",
            search: "",
            searchPlaceholder: "Αναζήτηση..."
        },
        autoFill: { alwaysAsk: true },
        search: {smart: true},
        "dom": "<fl<t>>"

    };


    let table = $('#example').DataTable(options).on('init.dt', function() {
        table.buttons().container().appendTo($("#btns-main"));

        $("#example").on("domChanged", function() {
            setTimeout(function() {
                priorityOrder(table)
                ondblclickEdit(table)
            }, 10);
        });

        setTimeout(function() {
            //
            // $("input[type='search']").change(() => {
            //     $("#example").trigger("domChanged");
            // })


            $("input[type='search']").keyup(() => {
                $("#example").trigger("domChanged");
            })

            priorityOrder(table)
        }, 25);
    })


    return table;
}

function ondblclickEdit(table) {
  table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
      $(this.node()).dblclick(dta => {
        editButton(null, table, dta, null, this)
        $("#editElem").modal("show")
      })
  } );
}


function priorityOrder(table) {
    let rows = table.rows().nodes().to$().toArray().reverse()
    let warning_rows = rows.filter(row => {
        if (Number(row.cells[6].innerText) <= Number(row.cells[7].innerText)) {
            return row;
        }
    })

    warning_rows.forEach(row => {
        $(row).remove()
        $("#example tbody").prepend(row)
        $(row).addClass("text-danger").addClass("font-weight-bold")
    })


    let harddiv = $("#example_wrapper > div > div:nth-child(3) > div > div.dataTables_scrollBody > div");
    let tb = $("tbody")

    if (harddiv.height() !== tb.height()) {
        harddiv.height(tb.height())
    }

}

function editButton(e, dt, node, config, row) {
    // row is called only from dbleclick event

    let btn = Btn(dt);

    let inputs = $("#editElem .modal-body .form-control");
    let title = $(".modal-title")
    let priceTotal = $("#priceTotal");

    row = dt.row({
        selected: true
    });

    let data = row.data();

    let size_3way = data["Size"].toLowerCase().split("x");


    btn.switch(false)

    title.text("ΕΠΕΞΕΡΓΑΣΙΑ: " + data["Type"])

    inputs[0].value = size_3way[0];
    inputs[1].value = size_3way[1];
    inputs[2].value = size_3way[2];
    inputs[3].value = data["Price"];
    inputs[4].value = data["Weight"];
    inputs[5].value = data["InitialQuantity"];
    priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    inputs[6].value = 0;
    inputs[7].value = data["WarnLimit"];

    $(inputs[6]).keyup(() => {
        priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    })

    $(inputs[6]).click(() => {
        priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    })

    btn.edit(inputs, row, data)

}

module.exports = {
    datatable,
    select
}
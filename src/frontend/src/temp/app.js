(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Btn = require("./buttons/");
var dt = require("./datatable");
var theme = require("./theme");

var size = function size() {
	return document.documentElement.clientHeight - (document.documentElement.clientWidth > 768 ? 187 : 317);
};

function onloadcomplete() {
	setTimeout(function () {
		$("#example").trigger("domChanged");
	}, 100);

	var table = dt.datatable(size);

	fetch("/stats").then(function (res) {
		return res.json();
	}).then(function (json) {
		var internIP = $(".breadcrumb span")[1];
		internIP.textContent += json.local + ":8080";
		var externIP = $(".breadcrumb span")[2];
		externIP.textContent += json.external + ":8080";
	});

	dt.select(table);

	theme();

	var inputs = $(".modal-body .form-control");

	inputs.on("click", function () {
		$(this).select();
	});

	$("table th").click(function () {
		$("#example").trigger("domChanged");
	});
}

function styler() {
	var scrollBody = document.getElementsByClassName("dataTables_scrollBody")[0].style.maxHeight = size() + "px";
}

onload = onloadcomplete;
window.onresize = styler;

},{"./buttons/":3,"./datatable":5,"./theme":6}],2:[function(require,module,exports){
'use strict';

function btn_events(table) {

    return {
        add: add,
        edit: edit,
        del: del
    };

    function add() {
        $('#submit_new').one('click', function () {

            var inputs = $("#newElem .modal-body .form-control");

            var type = inputs[0];
            var typeSize = inputs[1].value + "X" + inputs[2].value + "X" + inputs[3].value;
            var limit = inputs[4].value;

            // console.log(type, inputs)

            var options = {
                method: "POST"
            };

            fetch('/element/add?type=' + type.value + '&size=' + typeSize + '&limit=' + limit, options).then(function (x) {
                table.ajax.reload(function () {
                    table.columns.adjust().draw(false);
                    $("#example").trigger("domChanged");
                }, false);
            });
        });
    }

    function edit(inputs, row, data) {
        $('#submit_edit').one('click', function () {

            var options = {
                method: "PUT",
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Type": data["Type"],
                    "Size": inputs[0].value + "X" + inputs[1].value + "X" + inputs[2].value,
                    "Price": Number(inputs[3].value),
                    "Weight": Number(inputs[4].value),
                    "InitialQuantity": Number(inputs[5].value),
                    "Sold": Number(inputs[6].value) + Number(data["Sold"]),
                    "WarnLimit": Number(inputs[7].value)
                })

            };

            fetch('/element/edit?type=' + data["Type"] + '&size=' + data["Size"], options).then(function (x) {
                // &limit=${data["WarnLimit"]}
                table.ajax.reload(function () {
                    table.columns.adjust().draw(false);
                    $("#example").trigger("domChanged");
                    row.select();
                    setTimeout(function () {
                        row.select(false);
                    }, 1000);
                }, false);
            });
        });
    }

    function del(data) {
        $('#submit_delete').one('click', function () {

            var options = {
                method: "DELETE"
            };

            fetch('/element/del?type=' + data["Type"] + '&size=' + data["Size"], options).then(function (x) {
                table.ajax.reload(function () {
                    table.columns.adjust().draw(false);
                    $("#editBtn").prop("disabled", true);
                    $("#delBtn").prop("disabled", true);
                    $("#example").trigger("domChanged");
                }, false);
            });
        });
    }
}

module.exports = btn_events;

},{}],3:[function(require,module,exports){
"use strict";

var btnEvent = require("./events");

function buttons(table) {
  // Place the buttons depending on the width of the screen


  return {
    add: btnEvent(table).add,
    edit: btnEvent(table).edit,
    del: btnEvent(table).del,
    switch: btnSwitches
  };
}

function btnSwitches(switches) {
  $("#editBtn").prop("disabled", switches);
  $("#delBtn").prop("disabled", switches);
  $('.tooltip-wrapper').tooltip(switches ? null : 'dispose');
}

module.exports = buttons;

},{"./events":2}],4:[function(require,module,exports){
'use strict';

var Btn = require("../buttons");

function select(table) {

    var btn = Btn(table);

    $('#example tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {

            btn.switch(false);
        }
    });

    table.on('deselect', function (e, dt, type, indexes) {
        btn.switch(true);
    });
}

module.exports = select;

},{"../buttons":3}],5:[function(require,module,exports){
"use strict";

var select = require("./events");
var Btn = require("../buttons");

// datatable contains the initialization config for the datatable
function datatable(size) {
    // "serverSide": true, retrieve: true, paging: false

    var options = {
        "processing": true,
        "ajax": { "url": "/elements/get", "type": "GET" },
        "columns": [{ "data": "Type" }, { "data": "Size" }, { "data": "Price" }, { "data": "Weight" }, { "data": "InitialQuantity" }, { "data": "Sold" }, { "data": "RemainingQuantity" }, { "data": "WarnLimit" }],
        buttons: [{
            text: "<div class=\"pull-xs-left btn-contain btn-group\" role=\"group\">\n              <button type=\"button\" id=\"newBtn\" class=\"btn btn-secondary action-btn\" data-toggle=\"modal\" data-target=\"#newElem\">\n                <img class=\"btn-img-fix\" src=\"public/icons/add.png\" width=\"18px\" /> Καταχώρηση\n              </button>",
            action: function action(e, dt, node, config) {

                var btn = Btn(dt);

                btn.add();
            }
        }, {
            extend: 'selected',
            text: "<div class=\"btn-contain btn-group\" role=\"group\" data-placement=\"right\" title=\"Επιλεξτε πρωτα ενα αντικειμενο απο τον παρακατω πινακα.\">\n                    <button type=\"button\" id=\"editBtn\" class=\"btn btn-secondary  action-btn\" data-toggle=\"modal\" data-target=\"#editElem\" disabled>\n                      <img class=\"btn-img-fix\" src=\"public/icons/edit.png\" width=\"18px\" /> Επεξεργασία\n                    </button>",
            action: function action(e, dt, node, config) {
                editButton(e, dt, node, config);
            }
        }, {
            extend: 'selected',

            text: "<button type=\"button\" id=\"delBtn\" class=\"btn btn-secondary  action-btn\" data-toggle=\"modal\" data-target=\"#delElem\" disabled>\n                    <img class=\"btn-img-fix\" src=\"public/icons/remove.png\" width=\"18px\" /> Διαγραφή\n                   </button>\n                  </div>\n                </div>",
            action: function action(e, dt, node, config) {

                var btn = Btn(dt);

                var inputs = $("#delElem .modal-body .form-control");

                var data = dt.row({
                    selected: true
                }).data();

                btn.switch(false);

                btn.del(data);
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
        search: { smart: true },
        "dom": "<fl<t>>"

    };

    var table = $('#example').DataTable(options).on('init.dt', function () {
        table.buttons().container().appendTo($("#btns-main"));

        $("#example").on("domChanged", function () {
            setTimeout(function () {
                priorityOrder(table);
                ondblclickEdit(table);
            }, 10);
        });

        setTimeout(function () {
            //
            // $("input[type='search']").change(() => {
            //     $("#example").trigger("domChanged");
            // })


            $("input[type='search']").keyup(function () {
                $("#example").trigger("domChanged");
            });

            priorityOrder(table);
        }, 25);
    });

    return table;
}

function ondblclickEdit(table) {
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var _this = this;

        $(this.node()).dblclick(function (dta) {
            editButton(null, table, dta, null, _this);
            $("#editElem").modal("show");
        });
    });
}

function priorityOrder(table) {
    var rows = table.rows().nodes().to$().toArray().reverse();
    var warning_rows = rows.filter(function (row) {
        if (Number(row.cells[6].innerText) <= Number(row.cells[7].innerText)) {
            return row;
        }
    });

    warning_rows.forEach(function (row) {
        $(row).remove();
        $("#example tbody").prepend(row);
        $(row).addClass("text-danger").addClass("font-weight-bold");
    });

    var harddiv = $("#example_wrapper > div > div:nth-child(3) > div > div.dataTables_scrollBody > div");
    var tb = $("tbody");

    if (harddiv.height() !== tb.height()) {
        harddiv.height(tb.height());
    }
}

function editButton(e, dt, node, config, row) {
    // row is called only from dbleclick event

    var btn = Btn(dt);

    var inputs = $("#editElem .modal-body .form-control");
    var title = $(".modal-title");
    var priceTotal = $("#priceTotal");

    row = dt.row({
        selected: true
    });

    var data = row.data();

    var size_3way = data["Size"].toLowerCase().split("x");

    btn.switch(false);

    title.text("ΕΠΕΞΕΡΓΑΣΙΑ: " + data["Type"]);

    inputs[0].value = size_3way[0];
    inputs[1].value = size_3way[1];
    inputs[2].value = size_3way[2];
    inputs[3].value = data["Price"];
    inputs[4].value = data["Weight"];
    inputs[5].value = data["InitialQuantity"];
    priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    inputs[6].value = 0;
    inputs[7].value = data["WarnLimit"];

    $(inputs[6]).keyup(function () {
        priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    });

    $(inputs[6]).click(function () {
        priceTotal.text(Number(data["Sold"]) + Number(inputs[6].value));
    });

    btn.edit(inputs, row, data);
}

module.exports = {
    datatable: datatable,
    select: select
};

},{"../buttons":3,"./events":4}],6:[function(require,module,exports){
"use strict";

function events() {

    $(".modal").on('shown.bs.modal', function () {
        $(this).find("input:visible:first").focus();
    });

    $("#delElem").on('shown.bs.modal', function () {
        $(this).find("#submit_delete").focus();
    });

    $('.tooltip-wrapper').tooltip();
}

module.exports = events;

},{}]},{},[1]);

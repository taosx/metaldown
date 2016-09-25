let btnEvent = require("./events")

function buttons(table) {
    // Place the buttons depending on the width of the screen


    return {
      add: btnEvent(table).add,
      edit: btnEvent(table).edit,
      del: btnEvent(table).del,
      switch: btnSwitches
    }

}

function btnSwitches (switches) {
  $("#editBtn").prop("disabled", switches);
  $("#delBtn").prop("disabled", switches);
  $('.tooltip-wrapper').tooltip(switches ? null : 'dispose');
}


module.exports = buttons
let Btn = require("../buttons");

function select(table) {

    let btn = Btn(table);

    $('#example tbody').on('click', 'tr', function() {
        if ($(this).hasClass('selected')) {

            btn.switch(false)
        }
    })


    table.on('deselect', function(e, dt, type, indexes) {
        btn.switch(true)
    })

}

module.exports = select
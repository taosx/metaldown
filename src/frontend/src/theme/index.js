

function events() {

    $(".modal").on('shown.bs.modal', function() {
        $(this).find("input:visible:first").focus();
    });

    $("#delElem").on('shown.bs.modal', function() {
        $(this).find("#submit_delete").focus();
    });

    $('.tooltip-wrapper').tooltip()

}

module.exports = events

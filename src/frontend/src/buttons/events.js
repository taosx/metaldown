function btn_events(table) {

    return {
        add: add,
        edit: edit,
        del: del,
    }

    function add() {
        $('#submit_new').one('click', function() {

            let inputs = $("#newElem .modal-body .form-control");

            let type = inputs[0];
            let typeSize = inputs[1].value + "X" + inputs[2].value + "X" + inputs[3].value;
            let limit = inputs[4].value;

            // console.log(type, inputs)

            let options = {
                method: "POST"
            }

            fetch(`/element/add?type=${type.value}&size=${typeSize}&limit=${limit}`, options).then(x => {
                table.ajax.reload(() => {
                    table.columns.adjust().draw(false);
                    $("#example").trigger("domChanged");
                }, false)
            })
        });
    }


    function edit(inputs, row, data) {
        $('#submit_edit').one('click', function() {

            let options = {
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

            }

            fetch(`/element/edit?type=${data["Type"]}&size=${data["Size"]}`, options).then(x => {
                // &limit=${data["WarnLimit"]}
                table.ajax.reload(() => {
                    table.columns.adjust().draw(false);
                    $("#example").trigger("domChanged");
                    row.select()
                    setTimeout(() => {
                      row.select(false)
                    }, 1000)
                }, false)

            })
        });
    }

    function del(data) {
        $('#submit_delete').one('click', function() {

            let options = {
                method: "DELETE"
            }

            fetch(`/element/del?type=${data["Type"]}&size=${data["Size"]}`, options).then(x => {
                table.ajax.reload(() => {
                    table.columns.adjust().draw(false);
                    $("#editBtn").prop("disabled", true)
                    $("#delBtn").prop("disabled", true)
                    $("#example").trigger("domChanged");
                }, false)
            })
        });
    }

}

module.exports = btn_events;

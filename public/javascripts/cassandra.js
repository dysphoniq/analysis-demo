

$(document).ready(function () {
  $('.close').click(function (e) {
    e.preventDefault();
    var taskid = $(this).attr('id').substring(6);
    taskid = parseInt(taskid);
    $.post( "/cassandra/delete", {id: taskid})
      .done (function (data) {
        location.reload();
      })
  });

  $('#add_button').click(function (e) {
    e.preventDefault();
    var new_entry = {};
    $("#new_email").find("input").each(function() {
      var inputType = this.tagName.toUpperCase() === "INPUT" && this.type.toUpperCase();
      if (inputType !== "BUTTON" && inputType !== "SUBMIT") {
          new_entry[this.name] = $(this).val();
      }
    });
    $.post("/cassandra/insert", new_entry)
      .done(function (data) {
        location.reload();
      });
  })

  $('.submit').click(function (e) {
    e.preventDefault();
    var taskid = $(this).attr('id').substring(7);
    var formid = "#form_" + taskid;

    var new_entry = {};
    $(formid).find("input").each(function() {
      var inputType = this.tagName.toUpperCase() === "INPUT" && this.type.toUpperCase();
      if (inputType !== "BUTTON" && inputType !== "SUBMIT") {
          new_entry[this.name] = $(this).val();
      }
      $.post("/cassandra/insert", new_entry)
        .done(function (data) {
          location.reload();
        });
    });
  });
});

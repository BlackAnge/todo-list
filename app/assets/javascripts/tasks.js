function Task() {};
var task = new Task();
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

Task.prototype.init = function() {
  task.active();
  task.completed();
  task.submitDate();
  task.sort();
  task.onBlur();
  task.edit();
};

Task.prototype.sort = function() {
  $('.sortable').railsSortable({
    handle: '.handle',
    containment: 'parent'
  });
};

Task.prototype.toggleStatus = function(oldStatus, newStatus, operator) {
  $(document).on('change', '.' + oldStatus + ' input[name="status"]', function() {
    var current = $(this).parents('.' + oldStatus);
    $.ajax({
      url: '/tasks/' + $(current).attr('data-task-id') + '/' + newStatus,
      type: 'PUT',
      success: function() {
        current.removeClass(oldStatus);
        current.addClass(newStatus);
        task.changeNumber(operator);
      }
    });
  });
};

Task.prototype.changeNumber = function(operator) {
  var count = parseInt($('#num').text());
  var number = eval('count ' + operator + ' 1' );
  var text = number + ' item' + (number == 1 && ' left' || 's left');
  $('#num').text(text);
};

Task.prototype.active = function() {
  task.toggleStatus('completed', 'active', '+');
};

Task.prototype.completed = function() {
  task.toggleStatus('active', 'completed', '-');
};

Task.prototype.submitDate = function() {
  $(function() {
    var $input = $('.datepicker');
    $input.datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true
    }).on('keypress changeDate', function(e) {
      if (e.which == ENTER_KEY) {
        $('form').submit();
        $('#input-text').focus();
      } else {
        $input.focus();
      };
    })
  })
};

Task.prototype.create = function(taskId, taskTitle, taskStatus, taskUrl) {
  var row = document.createElement('div');
  var div1 = document.createElement('div');
  var div2 = document.createElement('div');
  var checkBox = document.createElement('input');
  var i = document.createElement('i');
  var labelCheck = document.createElement('label');
  var label = document.createElement('label');
  var labelText = document.createTextNode(taskTitle);
  var linkDelete = document.createElement('a');

  row.id = ('Task_' + taskId);
  row.setAttribute('data-task-id', taskId);
  row.className = 'row pad-top-8 task row-task ' + taskStatus;
  div1.className = 'col-md-9';
  div2.className = 'col-md-3';
  checkBox.type = 'checkbox';
  checkBox.id = ('checked_' + taskId);
  checkBox.name = 'status';
  checkBox.value = taskStatus;
  checkBox.className = 'checkbox-status-' + taskStatus;
  i.className = 'handle ui-sortable-handle';
  labelCheck.className = 'check';
  labelCheck.setAttribute('for', 'checked_' + taskId);
  label.className = 'completed-action title';
  linkDelete.text = 'Delete';
  linkDelete.href = taskUrl;
  linkDelete.className = 'action delete-action';
  linkDelete.setAttribute('data-confirm', 'Are you sure?');
  linkDelete.setAttribute('data-remote', 'true');
  linkDelete.setAttribute('data-method', 'delete');

  label.append(labelText);
  div1.append(checkBox);
  div1.append(i);
  div1.append(labelCheck);
  div1.append(label);

  div2.append(linkDelete);
  row.append(div1);
  row.append(div2);

  $('#container').prepend(row);
};

Task.prototype.edit = function() {
  $(document).on('click', '.title', function(e) {
    var text = $(this).text();
    var $element = $(e.target);
    var $input = $('<input />').attr({
      'type': 'text',
      'id': 'txt_input',
      'data-prev-text': text,
      'value': text
    });
    $element.html($input);
    $input.on('keyup', function(ev) {
      if (ev.keyCode === ESCAPE_KEY) {
        $element.html(text);
      };

      if (ev.keyCode === ENTER_KEY) {
        $input.blur();
      };
    })
  });
}

Task.prototype.onBlur = function() {
  $(document).on('blur', '#txt_input', function(e) {
    var prevText = $(this).attr('data-prev-text');
    var text = $(this).val();
    var label = $(e.target).closest('label');
    var row = $(this).parents('.row-task');

    if (prevText === text) return $(label).html(prevText);

    $.ajax({
      url: '/tasks/' + $(row).attr('data-task-id'),
      type: 'PUT',
      data: { title: text }
    });
    $(label).html(text);
  });
}

$(document).ready(task.init);

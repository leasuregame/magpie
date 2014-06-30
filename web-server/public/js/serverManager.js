$(function(){
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  $('#save').click(function(e){
    var value = editor.getValue();
    try{
      var jt = JSON.parse(value);

      $.post('/admin/areaeditor/save', {
        areas: value
      }, function(data, status) {
        $('#res-msg').text(data.msg);
        if (data.code == 200) {
          $('#res-msg').removeClass('alert-danger');
          $('#res-msg').addClass('alert alert-success');
        } else {
          $('#res-msg').removeClass('alert-success');
          $('#res-msg').addClass('alert alert-danger');
        }
      });
    } catch(e) {
      $('#res-msg').removeClass('alert-success');
      $('#res-msg').text('语法错误！').addClass('alert alert-danger');
    }
  });

  $('#btn-start').click(function(e) {
    $.get('/admin/api/server/start', handerResult);
  });

  $('#btn-stop').click(function(e) {
    $.get('/admin/api/server/stop', handerResult);
  });

  $('#btn-stop-force').click(function(e) {
    $.get('/admin/api/server/stop?force=true', handerResult);
  });

  $('#btn-restart').click(function(e) {
    $.get('/admin/api/server/restart', handerResult);
  });

  function handerResult(data) {
    if(data.code == 200) {
      $('.cmd-results').removeClass('alert-danger alert-warning').addClass('alert-success').html(data.msg);
    } else if (data.code == 300) {
      $('.cmd-results').removeClass('alert-danger alert-success').addClass('alert-warning').html(
        data.msg + '<br>' 
        + data.output.map(function(o, i) {return '<strong>'+(i+1)+'. </strong>'+o}).join('<br>')
      );
    } else {
      $('.cmd-results').removeClass('alert-success alert-warning').addClass('alert-danger').html(data.msg);
    }
  }

  $('#btn-white-list').click(function(e) {
    setWhiteListStatus();

    $.get('/admin/api/whitelist', function(data) {
      var html='';
      console.log('-w-', data);
      data.forEach(function(i) {
        html += '<li class="list-group-item">'
          + i.areaId + ' 区 - '
          + '<strong>' + i.name
          + '</strong><button class="del-white-list btn btn-danger btn-xs pull-right" value="' 
          + i.userId + '">删除</button></li>';
      });

      $('#whitelist').html(html);
      addDeleteEvents();          
    });
  });

  $('#btn-add-white-list').click(function(e) {
    e.preventDefault();

    var pname = $('#playername').val();
    $.post('/admin/api/whitelist', {
        name: pname
      }, function(data) {
        if (typeof data == 'string') {
          alert(pname + ' ' + data);
        } else {
          var html = '<li class="list-group-item">'
            + data.areaId + ' 区 - '
            + '<strong>' + data.name
            + '</strong><button class="del-white-list btn btn-danger btn-xs pull-right" value="' 
            + data.userId + '">删除</button></li>';

          $('#whitelist').append(html);
          addDeleteEvents();
        }
      });

  });

  $('#btn-white-list-enable').click(function(e) {
    $.get('/admin/api/whitelist/status/toggle', function(status) {
      if (status == true) {
        $('#btn-white-list-enable').removeClass('btn-danger').addClass('btn-success').text('关闭');
      } else {
        $('#btn-white-list-enable').removeClass('btn-success').addClass('btn-danger').text('开启');
      }
    });
  });

  var addDeleteEvents = function() {
    $('.del-white-list').click(function(e) {
        e.preventDefault();
        var self = $(this);
        $.ajax({
          url: '/admin/api/whitelist/'+this.value,
          type: 'DELETE'
        }).success(function(data) {
          if (data == 'ok') {
            self.parent().remove();
          }
        }).error(function(err) {
          alert(err);
        });
      });
  };

  var setWhiteListStatus = function() {
    $.get('/admin/api/whitelist/status', function(status) {
      
      if (status == true) {
        $('#btn-white-list-enable').removeClass('btn-danger').addClass('btn-success').text('关闭');
      } else {
        $('#btn-white-list-enable').removeClass('btn-success').addClass('btn-danger').text('开启');
      }
    });
  };
  setWhiteListStatus();
});
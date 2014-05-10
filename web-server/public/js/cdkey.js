$(function() {
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  $('#btnGetCdkey').click(function(e) {
    e.preventDefault();

    $.ajax({
      url: '/admin/cdkey/pregenerate',
      data: {
        prefix: $('#cdkeyPrefix').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        qty: $('#keyQty').val(),
        area: $('#area').val()
      },
      dataType: 'json'
    }).success(function(data) {
      if (data.success) {
        $('#msgInfo').removeClass('hidden').addClass('show alert-success').text('成功生成激活码！请刷新界面');
      } else {
        $('#msgInfo').removeClass('hidden').addClass('show alert-danger').text('错误:' + data.msg);
      }
    }).error(function(data) {
      console.log('err', data);
    });

  });

  $('.usedFilter').click(function(e) {
    var value = $(this).val();
    var query = {
      used: value,
      page: getParameterByName('page')
    };
    window.location.href = window.location.pathname + '?' + $.param(query);
  });

  $('#btnSearch').click(function(e) {
    $.ajax({
      url: '/admin/cdkey/search',
      data: {
        q: $('#queryText').val()
      },
      dataType: 'json',
    }).success(function(data) {
      if (data.length == 0) {
        return alert('没有任何数据！');
      }

      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr><td>' + data[i].code + '</td>';
        html += '<td>' + data[i].startDate + '</td>';
        html += '<td>' + data[i].endDate + '</td>';
        html += '<td>' + data[i].activate + '</td></tr>';
      }

      $('table tbody').html(html);
    }).error(function(data) {
      console.log('err', data);
    })
  });

});
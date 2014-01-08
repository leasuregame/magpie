$(function() {
  $('#btnGetCdkey').click(function(e) {
    e.preventDefault();

    $.ajax({
      url: '/admin/cdkey/pregenerate',
      data: {
        prefix: $('#cdkeyPrefix').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        qty: $('#keyQty').val()
      },
      dataType: 'json'
    }).success(function(data) {
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<div class="form-group"><input class="form-control-static" type="text" value="' + data[i] + '" name="'+ data[i] +'"></input></div>';
      }
      html += '';
      $('#cdkeyShow').html(html);
    }).error(function(data) {
      console.log('err', data);
    });

  });
});
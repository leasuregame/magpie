$(function() {
  $('#btnGetCdkey').click(function(e) {
    e.preventDefault();

    // $.get(
    //   '/admin/cdkey/pregenerate', 
    //   {
    //     prefix: $('#cdkeyPrefix').val(),
    //     startDate: $('#startDate').val(),
    //     endDate: $('#endDate').val(),
    //     qty: $('#keyQty').val()
    //   },
    //   function(data) {
    //     console.log(data);
    //     alert(data);
    //     $('#cdkeyShow').text(data);
    //   },
    //   'json'
    // );

    $.ajax({
      url: '/admin/cdkey/pregenerate',
      type: 'GET',
      data: {
        prefix: $('#cdkeyPrefix').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        qty: $('#keyQty').val()
      },
      dataType: 'json'
    }).success(function(data) {
      console.log(data);
      alert(data);
      $('#cdkeyShow').text(data);
    }).error(function(data) {

    });

  });
});
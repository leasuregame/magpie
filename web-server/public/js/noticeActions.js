$(function() {
  $('#newNoticeForm').submit(function(e) {
    if ($('#inputName').val() == '' && $('#inputPlatform').val() == '') {
      alert('请输入平台和名称');
      return e.preventDefault();
    }
  });

  $('.deleteNotice').click(function(e) {
    e.preventDefault();

    if (confirm('确定将此记录删除?')) {
      var tr = $(this).parent().parent();
      var platform = tr.find('.ntc-platform')[0].innerText;
      
      $.ajax({
        url: '/admin/notice/' + platform,
        type: 'DELETE'
      }).success(function(data) {
        console.log(data);
        alert(data);
        if (data == 'ok') {
          tr.remove();
        }
      }).error(function(data) {

      });
    }
  });
});
/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-2
 * Time: 下午6:03
 * To change this template use File | Settings | File Templates.
 */

var pagination = (function () {

    var element;
    var current_items;
    var total_page;

    function Pagination(e, items, total) {
        element = e;
        current_items = items;//每页显示10条
        //this.current_page = 1;//当前页面
        total_page = Math.ceil(total / items);//总页面数
        init();
    }

    var current_page = 1;//当前页面
    //var total_page = Math.ceil(total / current_items);//总页面数
    // console.log(total_page);

    function init() {
        $(".current_page").val(current_page);
        $(".total").text(total_page);

        showPage(current_page);

        //下一页
        $(".next").click(function () {
            if (current_page >= total_page) {
                return false;
            } else {
                $(".current_page").val(++current_page);
                showPage(current_page);
            }

        });


        //上一页
        $(".prev").click(function () {
            if (current_page <= 1) {
                return false;
            } else {
                $(".current_page").val(--current_page);
                showPage(current_page);
            }
        });

        //首页
        $(".page_first").click(function () {
            current_page = 1;
            $(".current_page").val(current_page);
            showPage(current_page);
        });

        //末页
        $(".page_last").click(function () {
            current_page = total_page;
            $(".current_page").val(current_page);
            showPage(current_page);
        });

        //输入框
        $(".current_page").change(function () {
            var val = $(".current_page").val();
            if (val < 1 || val > total_page) {
                $(".current_page").val(current_page)
                return;
            } else {
                current_page = val;
                showPage(current_page);
            }

        });
    }

    function showPage(page) {
        $("#cardsList tbody tr").hide();
        $.each($("#cardsList tbody tr"), function (index, item) {
            var start = current_items * (current_page - 1);
            var end = current_items * current_page;
            if (index >= start && index < end || index == 0)
                $(this).show();
        });
    }

    return Pagination;

})();
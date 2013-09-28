/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-2
 * Time: 下午6:03
 * To change this template use File | Settings | File Templates.
 */

var pagination = null;

var Pag = function(e, i, t){
   /*
    var element;
    var items;
    var total_page;
    var current_page = 1;//当前页面
    var total = 0;
   */
    //init:function(e, i, t) {
        this.element = e;
        this.items = i;//每页显示条数
        this.total = t;
        this.total_page = Math.ceil(this.total / this.items);//总页面数
        this.current_page = 1;
     //   this.initPagination();
    //},



    this.update = function(val) {
       // var old = total_page;
        console.log(val);
        this.total += val;
        this.total_page = Math.ceil(this.total / this.items);
        $(".total").text(this.total_page);

        if(this.current_page > this.total_page) {
            this.current_page--;
            this.showPage(this.current_page);
        }else if(val > 0){
            this.current_page = this.total_page;
            this.showPage(this.current_page);
        }


        $(".current_page").val(this.current_page);
    };

    this.initPagination = function() {

        $(".current_page").val(this.current_page);
        $(".total").text(this.total_page);

        this.showPage(this.current_page);

        //下一页
        $(".next").click(function () {
            if (self.current_page >= self.total_page) {
                return false;
            } else {
                $(".current_page").val(++self.current_page);
                self.showPage(self.current_page);
            }

        });


        //上一页
        $(".prev").click(function () {
            if (self.current_page <= 1) {
                return false;
            } else {
                $(".current_page").val(--self.current_page);
                self.showPage(self.current_page);
            }
        });

        //首页
        $(".page_first").click(function () {
            self.current_page = 1;
            $(".current_page").val(self.current_page);
            self.showPage(self.current_page);
        });

        //末页
        $(".page_last").click(function () {
            self.current_page = self.total_page;
            $(".current_page").val(self.current_page);
            self.showPage(self.current_page);
        });

        //输入框
        $(".current_page").change(function () {
            var val = $(".current_page").val();
            if (val < 1 || val > self.total_page) {
                $(".current_page").val(self.current_page)
                return;
            } else {
                self.current_page = val;
                self.showPage(self.current_page);
            }

        });
    };

    this.showPage = function(page) {

        $(self.element).hide();
        $.each($(self.element), function (index, item) {
            var start = self.items * (page - 1);
            var end = self.items * page;
            if (index >= start && index < end)
                $(this).show();
        });
    };

    self = this;

};

Pagination = {
    init:function(e, i, t){
        if(pagination == null) {
            pagination = new Pag(e,i,t);
            console.log("pagination = ",pagination);
            pagination.initPagination();
        }else {
            return pagination;
        }
    },
    update:function(val) {
        pagination.update(val);
    }
};
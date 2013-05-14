/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:20
 * To change this template use File | Settings | File Templates.
 */

var testLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Layer );
    },

    init : function() {
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        var bgSprite = cc.Sprite.create(s_test_bg);
        bgSprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(bgSprite);
        /*
        //var heroSprite = cc.Sprite.create("");

        var item = cc.MenuItemFont.create("返回", function(){
            console.log("fanhui");
        }, null);
        var menu = cc.Menu.create(item);
        this.addChild(menu);
//        menu.setAnchorPoint(1, 1);
        menu.setPosition(50, 930);

        var heroLabel = cc.LayerColor.create(cc.c4b(255,255,255,150), 720, 560);
        heroLabel.setPosition(0, 350);
        this.addChild(heroLabel);

        var propertyLabel = cc.LayerColor.create(cc.c4b(100,100,0,150), 720, 150);
        propertyLabel.setPosition(0, 0);
        this.addChild(propertyLabel);

        var nodeLabel = cc.LayerColor.create(cc.c4b(0,0,0,150), 720, 200);
        nodeLabel.setPosition(0, 150);
        this.addChild(nodeLabel);

        var hero = cc.Sprite.create(s_hero);
        hero.setPosition(size.width / 2, 650);
        this.addChild(hero);

        var node = cc.LabelTTF.create("雷震子：收电费了, 电费了, 费了, 了........",  'Times New Roman', 32, cc.size(720,200), cc.TEXT_ALIGNMENT_LEFT);
        node.setAnchorPoint(cc.p(0, 0));
        node.setPosition(30, 100);
        this.addChild(node);
//        var grade = cc.LabelTTF.create("alignment left", 'Times New Roman', 32, cc.size(720, 150), cc.TEXT_ALIGNMENT_LEFT);
        var grade = cc.LabelTTF.create("等级: 10",  'Times New Roman', 32, cc.size(720, 200), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(grade);
        grade.setAnchorPoint(cc.p(0, 0));
        grade.setPosition(30, 50);

        grade = cc.LabelTTF.create("生命: 10000",  'Times New Roman', 32, cc.size(720,200), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(grade);
        grade.setAnchorPoint(cc.p(0, 0));
        grade.setPosition(30, 0);

        grade = cc.LabelTTF.create("攻击: 2222",  'Times New Roman', 32, cc.size(720,200), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(grade);
        grade.setAnchorPoint(cc.p(0, 0));
        grade.setPosition(500, 0);

        grade = cc.LabelTTF.create("星级: 5",  'Times New Roman', 32, cc.size(720,200), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(grade);
        grade.setAnchorPoint(cc.p(0, 0));
        grade.setPosition(500, 50);

        grade = cc.LabelTTF.create("雷震子2货",  'Times New Roman', 32, cc.size(720,200), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(grade);
        grade.setPosition(size.width / 2, 935);

        var p = Progress.createWithFile("res/power.png", "res/power_on_0.png", 50, 100);
        this.addChild(p);
        p.setPosition(150, 100);
        var x = 1;
//        p.schedule(function() {
//                   cc.log("1");
//                   cc.log("2");
//                      if(x <= 100) {
//                      this.setValue(x++);
//                      }
//        }, 0.1);
        //p.scheduleUpdate();
        */
    }
})
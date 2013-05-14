/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var BatterLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Layer );
    },

    init : function() {
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        var sprite = cc.Sprite.create(s_game_bg);
        sprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(sprite);

        var own = [];
        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own11);
        own.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own12);
        own.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own13);
        own.push(sprite);


        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own21);
        own.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own22);
        own.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(own23);
        own.push(sprite);


        var enemy = [];
        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy11);
        enemy.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy12);
        enemy.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy13);
        enemy.push(sprite);


        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy21);
        enemy.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy22);
        enemy.push(sprite);

        sprite = cc.Sprite.create(s_hero);
        this.addChild(sprite);
        sprite.setPosition(enemy23);
        enemy.push(sprite);

        var i = 0;

        this.schedule(function() {
            if(i < 6) {
                SkillFactory.normalAttack(own[i], enemy[i % 3], Math.floor(Math.random() * 2));
            }
            else {
                SkillFactory.normalAttack(enemy[i - 6], own[i % 3], Math.floor(Math.random() * 2));
            }
            i = (i + 1) % 12;
        }, SkillInterval);
    }
})
var SETTING_IS_BROWSER = false;
if (typeof(navigator) != 'undefined') {
    SETTING_IS_BROWSER = true;
}

var s_path1 = "";
if (SETTING_IS_BROWSER) {
    s_path1 = "res1/test/";
}

// login scene res
var login_scene_res = [
    //image
    {src: s_game_bg}

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];

// main scene res
var main_scene_path = "res/main/";

var main_scene_image = {
    bg1: main_scene_path + "bg1.png",
    bg2: main_scene_path + "bg2.png",
    bg3: main_scene_path + "bg3.png",
    bg4: main_scene_path + "bg4.png",
    bg5: main_scene_path + "bg5.png",
    bg6: main_scene_path + "bg6.png",

    card0: main_scene_path + "card0.png",

    player_details_bg: main_scene_path + "player_details_bg.png",
    lv_bg: main_scene_path + "lv_bg.png",
    exp_bg: main_scene_path + "exp_bg.png",
    exp: main_scene_path + "exp.png",
    main_menu_bg: main_scene_path + "main_menu_bg.png",
    main_message_bg: main_scene_path + "main_message_bg.png",
    vip5: main_scene_path + "vip5.png",
    star1: main_scene_path + "star1.png",
    ladder1: main_scene_path + "ladder1.png",
    ladder2: main_scene_path + "ladder2.png",
    tower1: main_scene_path + "tower1.png",
    tower2: main_scene_path + "tower2.png",

    card_item_bg0: main_scene_path + "card_item_bg0.png",
    card_item_bg1: main_scene_path + "card_item_bg1.png",
    card_item_bg2: main_scene_path + "card_item_bg2.png",
    card_item_bg3: main_scene_path + "card_item_bg3.png",
    card_item_bg4: main_scene_path + "card_item_bg4.png",
    card_item_bg5: main_scene_path + "card_item_bg5.png",

    card_item_frame1: main_scene_path + "card_item_frame1.png",
    card_item_frame2: main_scene_path + "card_item_frame2.png",
    card_item_frame3: main_scene_path + "card_item_frame3.png",
    card_item_frame4: main_scene_path + "card_item_frame4.png",
    card_item_frame5: main_scene_path + "card_item_frame5.png",

    button0: main_scene_path + "button0.png",
    button0s: main_scene_path + "button0s.png",
    button1: main_scene_path + "button1.png",
    button1s: main_scene_path + "button1s.png",
    button2: main_scene_path + "button2.png",
    button2s: main_scene_path + "button2s.png",
    button3: main_scene_path + "button3.png",
    button3s: main_scene_path + "button3s.png",
    button4: main_scene_path + "button4.png",
    button4s: main_scene_path + "button4s.png",
    button5: main_scene_path + "button5.png",
    button5s: main_scene_path + "button5s.png",
    button6: main_scene_path + "button6.png",
    button6s: main_scene_path + "button6s.png",
    button7: main_scene_path + "button7.png",
    button7s: main_scene_path + "button7s.png",
    button9: main_scene_path + "button9.png",
    button9s: main_scene_path + "button9s.png",
    button10: main_scene_path + "button10.png",
    button10s: main_scene_path + "button10s.png",
    button11: main_scene_path + "button11.png",
    button11s: main_scene_path + "button11s.png",
    button12: main_scene_path + "button12.png",
    button12s: main_scene_path + "button12s.png",
    button12d: main_scene_path + "button12d.png",
    button13: main_scene_path + "button13.png",
    button13s: main_scene_path + "button13s.png",
    button13d: main_scene_path + "button13d.png",
    button14: main_scene_path + "button14.png",
    button14s: main_scene_path + "button14s.png",
    button14d: main_scene_path + "button14d.png",
    button15: main_scene_path + "button15.png",
    button15s: main_scene_path + "button15s.png",
    button15d: main_scene_path + "button15d.png",

    icon1: main_scene_path + "icon1.png",
    icon2: main_scene_path + "icon2.png",
    icon3: main_scene_path + "icon3.png",
    icon4: main_scene_path + "icon4.png",
    icon5: main_scene_path + "icon5.png",
    icon6: main_scene_path + "icon6.png",
    icon7: main_scene_path + "icon7.png",
    icon8: main_scene_path + "icon8.png",
    icon9: main_scene_path + "icon9.png",
    icon10: main_scene_path + "icon10.png",
    icon11: main_scene_path + "icon11.png",
    icon12: main_scene_path + "icon12.png",
    icon13: main_scene_path + "icon13.png",
    icon14: main_scene_path + "icon14.png",
    icon15: main_scene_path + "icon15.png",
    icon16: main_scene_path + "icon16.png",
    icon17: main_scene_path + "icon17.png",
    icon18: main_scene_path + "icon18.png",
    icon19: main_scene_path + "icon19.png",
    icon20: main_scene_path + "icon20.png",
    icon21: main_scene_path + "icon21.png",
    icon22: main_scene_path + "icon22.png",
    icon23: main_scene_path + "icon23.png",
    icon24: main_scene_path + "icon24.png",
    icon25: main_scene_path + "icon25.png",
    icon26: main_scene_path + "icon26.png",
    icon27: main_scene_path + "icon27.png",
    icon28: main_scene_path + "icon28.png",
    icon29: main_scene_path + "icon29.png",
    icon30: main_scene_path + "icon30.png",
    icon31: main_scene_path + "icon31.png"
}

var main_scene_res = [
    //image
    //plist
    //fnt
    //tmx
    //bgm
    //effect
];

for (var key in main_scene_image) {
    main_scene_res.push({src: main_scene_image[key]});
}

// battle scene res
var battle_scene_res = [
    //image

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];


var s_game_bg = s_path1 + "bg.png";
var s_progress = s_path1 + "p.png";
var s_progress_bg = s_path1 + "pbg.png";
var s_card_library_bg = s_path1 + "lbg.png";
var s_card_view = s_path1 + "view.png";
var s_close = s_path1 + "close.png";
var s_lock = s_path1 + "lock.png";

var s_hero_1 = s_path1 + "1.png";
var s_hero_2 = s_path1 + "2.png";
var s_hero_3 = s_path1 + "3.png";
var s_hero_4 = s_path1 + "4.png";
var s_hero_5 = s_path1 + "5.png";
var s_hero_6 = s_path1 + "6.png";

var s_b_hero_1 = s_path1 + "b1.png";
var s_b_hero_2 = s_path1 + "b2.png";
var s_b_hero_3 = s_path1 + "b3.png";
var s_b_hero_4 = s_path1 + "b4.png";
var s_b_hero_5 = s_path1 + "b5.png";
var s_b_hero_6 = s_path1 + "b6.png";

var s_h_hero_1 = s_path1 + "h1.png";
var s_h_hero_2 = s_path1 + "h2.png";
var s_h_hero_3 = s_path1 + "h3.png";
var s_h_hero_4 = s_path1 + "h4.png";
var s_h_hero_5 = s_path1 + "h5.png";
var s_h_hero_6 = s_path1 + "h6.png";

var s_hg_hero_1 = s_path1 + "hg1.png";
var s_hg_hero_2 = s_path1 + "hg2.png";
var s_hg_hero_3 = s_path1 + "hg3.png";
var s_hg_hero_4 = s_path1 + "hg4.png";
var s_hg_hero_5 = s_path1 + "hg5.png";
var s_hg_hero_6 = s_path1 + "hg6.png";

var s_e_1 = s_path1 + "e1.png";
var s_e_2 = s_path1 + "e2.png";
var s_e_3 = s_path1 + "e3.png";
var s_e_4 = s_path1 + "e4.png";
var s_e_5 = s_path1 + "e5.png";
var s_e_6 = s_path1 + "e6.png";

var s_star1 = s_path1 + "star1.png";
var s_star2 = s_path1 + "star2.png";
var s_star3 = s_path1 + "star3.png";
var s_star4 = s_path1 + "star4.png";
var s_star5 = s_path1 + "star5.png";

var s_frame1 = s_path1 + "frame1.png";
var s_frame2 = s_path1 + "frame2.png";
var s_frame3 = s_path1 + "frame3.png";

var g_ressources = [
    //image
    {src: s_game_bg},
    {src: s_progress_bg},
    {src: s_progress},
    {src: s_card_library_bg},
    {src: s_card_view},
    {src: s_close},
    {src: s_lock},

    {src: s_hero_1},
    {src: s_hero_2},
    {src: s_hero_3},
    {src: s_hero_4},
    {src: s_hero_5},
    {src: s_hero_6},

    {src: s_b_hero_1},
    {src: s_b_hero_2},
    {src: s_b_hero_3},
    {src: s_b_hero_4},
    {src: s_b_hero_5},
    {src: s_b_hero_6},

    {src: s_h_hero_1},
    {src: s_h_hero_2},
    {src: s_h_hero_3},
    {src: s_h_hero_4},
    {src: s_h_hero_5},
    {src: s_h_hero_6},

    {src: s_hg_hero_1},
    {src: s_hg_hero_2},
    {src: s_hg_hero_3},
    {src: s_hg_hero_4},
    {src: s_hg_hero_5},
    {src: s_hg_hero_6},

    {src: s_e_1},
    {src: s_e_2},
    {src: s_e_3},
    {src: s_e_4},
    {src: s_e_5},
    {src: s_e_6},

    {src: s_star1},
    {src: s_star2},
    {src: s_star3},
    {src: s_star4},
    {src: s_star5},

    {src: s_frame1},
    {src: s_frame2},
    {src: s_frame3},

    {src: "res1/yellow_edit.png"},
    {src: "res1/green_edit.png"},
    {src: "res1/button.png"},
    {src: "res1/buttonHighlighted.png"}

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];
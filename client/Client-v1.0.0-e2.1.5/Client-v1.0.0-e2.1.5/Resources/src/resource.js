var SETTING_IS_BROWSER = false;
if (typeof(navigator) != 'undefined') {
    SETTING_IS_BROWSER = true;
}

var s_path1 = "res1/test/";
if (SETTING_IS_BROWSER) {
    s_path1 = "res1/test/";
}

// login scene res
var login_scene_path = "res/login/";

var login_scene_image = {
    edit1: login_scene_path + "edit1.png",
    edit2: login_scene_path + "edit2.png"
};

var login_scene_res = [
    //image

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];

for (var key in login_scene_image) {
    login_scene_res.push({src: login_scene_image[key]});
}

// main scene res
var main_scene_path = "res/main/";

var main_scene_image = {
    bg1: main_scene_path + "bg1.png",
    bg2: main_scene_path + "bg2.png",
    bg3: main_scene_path + "bg3.png",
    bg4: main_scene_path + "bg4.png",
    bg5: main_scene_path + "bg5.png",
    bg6: main_scene_path + "bg6.png",
    bg7: main_scene_path + "bg7.png",
    bg8: main_scene_path + "bg8.png",
    bg9: main_scene_path + "bg9.png",
    bg10: main_scene_path + "bg10.png",
    bg11: main_scene_path + "bg11.png",
    bg12: main_scene_path + "bg12.png",
    bg13: main_scene_path + "bg13.png",
    bg14: main_scene_path + "bg14.png",
    bg15: main_scene_path + "bg15.png",
    bg16: main_scene_path + "bg16.png",
    bg17: main_scene_path + "bg17.png",
    bg18: main_scene_path + "bg18.png",

    player_details_bg: main_scene_path + "player_details_bg.png",
    lv_bg: main_scene_path + "lv_bg.png",
    exp_bg: main_scene_path + "exp_bg.png",
    exp: main_scene_path + "exp.png",
    main_message_bg: main_scene_path + "main_message_bg.png",
    vip5: main_scene_path + "vip5.png",
    star1: main_scene_path + "star1.png",
    ladder1: main_scene_path + "ladder1.png",
    ladder2: main_scene_path + "ladder2.png",
    tower1: main_scene_path + "tower1.png",
    tower2: main_scene_path + "tower2.png",

    card0: main_scene_path + "card0.png",
    card1: main_scene_path + "card1.png",

    spirit1: main_scene_path + "spirit1.png",

    progress2: main_scene_path + "progress2.png",
    progress3: main_scene_path + "progress3.png",
    progress4: main_scene_path + "progress4.png",
    progress5: main_scene_path + "progress5.png",
    progress6: main_scene_path + "progress6.png",
    progress7: main_scene_path + "progress7.png",
    progress8: main_scene_path + "progress8.png",
    progress9: main_scene_path + "progress9.png",
    progress10: main_scene_path + "progress10.png",
    progress11: main_scene_path + "progress11.png",
    progress12: main_scene_path + "progress12.png",

    pve_bg1: main_scene_path + "pve_bg1.png",
    pvp_bg1: main_scene_path + "pvp_bg1.png",

    edit1: main_scene_path + "edit1.png",
    edit2: main_scene_path + "edit2.png",
    edit3: main_scene_path + "edit3.png",

    card_frame_s: main_scene_path + "card_frame_s.png",
    card_frame1: main_scene_path + "card_frame1.png",
    card_frame2: main_scene_path + "card_frame2.png",
    card_frame3: main_scene_path + "card_frame3.png",
    card_frame4: main_scene_path + "card_frame4.png",
    card_frame5: main_scene_path + "card_frame5.png",

    card_icon1: main_scene_path + "card_icon1.png",
    card_icon2: main_scene_path + "card_icon2.png",
    card_icon3: main_scene_path + "card_icon3.png",

    card_item_bg_s: main_scene_path + "card_item_bg_s.png",
    card_item_bg1: main_scene_path + "card_item_bg1.png",
    card_item_bg2: main_scene_path + "card_item_bg2.png",
    card_item_bg3: main_scene_path + "card_item_bg3.png",
    card_item_bg4: main_scene_path + "card_item_bg4.png",
    card_item_bg5: main_scene_path + "card_item_bg5.png",

    card_item_frame: main_scene_path + "card_item_frame.png",

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
//    button6: main_scene_path + "button6.png",
//    button6s: main_scene_path + "button6s.png",
    button7: main_scene_path + "button7.png",
    button7s: main_scene_path + "button7s.png",
    button8: main_scene_path + "button8.png",
    button8s: main_scene_path + "button8s.png",
    button9: main_scene_path + "button9.png",
    button9s: main_scene_path + "button9s.png",
    button9d: main_scene_path + "button9d.png",
    button10: main_scene_path + "button10.png",
    button10s: main_scene_path + "button10s.png",
    button11: main_scene_path + "button11.png",
    button11s: main_scene_path + "button11s.png",
//    button12: main_scene_path + "button12.png",
//    button12s: main_scene_path + "button12s.png",
//    button12d: main_scene_path + "button12d.png",
    button13: main_scene_path + "button13.png",
    button13s: main_scene_path + "button13s.png",
    button13d: main_scene_path + "button13d.png",
    button14: main_scene_path + "button14.png",
    button14s: main_scene_path + "button14s.png",
    button14d: main_scene_path + "button14d.png",
    button15: main_scene_path + "button15.png",
    button15s: main_scene_path + "button15s.png",
    button15d: main_scene_path + "button15d.png",
    button16: main_scene_path + "button16.png",
    button16s: main_scene_path + "button16s.png",
    button17: main_scene_path + "button17.png",
    button17s: main_scene_path + "button17s.png",
//    button18: main_scene_path + "button18.png",
    button19: main_scene_path + "button19.png",
    button19s: main_scene_path + "button19s.png",
    button20: main_scene_path + "button20.png",
    button20s: main_scene_path + "button20s.png",
    button21: main_scene_path + "button21.png",
    button21s: main_scene_path + "button21s.png",
    button22: main_scene_path + "button22.png",
    button22s: main_scene_path + "button22s.png",
    button22d: main_scene_path + "button22d.png",
    button23: main_scene_path + "button23.png",
    button23s: main_scene_path + "button23s.png",
    button23d: main_scene_path + "button23d.png",
    button24: main_scene_path + "button24.png",
    button24s: main_scene_path + "button24s.png",
    button25: main_scene_path + "button25.png",
    button25s: main_scene_path + "button25s.png",
    button26: main_scene_path + "button26.png",
    button26s: main_scene_path + "button26s.png",
    button27: main_scene_path + "button27.png",
    button27s: main_scene_path + "button27s.png",
    button28: main_scene_path + "button28.png",
    button28s: main_scene_path + "button28s.png",
    button29: main_scene_path + "button29.png",
    button29s: main_scene_path + "button29s.png",
    button30: main_scene_path + "button30.png",
    button31: main_scene_path + "button31.png",
    button32: main_scene_path + "button32.png",
    button33: main_scene_path + "button33.png",
    button34: main_scene_path + "button34.png",
    button35: main_scene_path + "button35.png",
    button36: main_scene_path + "button36.png",
    button36s: main_scene_path + "button36s.png",

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
    icon31: main_scene_path + "icon31.png",
    icon32: main_scene_path + "icon32.png",
    icon33: main_scene_path + "icon33.png",
    icon34: main_scene_path + "icon34.png",
    icon35: main_scene_path + "icon35.png",
    icon36: main_scene_path + "icon36.png",
    icon37: main_scene_path + "icon37.png",
    icon38: main_scene_path + "icon38.png",
    icon39: main_scene_path + "icon39.png",
    icon40: main_scene_path + "icon40.png",
    icon41: main_scene_path + "icon41.png",
    icon42: main_scene_path + "icon42.png",
    icon43: main_scene_path + "icon43.png",
    icon44: main_scene_path + "icon44.png",
    icon45: main_scene_path + "icon45.png",
    icon46: main_scene_path + "icon46.png",
    icon47: main_scene_path + "icon47.png",
    icon48: main_scene_path + "icon48.png",
    icon49: main_scene_path + "icon49.png",
    icon50: main_scene_path + "icon50.png",
    icon51: main_scene_path + "icon51.png",
    icon52: main_scene_path + "icon52.png",
    icon53: main_scene_path + "icon53.png",
    icon54: main_scene_path + "icon54.png",
    icon55: main_scene_path + "icon55.png",
    icon56: main_scene_path + "icon56.png",
    icon57: main_scene_path + "icon57.png",
    icon58: main_scene_path + "icon58.png",
    icon59: main_scene_path + "icon59.png",
    icon60: main_scene_path + "icon60.png",
    icon61: main_scene_path + "icon61.png",
    icon62: main_scene_path + "icon62.png",
    icon63: main_scene_path + "icon63.png",
    icon64: main_scene_path + "icon64.png",
    icon65: main_scene_path + "icon65.png",
    icon66: main_scene_path + "icon66.png",
    icon67: main_scene_path + "icon67.png",
    icon68: main_scene_path + "icon68.png",
    icon69: main_scene_path + "icon69.png",
    icon70: main_scene_path + "icon70.png",
    icon71: main_scene_path + "icon71.png",
    icon72: main_scene_path + "icon72.png",
    icon73: main_scene_path + "icon73.png",
    icon74: main_scene_path + "icon74.png",
    icon75: main_scene_path + "icon75.png",
    icon76: main_scene_path + "icon76.png",
    icon77: main_scene_path + "icon77.png",
    icon78: main_scene_path + "icon78.png",
    icon79: main_scene_path + "icon79.png",
    icon80: main_scene_path + "icon80.png",
    icon81: main_scene_path + "icon81.png",
    icon82: main_scene_path + "icon82.png",
    icon83: main_scene_path + "icon83.png",
    icon84: main_scene_path + "icon84.png",
    icon85: main_scene_path + "icon85.png",
    icon86: main_scene_path + "icon86.png",
    icon87: main_scene_path + "icon87.png",
    icon88: main_scene_path + "icon88.png",
    icon89: main_scene_path + "icon89.png",
    icon90: main_scene_path + "icon90.png",
    icon91: main_scene_path + "icon91.png",
    icon92: main_scene_path + "icon92.png",
    icon93: main_scene_path + "icon93.png",
    icon94: main_scene_path + "icon94.png",
    icon95: main_scene_path + "icon95.png",
    icon96: main_scene_path + "icon96.png",
    icon97: main_scene_path + "icon97.png",
    icon98: main_scene_path + "icon98.png",
    icon99: main_scene_path + "icon99.png",
    icon100: main_scene_path + "icon100.png",
    icon101: main_scene_path + "icon101.png",
    icon102: main_scene_path + "icon102.png",
    icon103: main_scene_path + "icon103.png",
    icon104: main_scene_path + "icon104.png",
    icon105: main_scene_path + "icon105.png",
    icon106: main_scene_path + "icon106.png",
    icon107: main_scene_path + "icon107.png",
    icon108: main_scene_path + "icon108.png",
    icon109: main_scene_path + "icon109.png",
    icon110: main_scene_path + "icon110.png",
    icon111: main_scene_path + "icon111.png",
    icon112: main_scene_path + "icon112.png",
    icon113: main_scene_path + "icon113.png",
    icon114: main_scene_path + "icon114.png",
    icon115: main_scene_path + "icon115.png",
    icon116: main_scene_path + "icon116.png",
    icon117: main_scene_path + "icon117.png",
    icon118: main_scene_path + "icon118.png",
    icon119: main_scene_path + "icon119.png",
    icon120: main_scene_path + "icon120.png",
    icon121: main_scene_path + "icon121.png",
    icon122: main_scene_path + "icon122.png",
    icon123: main_scene_path + "icon123.png",
    icon124: main_scene_path + "icon124.png",
    icon125: main_scene_path + "icon125.png",
    icon126: main_scene_path + "icon126.png",
    icon127: main_scene_path + "icon127.png",
    icon128: main_scene_path + "icon128.png",
    icon129: main_scene_path + "icon129.png",
    icon130: main_scene_path + "icon130.png",
    icon131: main_scene_path + "icon131.png",
    icon132: main_scene_path + "icon132.png",
    icon133: main_scene_path + "icon133.png",
    icon134: main_scene_path + "icon134.png",
    icon135: main_scene_path + "icon135.png"
};

var main_scene_res = [
    //image
    //plist
    //fnt
    //tmx
    //bgm
    //effect
];

for (var cardId = 1; cardId <= 6; ++cardId) {
    main_scene_image["card" + cardId + "_head1"] = main_scene_path + "card" + cardId + "_head1.png";
    main_scene_image["card" + cardId + "_head2"] = main_scene_path + "card" + cardId + "_head2.png";
    main_scene_image["card" + cardId + "_head3"] = main_scene_path + "card" + cardId + "_head3.png";

    main_scene_image["card" + cardId + "_head_lock1"] = main_scene_path + "card" + cardId + "_head_lock1.png";
    main_scene_image["card" + cardId + "_head_lock2"] = main_scene_path + "card" + cardId + "_head_lock2.png";
    main_scene_image["card" + cardId + "_head_lock3"] = main_scene_path + "card" + cardId + "_head_lock3.png";

    main_scene_image["card" + cardId + "_half1"] = main_scene_path + "card" + cardId + "_half1.png";
    main_scene_image["card" + cardId + "_half2"] = main_scene_path + "card" + cardId + "_half2.png";
    main_scene_image["card" + cardId + "_half3"] = main_scene_path + "card" + cardId + "_half3.png";

    main_scene_image["card" + cardId + "_full1"] = main_scene_path + "card" + cardId + "_full1.png";
    main_scene_image["card" + cardId + "_full2"] = main_scene_path + "card" + cardId + "_full2.png";
    main_scene_image["card" + cardId + "_full3"] = main_scene_path + "card" + cardId + "_full3.png";
}

for (var cardId = 1001; cardId <= 1003; ++cardId) {
    main_scene_image["card" + cardId + "_head1"] = main_scene_path + "card" + cardId + "_head1.png";
    main_scene_image["card" + cardId + "_half1"] = main_scene_path + "card" + cardId + "_half1.png";
    main_scene_image["card" + cardId + "_full1"] = main_scene_path + "card" + cardId + "_full1.png";
}

for (var taskId = 1; taskId <= 5; ++taskId) {
    main_scene_image["task" + taskId] = main_scene_path + "task" + taskId + ".png";
}

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
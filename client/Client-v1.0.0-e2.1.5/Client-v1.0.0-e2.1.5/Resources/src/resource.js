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
    bg19: main_scene_path + "bg19.png",

    player_details_bg: main_scene_path + "player_details_bg.png",
    lv_bg: main_scene_path + "lv_bg.png",
    exp_bg: main_scene_path + "exp_bg.png",
    exp: main_scene_path + "exp.png",
    main_message_bg: main_scene_path + "main_message_bg.png",
    star1: main_scene_path + "star1.png",
    star2: main_scene_path + "star2.png",
    star3: main_scene_path + "star3.png",
    ladder1: main_scene_path + "ladder1.png",
    ladder2: main_scene_path + "ladder2.png",
    cloud: main_scene_path + "cloud.png",
    gameFrame: main_scene_path + "gameFrame.png",

    card0: main_scene_path + "card0.png",

    spirit1: main_scene_path + "spirit1.png",
    spirit2: main_scene_path + "spirit2.png",
    spirit3: main_scene_path + "spirit3.png",
    spirit4: main_scene_path + "spirit4.png",
    spirit5: main_scene_path + "spirit5.png",
    spirit6: main_scene_path + "spirit6.png",
    spirit7: main_scene_path + "spirit7.png",
    spirit8: main_scene_path + "spirit8.png",
    spirit9: main_scene_path + "spirit9.png",
    spirit10: main_scene_path + "spirit10.png",

    spirit_side: main_scene_path + "spirit_side.png",

    spirit_face1: main_scene_path + "spirit_face1.png",
    spirit_face2: main_scene_path + "spirit_face2.png",
    spirit_face3: main_scene_path + "spirit_face3.png",


    progress1: main_scene_path + "progress1.png",
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

    vip1: main_scene_path + "vip1.png",
    vip2: main_scene_path + "vip2.png",
    vip3: main_scene_path + "vip3.png",
    vip4: main_scene_path + "vip4.png",
    vip5: main_scene_path + "vip5.png",
    vip6: main_scene_path + "vip6.png",
    vip7: main_scene_path + "vip7.png",
    vip8: main_scene_path + "vip8.png",
    vip9: main_scene_path + "vip9.png",
    vip10: main_scene_path + "vip10.png",
    vip11: main_scene_path + "vip11.png",
    vip12: main_scene_path + "vip12.png",

    num_red_0: main_scene_path + "num_red_0.png",
    num_red_1: main_scene_path + "num_red_1.png",
    num_red_2: main_scene_path + "num_red_2.png",
    num_red_3: main_scene_path + "num_red_3.png",
    num_red_4: main_scene_path + "num_red_4.png",
    num_red_5: main_scene_path + "num_red_5.png",
    num_red_6: main_scene_path + "num_red_6.png",
    num_red_7: main_scene_path + "num_red_7.png",
    num_red_8: main_scene_path + "num_red_8.png",
    num_red_9: main_scene_path + "num_red_9.png",

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
    button18: main_scene_path + "button18.png",
    button18s: main_scene_path + "button18s.png",
    button19: main_scene_path + "button19.png",
    button19s: main_scene_path + "button19s.png",
    button20: main_scene_path + "button20.png",
    button20s: main_scene_path + "button20s.png",
    button20d: main_scene_path + "button20d.png",
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
    button25d: main_scene_path + "button25d.png",
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
    button37: main_scene_path + "button37.png",
    button37s: main_scene_path + "button37s.png",
    button38: main_scene_path + "button38.png",
    button38s: main_scene_path + "button38s.png",
    button39: main_scene_path + "button39.png",
    button39s: main_scene_path + "button39s.png",
    button40: main_scene_path + "button40.png",
    button40s: main_scene_path + "button40s.png",
    button40d: main_scene_path + "button40d.png",
    button41: main_scene_path + "button41.png",
    button41s: main_scene_path + "button41s.png",
    button42: main_scene_path + "button42.png",
    button43: main_scene_path + "button43.png",

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
    icon135: main_scene_path + "icon135.png",
    icon136: main_scene_path + "icon136.png",
    icon137: main_scene_path + "icon137.png",
    icon138: main_scene_path + "icon138.png",
    icon139: main_scene_path + "icon139.png",
    icon140: main_scene_path + "icon140.png",
    icon141: main_scene_path + "icon141.png",
    icon142: main_scene_path + "icon142.png",
    icon143: main_scene_path + "icon143.png",
    icon144: main_scene_path + "icon144.png",
    icon145: main_scene_path + "icon145.png",
    icon146: main_scene_path + "icon146.png",
    icon147: main_scene_path + "icon147.png",
    icon148: main_scene_path + "icon148.png",
    icon149: main_scene_path + "icon149.png",
    icon150: main_scene_path + "icon150.png",
    icon151: main_scene_path + "icon151.png",
    icon152: main_scene_path + "icon152.png",
    icon153: main_scene_path + "icon153.png",
    icon154: main_scene_path + "icon154.png",
    icon155: main_scene_path + "icon155.png",
    icon156: main_scene_path + "icon156.png",
    icon157: main_scene_path + "icon157.png",
    icon158: main_scene_path + "icon158.png",
    icon159: main_scene_path + "icon159.png",
    icon160: main_scene_path + "icon160.png",
    icon161: main_scene_path + "icon161.png",
    icon162: main_scene_path + "icon162.png",
    icon163: main_scene_path + "icon163.png",
    icon164: main_scene_path + "icon164.png",
    icon165: main_scene_path + "icon165.png",
    icon166: main_scene_path + "icon166.png",
    icon167: main_scene_path + "icon167.png",
    icon168: main_scene_path + "icon168.png",
    icon169: main_scene_path + "icon169.png",
    icon170: main_scene_path + "icon170.png",
    icon171: main_scene_path + "icon171.png",
    icon172: main_scene_path + "icon172.png",
    icon173: main_scene_path + "icon173.png",
    icon174: main_scene_path + "icon174.png",
    icon175: main_scene_path + "icon175.png",
    icon176: main_scene_path + "icon176.png",
    icon177: main_scene_path + "icon177.png",
    icon178: main_scene_path + "icon178.png",
    icon179: main_scene_path + "icon179.png",
    icon180: main_scene_path + "icon180.png",
    icon181: main_scene_path + "icon181.png",
    icon182: main_scene_path + "icon182.png",
    icon183: main_scene_path + "icon183.png",
    icon184: main_scene_path + "icon184.png",
    icon185: main_scene_path + "icon185.png",
    icon186: main_scene_path + "icon186.png",
    icon187: main_scene_path + "icon187.png",
    icon188: main_scene_path + "icon188.png",
    icon189: main_scene_path + "icon189.png",
    icon190: main_scene_path + "icon190.png",
    icon191: main_scene_path + "icon191.png",
    icon192: main_scene_path + "icon192.png",
    icon193: main_scene_path + "icon193.png",
    icon194: main_scene_path + "icon194.png",
    icon195: main_scene_path + "icon195.png",
    icon196: main_scene_path + "icon196.png",
    icon197: main_scene_path + "icon197.png",
    icon198: main_scene_path + "icon198.png",
    icon199: main_scene_path + "icon199.png",
    icon200: main_scene_path + "icon200.png",
    icon201: main_scene_path + "icon201.png",
    icon202: main_scene_path + "icon202.png",
    icon203: main_scene_path + "icon203.png",
    icon204: main_scene_path + "icon204.png",
    icon205: main_scene_path + "icon205.png",
    icon206: main_scene_path + "icon206.png",
    icon207: main_scene_path + "icon207.png",
    icon208: main_scene_path + "icon208.png",
    icon209: main_scene_path + "icon209.png",
    icon210: main_scene_path + "icon210.png",
    icon211: main_scene_path + "icon211.png",
    icon212: main_scene_path + "icon212.png",
    icon213: main_scene_path + "icon213.png",
    icon214: main_scene_path + "icon214.png",
    icon215: main_scene_path + "icon215.png",
    icon216: main_scene_path + "icon216.png",
    icon217: main_scene_path + "icon217.png",
    icon218: main_scene_path + "icon218.png",
    icon219: main_scene_path + "icon219.png",
    icon220: main_scene_path + "icon220.png",
    icon221: main_scene_path + "icon221.png",
    icon222: main_scene_path + "icon222.png",
    icon223: main_scene_path + "icon223.png",
    icon224: main_scene_path + "icon224.png",
    icon225: main_scene_path + "icon225.png",
    icon226: main_scene_path + "icon226.png",
    icon227: main_scene_path + "icon227.png",
    icon228: main_scene_path + "icon228.png",
    icon229: main_scene_path + "icon229.png",
    icon230: main_scene_path + "icon230.png",
    icon231: main_scene_path + "icon231.png",
    icon232: main_scene_path + "icon232.png",
    icon233: main_scene_path + "icon233.png",
    icon234: main_scene_path + "icon234.png",
    icon235: main_scene_path + "icon235.png",
    icon236: main_scene_path + "icon236.png",
    icon237: main_scene_path + "icon237.png",
    icon238: main_scene_path + "icon238.png",
    icon239: main_scene_path + "icon239.png",
    icon240: main_scene_path + "icon240.png"
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

for (var taskId = 1; taskId <= 50; ++taskId) {
    main_scene_image["task" + taskId] = main_scene_path + "task" + taskId + ".png";
}

var effectConfig = [
    10,
    10,
    10,
    5,
    6,
    7,
    8,
    8,
    6
];

var effectRect = [
    cc.rect(0, 0, 160, 80),
    cc.rect(0, 0, 132, 132),
    cc.rect(0, 0, 640, 218),
    cc.rect(0, 0, 600, 713),
    cc.rect(0, 0, 120, 275),
    cc.rect(0, 0, 182, 171),
    cc.rect(0, 0, 170, 185),
    cc.rect(0, 0, 83, 261),
    cc.rect(0, 0, 251, 279)

];

for (var effectId = 0; effectId < effectConfig.length; ++effectId) {
    for (var frameI = 0; frameI < effectConfig[effectId]; ++frameI) {
        main_scene_image["effect" + effectId + "_frame" + frameI] = "res/effect/" + effectId + "/" + frameI + ".png";
    }
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
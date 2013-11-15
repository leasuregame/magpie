var SETTING_IS_BROWSER = false;
if (typeof(navigator) != 'undefined') {
    SETTING_IS_BROWSER = true;
}

// main scene res
var main_scene_path = "../res/main/";
var effect_scene_path = "../res/effect/";
var ccb_scene_path = "../res/ccb/";

var main_scene_image = {
    bg1: main_scene_path + "bg1.png",
    bg2: main_scene_path + "bg2.png",
    // bg3: main_scene_path + "bg3.png",
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
//    bg14: main_scene_path + "bg14.png",
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

    // pve_bg1: main_scene_path + "pve_bg1.png",
    // pvp_bg1: main_scene_path + "pvp_bg1.png",

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

    // card_item_frame: main_scene_path + "card_item_frame.png",

    button0: main_scene_path + "button0.png",
    button0s: main_scene_path + "button0s.png",
    button1: main_scene_path + "button1.png",
    button1s: main_scene_path + "button1s.png",
    button2: main_scene_path + "button2.png",
    button2s: main_scene_path + "button2s.png",
    button2d: main_scene_path + "button2d.png",
//    button3: main_scene_path + "button3.png",
//    button3s: main_scene_path + "button3s.png",
//    button4: main_scene_path + "button4.png",
//    button4s: main_scene_path + "button4s.png",
//    button5: main_scene_path + "button5.png",
//    button5s: main_scene_path + "button5s.png",
//    button6: main_scene_path + "button6.png",
//    button6s: main_scene_path + "button6s.png",
//    button7: main_scene_path + "button7.png",
//    button7s: main_scene_path + "button7s.png",
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
//    button17: main_scene_path + "button17.png",
//    button17s: main_scene_path + "button17s.png",
//    button18: main_scene_path + "button18.png",
//    button18s: main_scene_path + "button18s.png",
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
//    button26: main_scene_path + "button26.png",
//    button26s: main_scene_path + "button26s.png",
//    button27: main_scene_path + "button27.png",
//    button27s: main_scene_path + "button27s.png",
//    button28: main_scene_path + "button28.png",
//    button28s: main_scene_path + "button28s.png",
//    button29: main_scene_path + "button29.png",
//    button29s: main_scene_path + "button29s.png",
    button30: main_scene_path + "button30.png",
    button31: main_scene_path + "button31.png",
    button32: main_scene_path + "button32.png",
    button33: main_scene_path + "button33.png",
    button34: main_scene_path + "button34.png",
//    button35: main_scene_path + "button35.png",
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
    button44: main_scene_path + "button44.png",
    button45: main_scene_path + "button45.png",
    button46: main_scene_path + "button46.png",
    button46s: main_scene_path + "button46s.png",
    button47: main_scene_path + "button47.png",
    button47s: main_scene_path + "button47s.png",
    button48: main_scene_path + "button48.png",
    button48s: main_scene_path + "button48s.png",
    button49: main_scene_path + "button49.png",
    button49s: main_scene_path + "button49s.png",
    button50: main_scene_path + "button50.png",
    button50s: main_scene_path + "button50s.png",
    button51: main_scene_path + "button51.png",
    button51s: main_scene_path + "button51s.png",
    button52: main_scene_path + "button52.png",
    button52s: main_scene_path + "button52s.png",
    button53: main_scene_path + "button53.png",
    button53s: main_scene_path + "button53s.png",
    button54: main_scene_path + "button54.png",
    button54s: main_scene_path + "button54s.png",
    button55: main_scene_path + "button55.png",
    button55s: main_scene_path + "button55s.png",
    button56: main_scene_path + "button56.png",
    button56s: main_scene_path + "button56s.png",
    button57: main_scene_path + "button57.png",
    button57s: main_scene_path + "button57s.png",
    button58: main_scene_path + "button58.png",
    button58s: main_scene_path + "button58s.png",
    button59: main_scene_path + "button59.png",
    button59s: main_scene_path + "button59s.png",
    button60: main_scene_path + "button60.png",
    button60s: main_scene_path + "button60s.png",


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
//    icon42: main_scene_path + "icon42.png",
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
//    icon93: main_scene_path + "icon93.png",
    icon94: main_scene_path + "icon94.png",
//    icon95: main_scene_path + "icon95.png",
    icon96: main_scene_path + "icon96.png",
    icon97: main_scene_path + "icon97.png",
    icon98: main_scene_path + "icon98.png",
    icon99: main_scene_path + "icon99.png",
    icon100: main_scene_path + "icon100.png",
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
//    icon113: main_scene_path + "icon113.png",
//    icon114: main_scene_path + "icon114.png",
//    icon115: main_scene_path + "icon115.png",
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
//    icon126: main_scene_path + "icon126.png",
    icon127: main_scene_path + "icon127.png",
    icon128: main_scene_path + "icon128.png",
    icon129: main_scene_path + "icon129.png",
    icon130: main_scene_path + "icon130.png",
    icon131: main_scene_path + "icon131.png",
//    icon132: main_scene_path + "icon132.png",
    icon133: main_scene_path + "icon133.png",
    icon134: main_scene_path + "icon134.png",
    icon135: main_scene_path + "icon135.png",
    icon136: main_scene_path + "icon136.png",
    icon137: main_scene_path + "icon137.png",
    icon138: main_scene_path + "icon138.png",
    icon139: main_scene_path + "icon139.png",
    icon140: main_scene_path + "icon140.png",
//    icon141: main_scene_path + "icon141.png",
    icon142: main_scene_path + "icon142.png",
    icon143: main_scene_path + "icon143.png",
//    icon144: main_scene_path + "icon144.png",
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
    icon240: main_scene_path + "icon240.png",
    icon241: main_scene_path + "icon241.png",
    icon242: main_scene_path + "icon242.png",
    icon243: main_scene_path + "icon243.png",
    icon244: main_scene_path + "icon244.png",
    icon245: main_scene_path + "icon245.png",
    icon246: main_scene_path + "icon246.png",
    icon247: main_scene_path + "icon247.png",
    icon248: main_scene_path + "icon248.png",
    icon249: main_scene_path + "icon249.png",
    icon250: main_scene_path + "icon250.png",
    icon251: main_scene_path + "icon251.png",
    icon252: main_scene_path + "icon252.png",
    icon253: main_scene_path + "icon253.png",
    icon254: main_scene_path + "icon254.png",
    icon255: main_scene_path + "icon255.png",
    icon256: main_scene_path + "icon256.png",

    
    
    screen: effect_scene_path + "screen.jpg",
    tanxian: effect_scene_path + "tanxian.jpg",
    xiantai: effect_scene_path + "xiantai.jpg",
    xiulian: effect_scene_path + "xiulian.jpg",
    yuanshen: effect_scene_path + "yuanshen.jpg",
    zhaohuan: effect_scene_path + "zhaohuan.jpg",
    testBg: effect_scene_path + "testBg.png",
    tiaoshi: effect_scene_path + "tiaoshi.jpg",
    up1: effect_scene_path + "up1.png",






    // 新手图片
    empty: effect_scene_path + "NewPlayer/" + "empty.png",
    hand: effect_scene_path + "NewPlayer/" + "hand.png",
    light: effect_scene_path + "NewPlayer/" + "light.png",
    yuanshen: effect_scene_path + "NewPlayer/" + "yuanshen.png",
    talking: effect_scene_path + "NewPlayer/" + "talking.png",


    //整理好的图片
    p1: effect_scene_path + "effect/" + "p1.png",
    p2: effect_scene_path + "effect/" + "p2.png",
    p3: effect_scene_path + "effect/" + "p3.png",
    p4: effect_scene_path + "effect/" + "p4.png",
    p5: effect_scene_path + "effect/" + "p5.png",
    p6: effect_scene_path + "effect/" + "p6.png",
    p7: effect_scene_path + "effect/" + "p7.png",
    p8: effect_scene_path + "effect/" + "p8.png",
    p9: effect_scene_path + "effect/" + "p9.png",
    p10: effect_scene_path + "effect/" + "p10.png",
    p11: effect_scene_path + "effect/" + "p11.png",
    p12: effect_scene_path + "effect/" + "p12.png",
    p13: effect_scene_path + "effect/" + "p13.png",
    p14: effect_scene_path + "effect/" + "p14.png",
    p15: effect_scene_path + "effect/" + "p15.png",
    p16: effect_scene_path + "effect/" + "p16.png",
    p17: effect_scene_path + "effect/" + "p17.png",
    p18: effect_scene_path + "effect/" + "p18.png",
    p19: effect_scene_path + "effect/" + "p19.png",
    p20: effect_scene_path + "effect/" + "p20.png",
    p21: effect_scene_path + "effect/" + "p21.png",
    p22: effect_scene_path + "effect/" + "p22.png",
    p23: effect_scene_path + "effect/" + "p23.png",
    p24: effect_scene_path + "effect/" + "p24.png",
    p25: effect_scene_path + "effect/" + "p25.png",
    p26: effect_scene_path + "effect/" + "p26.png",
    p27: effect_scene_path + "effect/" + "p27.png",
    p28: effect_scene_path + "effect/" + "p28.png",
    p29: effect_scene_path + "effect/" + "p29.png",
    p30: effect_scene_path + "effect/" + "p30.png",
    p31: effect_scene_path + "effect/" + "p31.png",
    p32: effect_scene_path + "effect/" + "p32.png",
    p33: effect_scene_path + "effect/" + "p33.png",
    p34: effect_scene_path + "effect/" + "p34.png",
    p35: effect_scene_path + "effect/" + "p35.png",
    p36: effect_scene_path + "effect/" + "p36.png",
    p37: effect_scene_path + "effect/" + "p37.png",
    p38: effect_scene_path + "effect/" + "p38.png",
    p39: effect_scene_path + "effect/" + "p39.png",
    p40: effect_scene_path + "effect/" + "p40.png",
    p41: effect_scene_path + "effect/" + "p41.png",
    p42: effect_scene_path + "effect/" + "p42.png",
    p43: effect_scene_path + "effect/" + "p43.png",
    p44: effect_scene_path + "effect/" + "p44.png",
    p45: effect_scene_path + "effect/" + "p45.png",
    

    //UI特效
    up1: effect_scene_path + "uiEffect/" + "up1.png",
    up2: effect_scene_path + "uiEffect/" + "up2.png",
    up3: effect_scene_path + "uiEffect/" + "up3.png",
    up4: effect_scene_path + "uiEffect/" + "up4.png",
    up5: effect_scene_path + "uiEffect/" + "up5.png",
    up6: effect_scene_path + "uiEffect/" + "up6.png",
    up7: effect_scene_path + "uiEffect/" + "up7.png",
    up8: effect_scene_path + "uiEffect/" + "up8.png",
    up9: effect_scene_path + "uiEffect/" + "up9.png",
    up10: effect_scene_path + "uiEffect/" + "up10.png",
    up11: effect_scene_path + "uiEffect/" + "up11.png",
    up12: effect_scene_path + "uiEffect/" + "up12.png",
    up13: effect_scene_path + "uiEffect/" + "up13.png",
    up14: effect_scene_path + "uiEffect/" + "up14.png",
    up15: effect_scene_path + "uiEffect/" + "up15.png",
    up16: effect_scene_path + "uiEffect/" + "up16.png",
    up17: effect_scene_path + "uiEffect/" + "up17.png",
    up18: effect_scene_path + "uiEffect/" + "up18.png",
    up19: effect_scene_path + "uiEffect/" + "up19.png",
    up20: effect_scene_path + "uiEffect/" + "up20.png",
    up21: effect_scene_path + "uiEffect/" + "up21.png",
    up22: effect_scene_path + "uiEffect/" + "up22.png",
    up23: effect_scene_path + "uiEffect/" + "up23.png",
    up24: effect_scene_path + "uiEffect/" + "up24.png",
    up25: effect_scene_path + "uiEffect/" + "up25.png",
    up26: effect_scene_path + "uiEffect/" + "up26.png",
    up27: effect_scene_path + "uiEffect/" + "up27.png",
    up28: effect_scene_path + "uiEffect/" + "up28.png",
    up29: effect_scene_path + "uiEffect/" + "up29.png",
    up30: effect_scene_path + "uiEffect/" + "up30.png",
    up31: effect_scene_path + "uiEffect/" + "up31.png",
    up32: effect_scene_path + "uiEffect/" + "up32.png",
    up33: effect_scene_path + "uiEffect/" + "up33.png",
    up34: effect_scene_path + "uiEffect/" + "up34.png",
    up35: effect_scene_path + "uiEffect/" + "up35.png",
    up36: effect_scene_path + "uiEffect/" + "up36.png",
    up37: effect_scene_path + "uiEffect/" + "up37.png",
    up38: effect_scene_path + "uiEffect/" + "up38.png",
    up39: effect_scene_path + "uiEffect/" + "up39.png",
    up40: effect_scene_path + "uiEffect/" + "up40.png",
    up41: effect_scene_path + "uiEffect/" + "up41.png",
    up42: effect_scene_path + "uiEffect/" + "up42.png",
    up43: effect_scene_path + "uiEffect/" + "up43.png",
    up44: effect_scene_path + "uiEffect/" + "up44.png",
    up45: effect_scene_path + "uiEffect/" + "up45.png",
    up46: effect_scene_path + "uiEffect/" + "up46.png",
    up47: effect_scene_path + "uiEffect/" + "up47.png",
    up48: effect_scene_path + "uiEffect/" + "up48.png",
    up49: effect_scene_path + "uiEffect/" + "up49.png",
    up50: effect_scene_path + "uiEffect/" + "up50.png",
    up51: effect_scene_path + "uiEffect/" + "up51.png",
    up52: effect_scene_path + "uiEffect/" + "up52.png",
    up53: effect_scene_path + "uiEffect/" + "up53.png",
    up54: effect_scene_path + "uiEffect/" + "up54.png",
    up55: effect_scene_path + "uiEffect/" + "up55.png",
    up56: effect_scene_path + "uiEffect/" + "up56.png",
    up57: effect_scene_path + "uiEffect/" + "up57.png",
    up58: effect_scene_path + "uiEffect/" + "up58.png",
    up59: effect_scene_path + "uiEffect/" + "up59.png",
    up60: effect_scene_path + "uiEffect/" + "up60.png",
    up61: effect_scene_path + "uiEffect/" + "up61.png",
    up62: effect_scene_path + "uiEffect/" + "up62.png",
    up63: effect_scene_path + "uiEffect/" + "up63.png",
    up64: effect_scene_path + "uiEffect/" + "up64.png",
    up65: effect_scene_path + "uiEffect/" + "up65.png",
    up66: effect_scene_path + "uiEffect/" + "up66.png",
    up67: effect_scene_path + "uiEffect/" + "up67.png",
    up68: effect_scene_path + "uiEffect/" + "up68.png",
    up69: effect_scene_path + "uiEffect/" + "up69.png",
    up70: effect_scene_path + "uiEffect/" + "up70.png",
    up71: effect_scene_path + "uiEffect/" + "up71.png",
    up72: effect_scene_path + "uiEffect/" + "up72.png",
    up73: effect_scene_path + "uiEffect/" + "up73.png",





    texiao8: ccb_scene_path + "texiao8.ccbi",
    tutorials1: ccb_scene_path + "tutorials1.ccbi",
    tutorials2: ccb_scene_path + "tutorials2.ccbi",
    tutorials3: ccb_scene_path + "tutorials3.ccbi",
    tutorials4: ccb_scene_path + "tutorials4.ccbi",
    tutorials5: ccb_scene_path + "tutorials5.ccbi",
    tutorials6: ccb_scene_path + "tutorials6.ccbi",
    tutorials7: ccb_scene_path + "tutorials7.ccbi",
    tutorials8: ccb_scene_path + "tutorials8.ccbi",
    tutorials9: ccb_scene_path + "tutorials9.ccbi",
    tutorials10: ccb_scene_path + "tutorials10.ccbi",
    tutorials11: ccb_scene_path + "tutorials11.ccbi",
    tutorials12: ccb_scene_path + "tutorials12.ccbi",
    tutorials13: ccb_scene_path + "tutorials13.ccbi",
    tutorials14: ccb_scene_path + "tutorials14.ccbi",
    tutorials15: ccb_scene_path + "tutorials15.ccbi",
    tutorials16: ccb_scene_path + "tutorials16.ccbi",
    testBattleNode: ccb_scene_path + "testBattleNode.ccbi",
    spiritNode: ccb_scene_path + "spiritNode.ccbi",
    battleNode: ccb_scene_path + "battleNode.ccbi",






    // 完成特效
    effect1: ccb_scene_path + "effect1.ccbi", 
    effect2: ccb_scene_path + "effect2.ccbi", 
    effect3: ccb_scene_path + "effect3.ccbi", 
    effect4: ccb_scene_path + "effect4.ccbi", 
    effect5: ccb_scene_path + "effect5.ccbi",
    effect6: ccb_scene_path + "effect6.ccbi", 
    effect7: ccb_scene_path + "effect7.ccbi", 
    effect8: ccb_scene_path + "effect8.ccbi", 
    effect9: ccb_scene_path + "effect9.ccbi", 
    effect10: ccb_scene_path + "effect10.ccbi", 
    effect11: ccb_scene_path + "effect11.ccbi", 
    effect12: ccb_scene_path + "effect12.ccbi", 
    effect13: ccb_scene_path + "effect13.ccbi", 
    effect14: ccb_scene_path + "effect14.ccbi", 
    effect15: ccb_scene_path + "effect15.ccbi", 
    uiEffect1: ccb_scene_path + "uiEffect1.ccbi", 
    uiEffect2: ccb_scene_path + "uiEffect2.ccbi", 
    uiEffect3: ccb_scene_path + "uiEffect3.ccbi", 
    uiEffect4: ccb_scene_path + "uiEffect4.ccbi", 
    uiEffect5: ccb_scene_path + "uiEffect5.ccbi", 
    uiEffect6: ccb_scene_path + "uiEffect6.ccbi",
    uiEffect7: ccb_scene_path + "uiEffect7.ccbi",
    uiEffect8: ccb_scene_path + "uiEffect8.ccbi",
    uiEffect9: ccb_scene_path + "uiEffect9.ccbi",
    uiEffect10: ccb_scene_path + "uiEffect10.ccbi",
    uiEffect11: ccb_scene_path + "uiEffect11.ccbi",
    uiEffect12: ccb_scene_path + "uiEffect12.ccbi",
    uiEffect13: ccb_scene_path + "uiEffect13.ccbi",
    uiEffect14: ccb_scene_path + "uiEffect14.ccbi",
    uiEffect15: ccb_scene_path + "uiEffect15.ccbi",
    uiEffect16: ccb_scene_path + "uiEffect16.ccbi",
    uiEffect17: ccb_scene_path + "uiEffect17.ccbi",
    uiEffect18: ccb_scene_path + "uiEffect18.ccbi",
    uiEffect19: ccb_scene_path + "uiEffect19.ccbi",
    uiEffect20: ccb_scene_path + "uiEffect20.ccbi",
    uiEffect21: ccb_scene_path + "uiEffect21.ccbi",
    uiEffect22: ccb_scene_path + "uiEffect22.ccbi",
    uiEffect23: ccb_scene_path + "uiEffect23.ccbi",
    uiEffect24: ccb_scene_path + "uiEffect24.ccbi",
    uiEffect25: ccb_scene_path + "uiEffect25.ccbi",
    uiEffect26: ccb_scene_path + "uiEffect26.ccbi",
    uiEffect27: ccb_scene_path + "uiEffect27.ccbi",
    uiEffect28: ccb_scene_path + "uiEffect28.ccbi",
    uiEffect29: ccb_scene_path + "uiEffect29.ccbi",
    uiEffect30: ccb_scene_path + "uiEffect30.ccbi",
    uiEffect31: ccb_scene_path + "uiEffect31.ccbi",
    uiEffect32: ccb_scene_path + "uiEffect32.ccbi",
    
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
    6,
    8,
    6,
    12,
    8,
    4,
    4
];

var effectRect = [
    cc.rect(0, 0, 160, 80),
    cc.rect(0, 0, 132, 132),
    cc.rect(0, 0, 640, 218),
    cc.rect(0, 0, 600, 713),
    cc.rect(0, 0, 120, 275),
    cc.rect(0, 0, 182, 171),
    cc.rect(0, 0, 250, 275),
    cc.rect(0, 0, 83, 261),
    cc.rect(0, 0, 251, 279),
    cc.rect(0, 0, 188, 263),
    cc.rect(0, 0, 464, 391),
    cc.rect(0, 0, 280, 308),
    cc.rect(0, 0, 170, 185)
];

for (var effectId = 0; effectId < effectConfig.length; ++effectId) {
    for (var frameI = 0; frameI < effectConfig[effectId]; ++frameI) {
        main_scene_image["effect" + effectId + "_frame" + frameI] = effect_scene_path + effectId + "/" + frameI + ".png";
    }
}

for (var key in main_scene_image) {
    main_scene_res.push({src: main_scene_image[key]});
}


//字体
main_scene_res.push({src: "../res/font/skillName.fnt"});
main_scene_res.push({src: "../res/font/skillName.png"});
main_scene_res.push({src: "../res/font/tipNumber.fnt"});
main_scene_res.push({src: "../res/font/tipNumber.png"});


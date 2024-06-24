const translates = {

    //测试
    digongjuren: "工具人",
    diceshi: "测试",
    diceshi_info: "出牌阶段，你摸50张牌。",
    //甘雨
    diganyu: "甘雨",
    dishuanghua: "霜华",
    dishuanghua_info: "锁定技。你的攻击范围+2。你手牌中的黑色【杀】均视为冰【杀】。你使用冰【杀】即将造成伤害时，可弃置一张手牌对距离目标1以内的其他角色各造成一点伤害。",
    dilinji: "麟迹",
    dilinji_info: "锁定技，若你没有手牌，你至其他角色的距离+1。",
    //重岳
    dichongyue: "重岳",
    diwanxiang: "万象",
    diwanxiang_info: "锁定技，游戏开始时，你摸三张牌；摸牌阶段，你多摸一张牌；你的手牌上限等于体力上限。",
    diwowu: "我无",
    diwowu_info: "回合内你每使用三张牌摸一张牌。发动两次后，你升级【我无】并立即触发一次。",
    diwowu_v2: "我无",
    diwowu_v2_info: "回合内你每使用三张牌摸两张牌。每发动一次，你本回合使用【杀】的次数上限+1。",
    //刃
    diren: "刃",
    diyubian: "狱变",
    diyubian_info: "出牌阶段限一次，你可流失一点体力，记录你已损失的体力为X，使本回合获得如下效果：锁定技，你使用【杀】的次数上限+X，使用【杀】造成伤害时，你流失一点体力并摸X张牌。若你的体力为一，【狱变】触发的所有体力流失效果不会生效。",
    dizangsong: "葬送",
    dizangsong_info: "锁定技。你受到伤害或流失体力后，获得1层【赐】。任意角色的结束阶段，若你拥有至少5层【赐】，你回复一点体力并获得一个额外回合。",
    diwansi: "万死",
    diwansi_info: "限定技，当你处于濒死状态，你将体力回复至3点并将3张杀置入你的手牌。",
    //罗刹
    diluocha: "罗刹",
    diqiwang: "祈望",
    diqiwang_info: "有角色陷入濒死状态时，你可弃置两张手牌回复其一点体力，若该角色是你自己，你只需弃置一张手牌。",
    dilunzhuan: "轮转",
    dilunzhuan_info: "【转换技】【白花】你造成伤害时，可弃置一张红色手牌取消该伤害改为回复其一点体力。【黑渊】当有角色回复体力时，你可弃置一张黑色手牌使回复量-1。",
    diguizang: "归葬",
    diguizang_info: "觉醒技。准备阶段，若场上死亡角色大于等于一半，你获得其他所有角色各一张随机手牌，选择删去【轮转】其中一个分支并将另一个分支修改为每轮限一次，获得【再临】。",
    dizailin: "再临",
    dizailin_info: "限定技。出牌阶段，若你有两种颜色的手牌，你可弃置你区域内所有的牌，复活一名死亡的角色，使其体力回复至2点并摸3张牌。",
    dibaihua: "白花",
    dibaihua_info: "每轮限一次，你造成伤害时，可弃置一张红色手牌取消该伤害改为回复其一点体力。",
    diheiyuan: "黑渊",
    diheiyuan_info: "每轮限一次，当有角色回复体力时，你可弃置一张黑色手牌使回复量-1。",
    //玛恩纳
    dimaenna: "玛恩纳",
    dilifeng: "砺锋",
    dilifeng_info: "锁定技，结束阶段，若你本回合没有打出过杀，你获得一个【勋】并摸一张牌。",
    diyouxia: "游侠",
    diyouxia_info: "当一名其他角色成为【杀】的目标后，若其与你的距离不大于1且此杀的使用者不为你，你可将此【杀】的目标修改为你并获得一个【勋】。",
    dilinguang: "临光",
    dilinguang_info: "出牌阶段，你可弃置任意个【勋】，摸X张牌并执行前X项（X为你弃置的【勋】的个数）：1.本回合攻击范围+2；2.本回合使用【杀】可额外指定一个目标；3.本回合使用【杀】不可被响应；4.本回合使用【杀】无次数限制；5.摸X-3张牌。若你的体力为全场最少，你可多执行一项。当有角色在你的回合内陷入濒死状态时，该回合你不能再使用【杀】。",
    //黄泉
    dihuangquan: "黄泉",
    dijinran: "尽染",
    dijinran_info: "锁定技，每次有牌进入任意角色判定区时，你获得一层【残梦】。",
    dihongye: "红叶",
    dihongye_info: "当你使用【杀】对其他角色造成伤害时，你可取消此伤害，改为获得其一张牌，并移动场上一张牌。",
    diyuzhan: "雨斩",
    diyuzhan_info: "限定技，出牌阶段若你的【残梦】数量大于等于9，你可弃置所有【残梦】，视为依次执行（除非无牌可弃否则无法跳过，且可对自己造成伤害）：1.对一名角色造成一点雷属性伤害；2.弃置两张牌，对一名角色造成一点雷属性伤害并弃置其装备区所有牌（不能为1选择的角色）；3.弃置两张牌，对一名角色造成一点雷属性伤害并将其翻面（不能为1、2选择的角色）；4.如果本场游戏你累计造成的雷属性伤害大于目前存活的人数，你对所有角色造成一点雷属性伤害。 ",
    //琴柳
    diqinliu: "琴柳",
    dihuizhi: "辉帜",
    dihuizhi1: "辉帜",
    dihuizhi2: "辉帜",
    dihuizhi3: "辉帜",
    dihuizhi4: "辉帜",
    dihuizhi_info: "你可选择任意项：1.跳过判定阶段，将一张手牌置于武将牌上称为【号令】（若已有【号令】则改为用一张手牌交换之），当有角色进行判定时你可打出【号令】代替判定牌；2.跳过摸牌阶段，令一名其他角色摸两张牌并回复一点体力；3.跳过出牌阶段，回复一点体力并令一名其他角色下回合出【杀】次数+1；4.跳过弃牌阶段，令一名其他角色下回合手牌上限+1。回合结束时，若X=2，你失去一点体力；X=3，你翻面；X=4，你失去一点体力上限。（X为你本回合跳过的阶段数）",
    //静默猎手
    dijingmolieshou: "静默猎手",
    dizaji: "杂技",
    dizaji_info: "出牌阶段限一次，你可摸三张牌并弃置一张手牌。若如此做，本回合你不能使用【杀】且你使用的锦囊牌只能指定一名角色为目标。",
    dizhanshu: "战术",
    dizhanshu_info: "每回合限一次，当你于非弃牌阶段被弃置牌，或于回合外使用、打出牌时，根据牌的类型：基础牌，令一名角色选择弃置一张手牌或失去一点体力；锦囊牌，获得弃牌堆中一张牌，该牌不能与本回合你使用过的牌牌名相同；装备牌，你摸两张牌。",
    diyeyan: "夜宴",
    diyeyan_info: "限定技，出牌阶段，你可弃置一张手牌，并在你的下次出牌阶段开始时从弃牌堆中获得至多3张相同牌名的牌。",
    //神纳西妲
    dinaxida_prefix: "神",
    dinaxida: "神纳西妲",
    diyunzhong: "蕴种",
    diyunzhong_info: "出牌阶段，你可弃置任意张花色不同的牌，并使X名角色横置或解除横置。横置的角色受到火属性伤害后，若其存活且是传导伤害的起点，你可令其获得如下效果：每回合开始时受到一点无来源火属性伤害并进行判定，若不为草花则移除该效果。横置的角色受到雷属性伤害时，你可令伤害来源摸一张牌。",
    diyunzhong_huo: "蕴种：火",
    diyunzhong_huo_info: "你可令其获得如下效果：每回合开始时受到一点无来源火属性伤害并进行判定，若不为草花则移除该效果。",
    diyunzhong_lei: "蕴种：雷",
    diyunzhong_lei_info: "你可令伤害来源摸一张牌。",
    dihuancheng: "幻成",
    dihuancheng_info: "回合开始时你回复X点体力，摸牌阶段你多摸Y张牌，出牌阶段结束你可将至多Z张手牌任意分配给其他角色。（X，Y，Z分别为你与横置的角色中魏、蜀、吴势力的数量）",
    dihuancheng_x: "幻成",
    dihuancheng_y: "幻成",
    dihuancheng_z: "幻成",
    dihuancheng_z_tag: "已分配",
    //桐谷和人
    dikirito: "桐谷和人",
    dierdao: "二刀",
    dierdao_kaishi: "二刀",
    dierdao_jiu: "二刀",
    dierdao_sha: "二刀",
    dierdao_info: "锁定技。游戏开始时，你废除一个防具栏，然后获得一个额外的武器栏。你的防具均视为【酒】。你每装备一把武器，使用【杀】的次数上限+1。",
    difengbi: "封弊",
    difengbi_info: "每轮限一次，任意角色的回合结束后，你可以观察牌堆顶5-X张牌并选择一张获得。（X为游戏轮次）",
    dirishi: "日蚀",
    dirishi_info: "限定技，出牌阶段，如果你装备区牌的数量大于你的体力值，你可以获得如下效果直至回合结束：记录你使用的最后两张牌的花色，你可以将与记录花色不同的手牌当做不计入次数的【杀】使用，以此法造成伤害时你摸一张牌。",
    dirishi2: "日蚀",
    //珊瑚宫心海
    dikokomi: "珊瑚宫心海",
    diqice: "奇策",
    diqice_info: "结束阶段，你可从14张锦囊牌中选择一张你本回合未使用过的锦囊牌视为于你下一个准备阶段使用。若为延时锦囊牌，则你获得一张实体牌。",
    dimiaosuan: "庙算",
    dimiaosuan_info: "当你的锦囊牌对其他角色造成伤害时，你可以取消此伤害，改为弃置其一张牌或使其摸一张牌。",
    //桃金娘
    ditaojinniang: "桃金娘",
    dijunli: "军礼",
    dijunli_info: "你受到伤害时若武将牌正面向上，你可将所有手牌交给伤害来源，翻面并取消该伤害。",
    dizhiyuan: "支援",
    dizhiyuan_info: "每回合限一次，当失去最后的手牌时，你摸3张牌。",
    //界甘雨
    jie_diganyu_prefix: "界",
    jie_diganyu: "界甘雨",
    dijie_shuanghua: "霜华",
    dijie_shuanghua_info: "①结束阶段，你可将一张【杀】置于武将牌上称为【矢】。②出牌阶段开始前，若武将牌上存在【矢】，你可选择一名角色，视为对其及其上下家使用冰【杀】，随后弃置一张【矢】，你每以此法造成一点伤害便摸一张牌。③锁定技，当你受到伤害后，你弃置一张【矢】。④锁定技，若你的武将牌上存在【矢】，你视为装备【麒麟弓】。",
    dijie_linji: "麟迹",
    dijie_linji_info: "你可将装备牌当作【闪】或【无懈可击】使用或打出。当你于回合外使用或打出【闪】，若你有【矢】，你可立即执行【霜华】②，否则你可立即执行【霜华】①。",
    //半藏
    dibanzang: "半藏",
    difengshi: "风矢",
    difengshi_info: "当你使用牌指定唯一其他目标后，你可弃置一张牌：若花色相同，使该牌无法被响应；若点数相同，使该牌基数+2；若点数相差为1，使该牌基数+1；若点数相差大于等于8，你弃置其一张牌。",
    dilonghun: "竜魂",
    dilonghun_info: "限定技，出牌阶段，从你开始：每个角色摸一张牌并弃一张牌，如果有角色弃置的牌与上家点数与花色均不相同，其受到一点无来源伤害。累计触发6次伤害后终止技能。",
    //钟离
    dizhongli: "钟离",
    diyuzhang: "玉璋",
    diyuzhang_info: "回合结束时，你可弃置任意张手牌，使等量角色各获得一点护甲，并且直到你的下个回合结束前，这些角色受到的属性伤害-1。",
    dichuijin: "炊金",
    dichuijin_info: "摸牌阶段，你多摸X张牌（X为场上有护甲的角色数量）。",
    //五条悟
    di5t5: "五条悟",
    diwuliang: "无量",
    diwuliang_info: "锁定技，游戏开始时，你展开【无量空处】领域：你至其他角色的距离至少为2。",
    diliuyan: "六眼",
    diliuyan_info: "摸牌阶段前，你可选择X名其他角色，你依次观察他们的手牌并从中各选择一张获得。（X为你已损失的体力）",
    ditiaozhan: "挑战",
    ditiaozhan_info: "锁定技，出牌阶段开始时，你选择一名手牌最多的其他角色，视为其对你使用【决斗】。你不会受到此【决斗】造成的伤害，但如果决斗失败，若【虚式】为【顺势】：你死亡；为【反转】，你减少一点体力上限。此决斗结算完成后，你转换【虚式】。",
    dixushi: "虚式",
    dixushi_shun: "顺势",
    dixushi_fan: "反转",
    dixushi_info: "转换技。【顺势】出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。【反转】当你成为【杀】的唯一目标时，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。",
    //界重岳
    jie_dichongyue_prefix: "界",
    jie_dichongyue: "界重岳",
    dijie_zhige: "止戈",
    dijie_zhige_info: "当你造成伤害时，你可要求目标角色交给你指定类型的牌以取消此伤害。",
    dijie_wowu: "我无",
    dijie_wowu_info: "你使用牌时记录其类型。当记录的类型达到三时，你清除记录并摸两张牌。",
    dijie_huiming: "晦明",
    dijie_huiming_info: "觉醒技，累计发动两次【我无】后，你回复一点体力，升级【我无】并失去【止戈】。",
    dijie_wowu_v2: "我无",
    dijie_wowu_v2_info: "你使用牌时记录其类型。当记录的类型达到二时，根据记录类型：基本+锦囊，你使用的下一张基本或普通锦囊牌可多指定一名目标；基本+装备，你使用的下一张牌基数+1；装备+锦囊，你摸一张牌。然后你清除记录并摸一张牌。你使用【杀】的次数上限+X。（X为你回合内发动【我无】的次数）",
    //艾雅法拉
    diayfl: "艾雅法拉",
    diluanhuo: "乱火",
    diluanhuo_info: "游戏开始时，你弃置所有手牌，并等概率随机摸2~8张牌。",
    didianran: "点燃",
    didianran_info: "锁定技，任意角色受到火属性伤害后你获得一个【点燃】。出牌阶段限一次，你可弃置1~3个【点燃】，视为使用一张有前X项效果的火【杀】（X为弃置【点燃】的数量）：1.无距离限制，2.无法响应，3.对距离目标1以内所有其他角色各造成一点无属性伤害。",
    dihuoshan: "火山",
    dihuoshan_info: "限定技，出牌阶段，你可弃置任意张红色手牌并对等量角色各造成一点火属性伤害。",
    //木里空
    dimulikong_prefix: "神",
    dimulikong: "神木里空",
    diyinjian: "阴间",
    diyinjian_info: "锁定技，你使用牌指定唯一目标后，若目标距离你X以内，则此牌不可被响应，且基数+X/2向下取整。（X为游戏轮数）",
    diyali: "压力",
    diyali_info: "锁定技，受到伤害后，你获得一个【怒】。",
    dihongwen: "红温",
    dihongwen_info: "出牌阶段限一次，你可移去一个【怒】，视为对自己使用一张【酒】。",
    dicanzhu: "残烛",
    dicanzhu_info: "锁定技，其他角色对你使用【杀】时，其获得【龙胆】与【咆哮】直到回合结束。",
    //史尔特尔
    disrtr: "史尔特尔",
    dironghuo: "熔火",
    dironghuo_info: "锁定技。使用【杀】指定目标后，你令其无法打出或使用点数低于该【杀】的【闪】直到回合结束。使用【杀】造成伤害后你进行判定，如果判定牌点数小于【杀】的点数，你失去一点体力。",
    diyujin: "余烬",
    diyujin_info: "当你处于濒死状态时，你可将体力回复至一点，然后执行一个额外回合。该回合结束后你死亡。",
    dihuanghun: "黄昏",
    dihuanghun_info: "限定技，出牌阶段，你将体力上限提升至5并回复所有体力，弃置所有手牌，从牌堆中依次获得【杀】直至你以此法获得的【杀】的点数之和大于你弃置的手牌的点数之和。随后你获得【咆哮】并修改【熔火】。",
    dironghuo_v2: "熔火",
    dironghuo_v2_info: "锁定技。使用【杀】指定目标后，你令其无法打出或使用点数低于该【杀】的【闪】直到回合结束。使用【杀】造成伤害后你失去一点体力。结束阶段你失去一点体力。",
    //季沧海
    dijicanghai: "季沧海",
    diliaoyuan: "燎原",
    diliaoyuan_info: "每回合限一次，有角色对你使用【杀】时，你可弃置一张【闪】将你从该【杀】的目标中移除，并对其造成一点火属性伤害。",
    difenshen: "焚身",
    difenshen_info: "锁定技，你累计造成或受到的伤害达到3后，你移除之前以此法获得的技能，并从【冲拳】或【巨焰】中选择一个技能获得。",
    dichongquan: "冲拳",
    dichongquan_info: "有角色使用【杀】时，若其在你的攻击范围内，你可弃置一张【闪】取消该【杀】的全部目标，并对其造成一点火属性伤害。",
    dijuyan: "巨焰",
    dijuyan_info: "出牌阶段限一次，你可将一张红色牌交给一名其他玩家，然后你摸一张牌，并令其选择获得一项效果：1.下次受到的伤害+1，且直到其下次出牌阶段开始前，桃对其无效；2.受到2点火属性伤害。",
    //知更鸟
    dirobin: "知更鸟",
    didiezou: "迭奏",
    didiezou_info: "回合结束时，你可以将一张手牌置于武将牌上，称为【音】（每种花色的【音】限一张）。每回合限一次，当一名角色使用的有对应实体牌的非转化【杀】结算完成后，其可将这张【杀】或一张手牌置入【音】，然后你与其各摸一张牌。当你需要使用或打出【闪】时，你可弃置一张【音】，视为打出了【闪】，然后摸一张牌。",
    dihesong: "合颂",
    dihesong_info: "出牌阶段前，你可弃置所有【音】。若弃置了三张：选择一名其他角色，你与其各摸两张牌；若弃置了四张：选择一名角色，其从【英姿】【咆哮】【神速】【帷幕】中选择一个技能获得，然后你与其各摸两张牌。",
    dixieyue: "谐乐",
    dixieyue_info: "出牌阶段，你可播放/暂停/切换音乐。",
    //一方通行
    diyftx: "【重做中】一方通行",
    dishiliang: "矢量",
    dishiliang_info: "每回合限一次，有其他角色使用牌指定非自己为目标后，你可失去X+1点体力上限，取消该牌的其中X个目标（X至多为你的体力上限-2）并进行X次【演算】。记【演算】成功的次数为Y，你增加Y点体力上限，并从取消的目标中选择Y名角色视为反向处理对其使用的牌（无视用牌限制且无对应实体牌）。",
    //浊心斯卡蒂
    dizxskd_prefix: "浊心",
    dizxskd: "浊心斯卡蒂",
    dixueqin: "血亲",
    dixueqin_info: "每轮游戏开始时，你可以选择至多X名其他角色作为本轮的【血亲】（X为你的体力），你攻击范围内的角色视为在【血亲】的攻击范围内。你每少选择一位【血亲】，摸一张牌。",
    ditongzang: "同葬",
    ditongzang_info: "每轮每个角色限一次，当【血亲】受到伤害时，你可以失去一点体力，取消此伤害。",
    ditonggui: "同归",
    ditonggui_info: "当【血亲】于出牌阶段打出【杀】，你可以弃置一张牌，使该【杀】不计入出【杀】次数。",
    dishenghua: "升华",
    dishenghua_info: "限定技，当你陷入濒死状态，你可以令场上所有成为过你【血亲】的角色选择：1.失去一点体力并使你回复一点体力；2.摸一张牌。然后你失去【同葬】【同归】，获得【潮涌】【潮枯】。",
    dichaoyong: "潮涌",
    dichaoyong_fenpei: "已分配",
    dichaoyong_info: "摸牌阶段结束时，你可以将手牌任意分配给【血亲】，获得你手牌的【血亲】于其下回合出牌阶段使用【杀】的次数+X。（X为你分配给其的手牌数）",
    dichaoku: "潮枯",
    dichaoku_info: "每轮游戏结束时，如果本轮没有角色死亡，你失去一点体力。",
    //宗小静
    dizxj: "宗小静",
    dimoxie: "默写",
    dimoxie_info: "出牌阶段限四次，你可弃置一张牌选择任意名其他角色同时参加英语默写。最先回答正确的角色摸两张牌，回答错误或最后回答的角色获得一个【不及】。锁定技，出牌阶段结束时，你弃置所有角色的【不及】，并根据每名角色弃置的数量：1.其弃置一张牌，2.其失去一点体力，3.其弃置三张牌，你失去一点体力，4.你与其均翻面。",
    //符玄
    difuxuan: "符玄",
    diqiongguan: "穷观",
    diqiongguan_info: "你拥有可放置至多四张牌的【穷观阵】。有角色摸牌时，你可以使其改为从【穷观阵】中按顺序获得等量牌；有角色判定时，你可以使其改为从【穷观阵】中按顺序移出一张牌作为不可改变的判定牌。",
    disanyan: "三眼",
    disanyan_info: "回合开始时，你可以观看牌堆顶的六张牌（当存活角色数小于4时改为四张），然后将这些牌以任意顺序置于牌堆顶或【穷观阵】中。",
    dibie: "避厄",
    dibie_info: "进入濒死状态时，你可弃置【穷观阵】中所有牌。你每以此法弃置一张红桃牌，视为对自己使用一张【桃】。",
};

export default translates;

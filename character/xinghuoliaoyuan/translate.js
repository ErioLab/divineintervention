const translates = {
	xinghuoliaoyuan: "星火燎原",
	sp_taishici: "SP太史慈",
	sp_taishici_prefix: "SP",
	wangcan: "王粲",
	re_jsp_pangtong: "SP庞统",
	re_jsp_pangtong_prefix: "SP",
	lvdai: "吕岱",
	re_zhangliang: "张梁",
	lvqian: "吕虔",
	panjun: "潘濬",
	duji: "杜畿",
	zhoufang: "周鲂",
	yanjun: "严畯",
	liuyao: "刘繇",
	liuyan: "刘焉",
	xinfu_guolun: "过论",
	xinfu_guolun_info: "出牌阶段限一次，你可以展示一名其他角色的手牌，然后展示你的一张牌。你与其交换这两张牌，然后展示的牌点数较小的角色摸一张牌。",
	xinfu_zhanji: "展骥",
	xinfu_zhanji_info: "锁定技。你的出牌阶段内，当你因摸牌且不是因为此技能效果而得到牌后，你摸一张牌。",
	xinfu_songsang: "送丧",
	xinfu_songsang_info: "限定技，其他角色死亡时，你可以回复1点体力（若你未受伤，则改为加1点体力上限）；然后获得技能〖展骥〗。",
	xinfu_jixu: "击虚",
	xinfu_jixu_info: "出牌阶段限一次，若你有手牌，你可以令任意名体力值相等的其他角色猜测你的手牌中是否有【杀】。然后，你摸X张牌（X为猜错的角色数）。若你有【杀】，则你本回合内使用【杀】时，所有这些角色均成为【杀】的目标；若你没有【杀】，则你弃置所有这些角色的各一张牌。若X为零，你结束出牌阶段。",
	jixu_sha: "击虚",
	jixu_sha_info: "",
	xinfu_sanwen: "散文",
	xinfu_sanwen_info: "每回合限一次。当你得到牌后，若你的原手牌中有与这些牌名称相同的牌，则你可以展示这些牌，弃置新得到的同名牌并摸两倍的牌。",
	xinfu_qiai: "七哀",
	xinfu_qiai_info: "限定技，当你进入濒死状态时，你可以令所有其他角色依次交给你一张牌。",
	xinfu_denglou: "登楼",
	xinfu_denglou_info: "限定技，结束阶段，若你没有手牌，则你可以观看牌堆顶的四张牌，依次使用其中的所有基本牌（不能使用则弃置），然后获得其余的牌。",
	qinguo_use: "勤国",
	qinguo_use_info: "",
	xinfu_qinguo: "勤国",
	xinfu_qinguo_info: "当你使用的装备牌结算完成时，你可以视为使用一张【杀】；当你因使用或失去装备牌导致装备区内牌的数量发生变化后，若你装备区内牌的数量等于你的体力值，则你回复1点体力。",
	qinguo_lose: "勤国",
	qinguo_lose_info: "",
	xinfu_jijun: "集军",
	xinfu_jijun_info: "当你于回合内使用非装备牌或武器牌指定目标后，若你是此牌的目标，你可以进行一次判定。然后，你将判定牌置于自己的武将牌上，称之为「方」。",
	xinfu_fangtong: "方统",
	xinfu_fangtong_info: "结束阶段，你可以弃置总点数之和为36的一张牌与任意张「方」，并对一名其他角色造成3点雷电伤害。",
	xinfu_weilu: "威虏",
	xinfu_weilu_info: "锁定技，当你受到伤害后，伤害来源获得一枚「虏」。你的下个出牌阶段开始时，所有有「虏」的角色将体力失去至1点。此阶段结束后，这些角色回复以此法失去的体力。",
	weilu_effect: "威虏",
	weilu_effect_info: "",
	weilu_effect2: "威虏",
	weilu_effect2_info: "",
	xinfu_zengdao: "赠刀",
	xinfu_zengdao_info: "限定技，出牌阶段，你可以将装备区内的任意张牌置于一名其他角色的武将牌旁，称之为“刀”。该角色造成伤害时，其须移去一张“刀”，然后此伤害+1。",
	xinfu_zengdao2: "赠刀",
	xinfu_zengdao2_info: "",
	xinfu_guanwei: "观微",
	xinfu_guanwei_info: "每回合限一次。一名角色的出牌阶段结束时，若其本回合使用过两张以上的牌且这些牌均有花色且花色均相同，则你可以弃置一张牌，令其摸两张牌并进行一个额外的出牌阶段。",
	xinfu_gongqing: "公清",
	xinfu_gongqing_info: "锁定技。当你受到伤害时，若伤害来源的攻击范围：<3，则你令此伤害的数值减为1。>3，你令此伤害+1。",
	xinfu_andong: "安东",
	xinfu_andong_info: "当你受到伤害时，你可以令伤害来源选择一项：1.令你观看其的手牌并获得其中的所有红桃牌；2.防止此伤害，然后其本回合内的红桃手牌不计入手牌上限。",
	xinfu_yingshi: "应势",
	xinfu_yingshi_info: "出牌阶段开始时，若场上的所有角色均没有「酬」，则你可以将所有的红桃牌置于一名其他角色的武将牌旁，称之为「酬」。有「酬」的角色受到【杀】的伤害后/死亡时，伤害来源/你获得其中的一张/所有的「酬」。",
	yingshi_heart: "应势",
	yingshi_heart_info: "",
	yingshi_die: "应势",
	yingshi_die_info: "",
	xinfu_duanfa: "断发",
	xinfu_duanfa_info: "出牌阶段，你可以弃置任意张黑色牌，然后摸等量的牌。（每回合内限X张，X为你的体力上限）",
	xinfu_youdi: "诱敌",
	xinfu_youdi_info: "结束阶段开始时，你可以令一名其他角色弃置你的一张手牌，若此牌：不为黑色，你摸一张牌。不为【杀】，你获得该角色的一张牌。",
	xinfu_guanchao: "观潮",
	xinfu_guanchao_info: "出牌阶段开始时，你可以选择获得一项效果直到回合结束：1.当你使用牌时，若你此阶段使用过的所有牌的点数为递增，你摸一张牌；2.当你使用牌时，若你此阶段使用过的所有牌的点数为递减，你摸一张牌。",
	xinfu_xunxian: "逊贤",
	xinfu_xunxian_info: "每回合限一次。当你使用或打出的牌结算完成后，你可以将其对应的所有实体牌交给一名手牌数或体力值大于你的角色。",
	xinfu_kannan: "戡难",
	xinfu_kannan_info: "出牌阶段限X次，你可以与一名本回合内未成为过〖戡难〗目标的角色拼点。若你赢，你使用的下一张【杀】的伤害值基数+1，且你本回合内不能再发动〖戡难〗。若你没赢，其使用的下一张【杀】的伤害值基数+1。（X为你的体力值）。",
	kannan_eff: "戡难",
	kannan_eff_info: "",
	xinfu_tushe: "图射",
	xinfu_tushe_info: "当你使用非装备牌指定目标后，若你没有基本牌，则你可以摸X张牌。（X为此牌指定的目标数）",
	xinfu_limu: "立牧",
	xinfu_limu_info: "出牌阶段，你可以将一张♦牌当做【乐不思蜀】对自己使用，然后回复1点体力。只要你的判定区内有牌，你对攻击范围内的其他角色使用牌便没有次数和距离限制。",
	xinyingshi: "应势",
	xinyingshi_info: "出牌阶段开始时，若场上所有角色的武将牌上均没有“酬”，则你可以将任意张牌置于一名角色的武将牌上，称为“酬”。若如此做：当有角色使用牌对有“酬”的角色造成伤害后，其可以获得一张“酬”，并获得牌堆中所有与“酬”花色点数均相同的牌；有“酬”的角色死亡时，你获得其所有“酬”。",
};

export default translates;

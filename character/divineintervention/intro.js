const characterIntros = {
    diganyu: "天降神兵-原神人物。甘雨是一位人与仙兽麒麟混血的半仙。她与岩王帝君签定了契约，担任璃月七星的秘书。",
    dichongyue: "天降神兵-明日方舟人物。自称只是一介武人的炎国访客，重岳，可从未有人见他真正出手过。",
    diren: "天降神兵-崩铁人物。弃身锋刃的剑客，原名不详。效忠于「命运的奴隶」，拥有可怖的自愈能力。手持古剑作战，剑身遍布破碎裂痕，正如其身，亦如其心。",
    diluocha: "天降神兵-崩铁人物。金发俊雅的年轻人，背着巨大的棺棹。身为天外行商的他，不幸被卷入仙舟，「罗浮」的星核危机。一手精湛医术莫名有了用武之地。",
    dinaxida: "天降神兵-原神人物。许久之前，草神创造了须弥雨林，又通过教令院将智慧赐予国民。她的美名无处不在，千万个故事，只为传唱她的事迹与美德而问世。在人民眼中，草神的存在更像是一种符号化的象征——因此，他们才能确信神明的庇护自古就存在于这片土地之上。城中至贤对草神崇拜备至，民众也坚定不移地追随其后。而影响诸多的「虚空」系统，则是「小吉祥草王」的耳与目。它给予她遍历人们喜怒哀乐的能力，令她听见看见一切，让她理解了赞美之外的声音。见闻越是拓展，她越明白自己必须不断学习。她唯有尽快成长，才能面对来自世界最深处的威胁。无法逃离，那是她无法回避的使命。即便没多少人对现状不满，纳西妲依旧坚定不移。她的顽强来源于信念，她比任何人都明白——在这里，她将是所有人的寄托与依靠。",
    dihuangquan: "天降神兵-崩铁人物。自称「巡海游侠」的旅人，本名不详。身佩一柄长刀，独行银河。淡漠寡言，剑出如紫电般迅猛，却从来只以刀鞘战斗，收而不发。",
    dimaenna: "天降神兵-明日方舟人物。玛恩纳·临光，临光家前家主，干员临光与瑕光的叔叔，迄今并未获得过任何形式的骑士封号。",
    diqinliu: "天降神兵-明日方舟人物。前维多利亚仪仗队执旗手，服役于维多利亚小丘郡地方部队，经历战乱后，由小丘郡办事处负责人引荐，成为罗德岛合作干员。接受过维多利亚军的基础训练，体能优异，在各类任务中展现出了强大的支援能力。",
    dijingmolieshou: "天降神兵-杀戮尖塔人物。来自雾霾之地的致命女猎手。使用匕首和下毒来消灭敌人。",
    dikirito: "天降神兵-SAO人物。名副其实的重度网络游戏玩家。拥有超群的反射神经和洞察力。因为完全潜行正式版的SAO而被卷入死亡游戏，并以此为开端，牵扯进各种的虚拟世界事件。五官看起来像少女一样纤细，性格却非常冷淡，给人一种“捉摸不定”、“年龄不详”的印象。",
    dikokomi: "天降神兵-原神人物。海祇岛的「现人神巫女」，即——海祇岛最高领袖。",
    ditaojinniang: "天降神兵-明日方舟人物。杜林族出身的少女，根据本人强烈要求，记录此前履历为：大将军。外表与性格有孩子气的成分，但在战场上表现出颇强的感染力和相当的指挥水准，能够在提振其他干员士气的同时，为他们提供一定的治疗，十分可靠。",
    dibanzang: "天降神兵-守望先锋人物。作为一名箭术和忍术大师，岛田半藏一直都在追求极致完美的技艺以证明自己是最强大的武士。岛田家据传已有数百年的历史。以忍者为主要成员的岛田家，经过多年的发展，已经建立起一个以军火和非法物资交易为主的庞大黑道帝国。作为大名的长子，半藏注定要继承他的父亲统治岛田帝国。因此从很小的时候开始，半藏就以这一责任为目标接受训练，并表现出了天生的领导能力以及对战略战术惊人的天赋。同时，他还是精通武术、剑术和弓术的天才。父亲过世后，家族长老就建议半藏帮助他那刚愎自用的弟弟（即岛田源氏），以便两人携手管理岛田帝国。在遭到拒绝后，半藏被迫亲手了结了自己的弟弟。半藏因此深受打击，他拒绝继承父亲的遗产并最终抛弃了自己的家族和所有辛苦换来的成果。现在，半藏四海为家，不断磨练着自己作为一名武士的技巧，希望终有一天能挽回自己的名誉并真正放下自己的过去。",
    dizhongli: "天降神兵-原神人物。在璃月的传统中，「请仙」与「送仙」是同样重要的事。最擅长「送别」一道的，莫过于胡家传承七十七代的「往生堂」。但「往生堂」的堂主胡桃本人，主要还是专注于送别凡人的技艺。送别仙人的诸般仪式，则交由一位「道上的朋友」——钟离打理。仙人与璃月一同度过漫长岁月，三千多年来升天者寥寥无几，这就意味着一切相关传统都只能以纸面形式存在——时间跨度实在太长了，这可不是那种你小时候咬着糖葫芦参加过一回，老了还能躺在竹椅上再次亲眼目睹的事件。但即便是眼光最为挑剔、沉迷旧纸堆的老学究，也无法对「往生堂」操办的送仙典仪挑出任何毛病。不仅仪式中人的服饰合规，仪式举行的吉时、地点、用具、乃至当天天气、仪式时长、允许观礼人数、观礼者身份职业年龄...哪怕将以上所有全都纳入计量范畴，也无一不合礼节。若人们以「通晓古今」来形容钟离，他只会无奈地一笑，叹道：「我只是...记性很好。」",
    di5t5: "天降神兵-咒术回战人物。特级咒术师，出生于御三家的五条家，为五条家的实质的代行。在新宿与两面宿傩激战后，被宿傩腰斩。",
    jie_dichongyue: "天降神兵-明日方舟人物。自称只是一介武人的炎国访客，重岳，可从未有人见他真正出手过。",
    diayfl: "天降神兵-明日方舟人物。艾雅法拉，火山学家，天灾信使。于高等源石技艺、高能量法术释放等领域展现出了卓越的天赋。现于罗德岛接受治疗，同时为罗德岛提供天灾研究、环境观察与评估、危险地形航行保障等相关服务。",
    dimulikong: "天降神兵-地下工作人物。？？？",
    disrtr: "天降神兵-明日方舟人物。神秘的萨卡兹少女史尔特尔，或因矿石病影响导致缺失性记忆障碍，其情况在矿石病病理中也极其少见，现于罗德岛接受治疗中。在测试过程中展现出了原因不详的强大战斗能力，很快成为了作战干员。",
    dijicanghai: "天降神兵-永劫无间人物。举杯痛饮，人生尽欢。烈豪这称号的背后，是他洒脱不羁的脾性，也是他遇强则强的豪情。纵然命运之路沉重难行，但他将依旧挥刀向前。",
    dirobin: "天降神兵-崩铁人物。出生于匹诺康尼，闻名银河的天环族歌者，举止从容优雅的少女。",
    diyftx: "天降神兵-魔禁人物。一方通行生活在学园都市，父母不详，本名一共五个字，姓氏为两个字，名字为三个字，在仅有七人的Level5中排名第一位，有着“学园都市最强”的称号，因此经常被人骚扰。为了不再让他人因挑战自己而残废而渴望得到“绝对”的力量，同时封锁了自己的感情。根据树状图设计者的演算结果，学园都市中的七名超能力者中只有一方通行有机会稳定进化为绝对能力者Level 6。",
    dizxskd: "天降神兵-明日方舟人物。浊心斯卡蒂，一位让你熟悉又陌生的访客。你愿意接纳它吗？",
    dizxj: "天降神兵-地下工作人物。？？？",
    difuxuan: "天降神兵-崩铁人物。仙舟「罗浮」太卜司之首，自信耿直的智者。凭借第三眼与穷观阵为仙舟占算航路，预卜事务吉凶，坚信自己所做的一切便是事情的「最优解」。符玄等待着将军承诺的「退位让贤」，然而这一天的到来…似乎还遥遥无期。",
    dishenzhuri: "天降神兵-崩铁人物。「齐响诗班」众愿之多米尼克斯，是为「同谐」希佩的众相化身之一，因「秩序」的干扰展现出不同以往的面貌。作为集群意识对愿望的回应，他指挥的颂歌能依照万千愿望重塑世界，建立新的法则，而所有许愿者都会成为其力量的来源。",
    difellowhuisheng: "天降神兵-崩铁人物。某人对至亲记忆之余音。迢迢长夜里，它们与他同在——昔在、今在，以后永在。",
    dichengji: "天降神兵-历史人物。程畿（？～222年），巴西阆中（今四川省阆中市）人 。三国时期蜀汉官员。刘璋割据益州时，程畿为汉昌长。后来，巴西太守庞羲因刘璋猜疑而怀有叛离之心，命令程畿的儿子征召士兵自保，程畿不仅制止儿子的行为，还说服了庞羲，因此受到刘璋的赏识，被刘璋任命为江阳太守。后来刘备取代刘璋担任益州牧，程畿担任从事祭酒。蜀汉建国后，程畿随刘备伐吴，刘备兵败夷陵，程畿不肯撤退，最终奋力战死。",
    dihutao: "天降神兵-原神人物。胡桃————“往生堂”第七十七代堂主，掌控著璃月葬仪事务的重要人物。尽心尽力地为人们完成送别之仪，维护著世间阴阳平衡之道。 除此以外还是个神奇打油诗人，诸多“杰作”被璃月人口口相传。",
    diyike: "哥伦比亚出身的干员异客，曾在十三岁时就以极其优异的成绩跳级毕业，随后被源石工程与应用学专家索恩教授相中提拔为研究助手，进入布莱恩创生科技的研究所学习。于近二十余年前随某项目深入萨尔贡，之后销声匿迹。之后以伊巴特地区黑市主要成员的身份与罗德岛接触，并在脱离黑市后，单纯以感染者身份来到罗德岛接受治疗，并以工程部干员的身份活跃在各项行动中。",
};

export default characterIntros;

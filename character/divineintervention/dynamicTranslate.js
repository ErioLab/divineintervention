import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
    dilunzhuan: function (player) {
        if (player.storage.dilunzhuan) return "转换技。【白花】你造成伤害时，可弃置一张红色手牌取消该伤害改为回复其一点体力。<span class=\"bluetext\">【黑渊】当有角色回复体力时，你可弃置一张黑色手牌使回复量-1。</span>";
        return "转换技。<span class=\"bluetext\">【白花】你造成伤害时，可弃置一张红色手牌取消该伤害改为回复其一点体力。</span>【黑渊】当有角色回复体力时，你可弃置一张黑色手牌使回复量-1。";
    },
    dixushi: function (player) {
        if (player.storage.dixushi) return "转换技。【顺势】出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。<span class=\"bluetext\">【反转】当你成为【杀】的唯一目标时，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。</span>";
        return "转换技。<span class=\"bluetext\">【顺势】出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。</span>【反转】当你成为【杀】的唯一目标时，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。";
    }
};
export default dynamicTranslates;

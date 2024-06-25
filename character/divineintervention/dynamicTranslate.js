import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
    dixushi: function (player) {
        if (player.storage.dixushi) return "转换技。【顺势】出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。<span class=\"bluetext\">【反转】当你成为【杀】的唯一目标时，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。</span>";
        return "转换技。<span class=\"bluetext\">【顺势】出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。</span>【反转】当你成为【杀】的唯一目标时，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。";
    }
};
export default dynamicTranslates;

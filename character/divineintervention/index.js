import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import voices from "./voices.js";
import characterFilters from "./characterFilter.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import characterIntros from "./intro.js";
import characterTitles from "./title.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
    return {
        name: "divineintervention",
        connect: true,
        character: { ...characters },
        card: { ...cards },
        pinyins: { ...pinyins },
        skill: { ...skills },
        translate: { ...translates, ...voices, ...characterSortTranslate },
        characterSort: { divineintervention: characterSort, },
        characterFilter: { ...characterFilters },
        characterReplace: { ...characterReplaces },
        dynamicTranslate: { ...dynamicTranslates },
        characterIntro: { ...characterIntros },
        characterTitle: { ...characterTitles },
    };
});
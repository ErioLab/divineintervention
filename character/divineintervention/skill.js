import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
    //工具人
    diceshi: {
        enable: "phaseUse",
        content() {
            player.draw(50);
        },
        group: ["diceshi_b"],
        subSkill: {
            b: {
                firstDo: true,
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                filter: function (event, player) {
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                forced: true,
                content: function () {
                    game.filterPlayer(function (player) {
                        if (!player.hasSkill("diceshi"))
                            player.addSkill("diceshi");
                    });
                }
            }
        }
    },
    //甘雨
    dishuanghua_bingsha: {
        locked: true,
        mod: {
            cardnature: function (card, player) {
                if (card.name == "sha" && get.color(card) == "black") return "ice";
            },
        }
    },
    dishuanghua_gongji: {
        mod: {
            attackFrom: function (from, to, distance) {
                return distance - 2;
            },
        },
    },
    dishuanghua: {
        audio: 3,
        trigger: {
            source: "damageBegin2",
        },
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && event.card.nature == "ice" && event.player != player && event.player.isIn() && player.countCards("h");
        },
        direct: true,
        check: function (event, player) {
            var att1 = get.attitude(player, trigger.player.previous);
            var att2 = get.attitude(player, trigger.player.next);
            return (att1 * att2 < 0);
        },
        content: function () {
            "step 0"
            player.chooseToDiscard("h", get.prompt2("dishuanghua")).set("ai", function (card) {
                return 7 - get.value(card);
            }).logSkill = "shuanghua";
            "step 1"
            if (result.bool) {
                var p = player.next;
                while (p != player) {
                    if (get.distance(trigger.player, p) <= 1 && trigger.player != p) {
                        p.damage();
                        player.line(p)
                    }
                    p = p.next;
                }
            }
        },
        group: ["dishuanghua_bingsha", "dishuanghua_gongji"],
    },
    dilinji: {
        mod: {
            globalTo: function (from, to, distance) {
                if (to.countCards("h") == 0) return distance + 1;
            },
        },
    },
    //重岳
    diwanxiang: {
        group: ["diwanxiang_kaishi", "diwanxiang_mopai"],
    },
    diwanxiang_kaishi: {
        audio: 3,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        filter: function (event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        content: function () {
            player.draw(3);
        }
    },
    diwanxiang_mopai: {
        audio: 3,
        forced: true,
        trigger: { player: "phaseDrawBegin2" },
        content: function () {
            trigger.num++;
        },
        mod: {
            maxHandcardBase: function (player, num) {
                return player.maxHp;
            },
        },
    },
    diwowu: {
        audio: 4,
        trigger: {
            player: "useCard"
        },
        filter: function (event, player) {
            return player.countUsed() % 3 === 0;
        },
        frequent: true,
        content: function () {
            player.draw(1);
            game.broadcastAll(function (target) {
                target.storage.diwowu++;
                target.syncStorage("diwowu_v2");
                target.updateMarks();
            }, player);
        },
        init: function (player) {
            player.storage.diwowu = 0;
        },
        mark: true,
        intro: {
            content: "发动了#次"
        },
        group: ["diwowu_upgrade"],
        subSkill: {
            upgrade: {
                trigger: {
                    player: "useCard"
                },
                forced: true,
                unique: true,
                filter: function (event, player) {
                    return player.storage.diwowu >= 2;
                },
                content: function () {
                    player.removeSkill("diwowu");
                    player.addSkill("diwowu_v2");
                }
            }
        }
    },
    diwowu_v2: {
        audio: "diwowu",
        trigger: {
            player: "useCard"
        },
        filter: function (event, player) {
            return player.countUsed() % 3 === 0;
        },
        frequent: true,
        content: function () {
            player.draw(2);
            game.broadcastAll(function (target) {
                target.storage.diwowu_v2++;
                target.syncStorage("diwowu_v2");
                target.updateMarks();
            }, player);

            player.addTempSkill("diwowu_v2_kill", "phaseAfter");
        },
        init: function (player) {
            player.storage.diwowu_v2 = 0;
        },
        mark: true,
        intro: {
            content: "本回合已发动#次，使用【杀】的次数上限+#。"
        },
        group: ["diwowu_v2_reset"],
        subSkill: {
            kill: {
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") {
                            return num + player.storage.diwowu_v2;
                        }
                    }
                },
            },
        }
    },
    diwowu_v2_reset: {
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        content: function () {
            game.broadcastAll(function (target) {
                target.storage.diwowu_v2 = 0;
                target.syncStorage("diwowu_v2");
                target.updateMarks();
            }, player);

        }
    },
    //刃
    diyubian: {
        audio: 4,
        enable: "phaseUse",
        usable: 1,
        marktext: "狱",
        intro: {
            name: "狱变",
            content: "记录已损失的体力为#",
        },
        content: function () {
            "step 0"
            if (player.hp != 1) {
                player.loseHp();
            }
            "step 1"
            player.removeMark("diyubian", player.countMark("diyubian"));
            player.addMark("diyubian", player.maxHp - player.hp);
            "step 2"
            player.addTempSkill("diyubian_sha");
            player.addTempSkill("diyubian_damage");
        },
        group: ["diyubian_clear"],
        subSkill: {
            clear: {
                silent: true,
                trigger: { player: "phaseEnd" },
                forced: true,
                content: function () {
                    player.removeMark("diyubian", player.countMark("diyubian"));
                }
            },
            sha: {
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") return num + player.countMark("diyubian");
                    }
                }
            },
            damage: {
                audio: "diyubian",
                trigger: { source: "damageEnd" },
                filter: function (event, player) {
                    return event.card && event.card.name == "sha";
                },
                forced: true,
                content: function () {
                    if (player.hp != 1) {
                        player.loseHp();
                        player.draw(2);
                    } else {
                        player.draw(1);
                    }
                }
            }
        }
    },
    dizangsong: {
        mark: true,
        marktext: "赐",
        intro: {
            name: "赐",
            content: "拥有#层【赐】"
        },
        trigger: { player: ["loseHpEnd", "damageEnd"] },
        forced: true,
        init: function (player) {
            player.storage.dizangsong = 0;
        },
        content: function () {
            game.broadcastAll(function (target) {
                target.storage.dizangsong++;
                target.syncStorage("dizangsong");
                target.updateMarks();
            }, player);
        },
        group: "dizangsong_phase",
        subSkill: {
            phase: {
                trigger: { global: "phaseAfter" },
                priority: -50,
                forced: true,
                filter: function (event, player) {
                    return player.storage.dizangsong >= 4;
                },
                content: function () {
                    player.insertPhase();
                    player.recover(1);
                    game.broadcastAll(function (target) {
                        target.storage.dizangsong = 0;
                        target.syncStorage("dizangsong");
                        target.updateMarks();
                    }, player);
                }
            }
        }
    },
    diwansi: {
        audio: 1,
        limited: true,
        trigger: { player: "dying" },
        skillAnimation: true,
        animationColor: "gray",
        filter: function (event, player) {
            return player.hp < 1;
        },
        content: function () {
            "step 0"
            player.awakenSkill("diwansi");
            player.recover(3 - player.hp);
            var cards = [];
            for (var i = 0; i < 3; i++) {
                cards.push(game.createCard("sha"));
            }
            player.gain(cards, "gain2");
        }
    },
    //罗刹
    diheiyuan: {
        audio: 2,
        direct: true,
        trigger: {
            global: "recoverBegin",
        },
        filter: function (event, player) {
            if (event.name == "recover") {
                return player.countCards("h", { color: "black" }) > 0;
            }
        },
        content: function () {
            "step 0"
            var target = trigger.player;
            player.chooseToDiscard("h", 1, "弃置一张黑色手牌，使" + get.translation(target) + "的体力回复量-1。", { color: "black" });
            "step 1"
            var target = trigger.player;
            if (result.bool) {
                player.logSkill("diheiyuan", target);
                player.line(target, "black");
                trigger.num--;
            }
        },
    },
    dibaihua: {
        audio: 2,
        direct: true,
        trigger: {
            source: "damageBegin1",
        },
        filter: function (event, player) {
            if (event.name == "damage") {
                return player.countCards("h", { color: "red" }) > 0;
            }
        },
        content: function () {
            "step 0"
            var target = trigger.player;
            player.chooseToDiscard("h", 1, "弃置一张红色手牌，取消对" + get.translation(target) + "的伤害并改为回复其一点体力。", { color: "red" });
            "step 1"
            var target = trigger.player;
            if (result.bool) {
                player.logSkill("dibaihua", target);
                player.line(target, "red");
                trigger.num--;
                target.recover();
            }
        },
    },
    diguizang: {
        audio: 1,
        trigger: { player: "phaseZhunbeiBegin" },
        skillAnimation: "epic",
        animationColor: "soil",
        unique: true,
        juexingji: true,
        forced: true,
        filter: function (event, player) {
            if (player.storage.diguizang) return false;
            return game.dead.length >= game.players.length * 0.5;
        },
        content: function () {
            player.awakenSkill("diguizang");
            var targets = game.filterPlayer(current => current != player).sortBySeat();
            player.line(targets);
            player.gainMultiple(targets, "h");
            player.addSkill("dizailin");
        },
    },
    dizailin: {
        audio: 1,
        limited: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "soil",
        filter: function (event, player) {
            return !player.storage.dizailin && player.countCards("h", { color: "black" }) * player.countCards("h", { color: "red" }) > 0;
        },
        content: function () {
            "step 0"
            player.awakenSkill("dizailin");
            player.discard(player.getCards("hej"));
            var next = player.chooseTarget(true, "选择一名角色令其复活");
            next.set("filterTarget", function (card, player, target) {
                return target.isDead();
            });
            next.set("deadTarget", true);
            next.set("ai", function (target) {
                return get.attitude(_status.event.player, target);
            });
            "step 1"
            if (result.bool) {
                var dead = result.targets[0];
                game.log(get.translation(player) + "复活了" + get.translation(dead));
                game.broadcastAll(function (target) {
                    target.revive(2, false);
                }, dead);
                dead.hp = Math.min(2, dead.maxHp);
                dead.draw(4);
                game.addVideo("revive", dead);
            } else event.finish();
        }
    },
    //玛恩纳
    dilifeng: {
        audio: 2,
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        filter: function (event, player) {
            return player.getHistory("useCard", function (evt) { return evt.card.name == "sha" }).length == 0;
        },
        content: function () {
            player.addMark("dilifeng", 1);
            player.draw();
        },
        marktext: "勋",
        intro: {
            name: "未照耀的荣光",
            content: "拥有#个【勋】",
        },
    },
    diyouxia: {
        audio: 3,
        trigger: { global: "useCardToTarget" },
        filter: function (event, player) {
            return event.card.name == "sha" && game.hasPlayer(function (current) {
                return current != player && event.targets.includes(current) && get.distance(player, current) <= 1;
            }) && event.player != player; //  && !event.targets.includes(player) 
        },
        content: function () {
            trigger.getParent().targets.splice(0);
            trigger.getParent().targets.push(player);
            trigger.getParent().triggeredTargets2.splice(0);
            trigger.getParent().triggeredTargets2.push(player);
            player.line(trigger.getParent().player, "yellow");
            player.addMark("dilifeng", 1);
        }
    },
    dilinguang: {
        audio: 2,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countMark("dilifeng") > 0;
        },
        content: function () {
            "step 0"
            var choices = [];
            for (var i = 1; i <= player.countMark("dilifeng"); i++) {
                choices.push(i);
            }
            choices.push("cancel2");
            player.chooseControl(choices).set("prompt", "临光：选择弃置的【勋】的数量。").set("prompt2", "出牌阶段，你可弃置任意个【勋】，摸X张牌并执行前X项（X为你弃置的【勋】的个数）：1.本回合攻击范围+2；2.本回合使用【杀】可额外指定一个目标；3.本回合使用【杀】不可被响应；4.本回合使用【杀】无次数限制；5.摸X-3张牌。若你的体力为全场最少，你可多执行一项。");
            "step 1"
            if (result.control != "cancel2") {
                var num = result.control;
                player.removeMark("dilifeng", num);
                player.draw(num);
                var exnum = num;
                if (player.isMinHp()) exnum++;
                switch (exnum) {
                    default:
                    case 5:
                        player.draw(num - 3);
                    case 4:
                        player.addTempSkill("dilinguang_usable");
                    case 3:
                        player.addTempSkill("dilinguang_response");
                    case 2:
                        player.addTempSkill("dilinguang_target");
                    case 1:
                        player.addTempSkill("dilinguang_range");
                }
            }
        },
        subSkill: {
            range: {
                mod: {
                    attackRange(player, num) {
                        return num + 2;
                    }
                }
            },
            target: {
                trigger: { player: "useCard2" },
                filter: function (event, player) {
                    if (event.card.name != "sha") return false;
                    return game.hasPlayer(function (current) {
                        return !event.targets.includes(current) && player.canUse(event.card, current);
                    });
                },
                direct: true,
                content: function () {
                    "step 0"
                    player.chooseTarget("为" + get.translation(trigger.card) + "增加一个目标", function (card, player, target) {
                        return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
                    }).set("sourcex", trigger.targets).set("card", trigger.card).set("ai", function (target) {
                        var player = _status.event.player;
                        return get.effect(target, _status.event.card, player, player);
                    });
                    "step 1"
                    if (result.bool) {
                        if (!event.isMine() && !_status.connectMode) game.delayx();
                        event.target = result.targets[0];
                    }
                    else {
                        event.finish();
                    }
                    "step 2"
                    trigger.targets.push(event.target);
                }
            },
            response: {
                trigger: { player: "useCard" },
                filter: function (event, player) {
                    return event.card.name == "sha";
                },
                forced: true,
                silent: true,
                content: function () {
                    trigger.directHit.addArray(game.players);
                }
            },
            usable: {
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") return Infinity;
                    }
                }
            }
        },
        group: "dilinguang_dying",
    },
    dilinguang_dying: {
        audio: 2,
        trigger: { global: "dying" },
        forced: true,
        filter: function (event, player) {
            return _status.currentPhase == player;
        },
        content: function () {
            player.addTempSkill("dilinguang_dying_nosha");
        },
        subSkill: {
            nosha: {
                mod: {
                    cardEnabled: function (card) {
                        if (card.name == "sha") return false;
                    },
                },
            }
        }
    },
    //黄泉
    dijinran: {
        audio: 4,
        trigger: { global: "addJudgeAfter" },
        forced: true,
        marktext: "残",
        intro: {
            name: "残梦",
            content: "拥有#层【残梦】",
        },
        content: function () {
            player.addMark("dijinran", 1);
        },
    },
    dihongye: {
        audio: "dijinran",
        trigger: { source: "damageBegin4" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha";
        },
        content: function () {
            trigger.cancel();
            var t = trigger.player;
            player.line(t, "red");
            player.gainPlayerCard(t, "he", true);
            player.moveCard(true);
        }
    },
    diyuzhan: {
        audio: 2,
        unique: true,
        limited: true,
        skillAnimation: true,
        animationColor: "thunder",
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countMark("dijinran") >= 9;
        },
        content() {
            "step 0"
            player.awakenSkill("diyuzhan");
            player.removeMark("dijinran", player.countMark("dijinran"));
            player.storage.chosenTargets = [];
            "step 1"
            player.chooseTarget("对一名角色造成一点雷属性伤害", true);
            "step 2"
            if (result.bool) {
                var target = result.targets[0];
                player.storage.chosenTargets.push(target);
                target.damage("thunder");
            }
            if (player.countCards("h") < 2 || player.storage.chosenTargets.length >= game.players.length) event.goto(8);
            "step 3"
            player.chooseCardTarget({
                position: "he",
                filterTarget: function (card, player, target) {
                    return !player.storage.chosenTargets.includes(target);
                },
                selectCard: 2,
                selectTarget: 1,
                prompt: "弃置两张牌，对一名角色造成一点雷属性伤害并弃置其装备区所有牌（不能为1选择的角色）",
                forced: true,
            });
            "step 4"
            if (result.bool) {
                var target = result.targets[0];
                player.storage.chosenTargets.push(target);
                target.damage("thunder");
                player.discard(result.cards);
                target.discard(target.getCards("e"));
            } else {
                event.finish();
            }
            "step 5"
            if (player.countCards("h") < 2 || player.storage.chosenTargets.length >= game.players.length) event.goto(8);
            "step 6"
            player.chooseCardTarget({
                position: "he",
                filterTarget: function (card, player, target) {
                    return !player.storage.chosenTargets.includes(target);
                },
                selectCard: 2,
                selectTarget: 1,
                prompt: "弃置两张牌，对一名角色造成一点雷属性伤害并将其翻面（不能为1、2选择的角色）",
                forced: true,
            });
            "step 7"
            if (result.bool) {
                var target = result.targets[0];
                player.storage.chosenTargets.push(target);
                target.damage("thunder");
                player.discard(result.cards);
                target.turnOver();
            } else {
                event.finish();
            }
            "step 8"
            if (player.getAllHistory("sourceDamage", evt => evt.hasNature("thunder")).reduce((num, evt) => num + evt.num, 0) > game.players.length) {
                game.players.forEach(function (player) {
                    player.damage("thunder");
                });
            }
        }
    },
    //琴柳
    dihuizhi: {
        audio: 4,
        forced: true,
        marktext: "辉",
        intro: {
            content: "本回合已发动#次【辉帜】",
        },
        trigger: { player: "phaseJieshuBegin" },
        content() {
            var num = player.countMark("dihuizhi");
            if (num == 2) {
                player.loseHp();
            } else if (num == 3) {
                player.turnOver();
            } else if (num == 4) {
                player.loseMaxHp();
            }
            player.removeMark("dihuizhi", num);
            player.updateMarks();
        },
        group: ["dihuizhi1", "dihuizhi1_pan", "dihuizhi2", "dihuizhi3", "dihuizhi4"],
    },
    dihuizhi1: {
        audio: "dihuizhi",
        trigger: { player: "phaseJudgeBefore" },
        direct: true,
        marktext: "号",
        intro: {
            name: "号令",
            markcount: "expansion",
            content: "expansion",
        },
        content() {
            "step 0"
            player.chooseCard("将一张手牌置于武将牌上称为【号令】。一名角色的判定牌生效前，你可打出一张【号令】作为判定牌", "h");
            "step 1"
            if (result.bool) {
                if (result.cards && result.cards.length) {
                    player.addToExpansion(result.cards, player, "give").gaintag.add("dihuizhi1");
                }
                trigger.cancel();
                player.addMark("dihuizhi");
                player.logSkill("dihuizhi1");
            }
        },
    },
    dihuizhi1_pan: {
        trigger: { global: "judge" },
        filter: function (event, player) {
            return player.getExpansions("dihuizhi1").length > 0;
        },
        direct: true,
        content: function () {
            "step 0";
            player.chooseCardButton(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，你可打出一张【号令】作为判定牌", player.getExpansions("dihuizhi1"));
            "step 1";
            if (result.bool) {
                trigger.player.judging[0] = result.links[0];
                game.log(trigger.player, "的判定牌改为", result.links[0]);
                player.loseToDiscardpile(result.links);
            } else {
                event.finish();
            }
            "step 2";
            game.delay(3);
        },
    },
    dihuizhi2: {
        audio: "dihuizhi",
        trigger: { player: "phaseDrawBefore" },
        direct: true,
        content() {
            "step 0"
            player.chooseTarget("跳过摸牌阶段，令一名其他角色摸两张牌并回复一点体力", function (card, player, target) { return target != player })
            "step 1"
            if (result.bool) {
                var target = result.targets[0];
                target.draw(2);
                target.recover();
                trigger.cancel();
                player.addMark("dihuizhi");
                player.logSkill("dihuizhi2");
            }
        }
    },
    dihuizhi3: {
        audio: "dihuizhi",
        trigger: { player: "phaseUseBefore" },
        direct: true,
        content() {
            "step 0"
            player.chooseTarget("跳过出牌阶段，令一名其他角色下回合出【杀】次数+1，并使自己回复一点体力", function (card, player, target) { return target != player })
            "step 1"
            if (result.bool) {
                var target = result.targets[0];
                target.addTempSkill("dihuizhi3_effect", { player: "phaseAfter" });
                player.recover();
                trigger.cancel();
                player.addMark("dihuizhi");
                player.logSkill("dihuizhi3");
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") return num + 1;
                    }
                }
            }
        }
    },
    dihuizhi4: {
        audio: "dihuizhi",
        trigger: { player: "phaseDiscardBefore" },
        direct: true,
        content() {
            "step 0"
            player.chooseTarget("跳过弃牌阶段，令一名其他角色下回合手牌上限+1", function (card, player, target) { return target != player })
            "step 1"
            if (result.bool) {
                var target = result.targets[0];
                target.addTempSkill("dihuizhi4_effect", { player: "phaseAfter" });
                trigger.cancel();
                player.addMark("dihuizhi");
                player.logSkill("dihuizhi4");
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    maxHandcard: function (player, num) {
                        return num + 1;
                    },
                }
            }
        }
    },
    //静默猎手
    dizaji: {
        usable: 1,
        enable: "phaseUse",
        content() {
            "step 0"
            player.draw(3);
            "step 1"
            player.chooseToDiscard("h", true);
            "step 2"
            player.addTempSkill("dizaji_nosha");
            player.addTempSkill("dizaji_jinnang");
        },
        subSkill: {
            nosha: {
                mod: {
                    cardEnabled: function (card) {
                        if (card.name == "sha") return false;
                    },
                },
            },
            jinnang: {
                mod: {
                    selectTarget: function (card, player, range) {
                        if (get.type(card) == "trick") {
                            range[1] = 1;
                        }
                    },
                },
            }
        }
    },
    dizhanshu: {
        trigger: {
            player: ["loseAfter", "loseAsyncAfter"],
        },
        usable: 1,
        direct: true,
        filter: function (event, player) {
            var evt = _status.event.getParent("phaseDiscard");
            if (event.type == "discard" && !(evt && evt.name == "phaseDiscard")) return true;
            if (player == _status.currentPhase) return false;
            if (event.type == "use" || event.type == "respond") return true;
            return false;
        },
        content: function () {
            "step 0"
            if (!trigger.cards.length) event.finish();
            event.card = trigger.cards[0];
            if (get.type(event.card) == "basic") event.goto(1);
            if (get.type(event.card) == "trick" || get.type(event.card) == "delay") event.goto(4);
            if (get.type(event.card) == "equip") event.goto(5);
            "step 1"
            player.chooseTarget("令一名角色选择弃置一张手牌或失去一点体力", function (card, player, target) {
                return player != target;
            });
            "step 2"
            game.log(get.translation(player) + "对基本牌" + get.translation(event.card) + "发动了【战术】");
            if (!result.bool) event.finish;
            event.target = result.targets[0];
            event.target.chooseToDiscard("h", "弃置一张手牌或失去一点体力").set("ai", function (card) {
                return 7 - get.value(card);
            });
            "step 3"
            if (result.bool == false) {
                event.target.loseHp();
            }
            event.finish();
            "step 4"
            game.log(get.translation(player) + "对锦囊牌" + get.translation(event.card) + "发动了【战术】");
            var usedNames = player.getHistory("useCard").map(function (evt) {
                return evt.card.name;
            });
            var card = get.discardPile(function (card) {
                return !usedNames.contains(card.name);
            });
            if (card) {
                player.gain(card, "gain2");
            }
            event.finish();
            "step 5"
            game.log(get.translation(player) + "对装备牌" + get.translation(event.card) + "发动了【战术】");
            player.draw(2);
            event.finish();
        },
    },
    diyeyan: {
        unique: true,
        limited: true,
        skillAnimation: true,
        animationColor: "gray",
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countCards("h") >= 0;
        },
        content() {
            "step 0"
            player.awakenSkill("diyeyan");
            player.chooseToDiscard("h", true);
            "step 1"
            player.storage.diyeyan_name = result.cards[0].name;
            player.addSkill("diyeyan_get3");
        },
        subSkill: {
            get3: {
                trigger: { player: "phaseUseBegin" },
                forced: true,
                content: function () {
                    var cards = [];
                    for (var i = 0; i < 3; i++) {
                        var card = get.discardPile(function (card) {
                            return card.name == player.storage.diyeyan_name && !cards.includes(card);
                        });
                        if (card) {
                            cards.push(card);
                        }
                    }
                    player.gain(cards, "gain2");
                    player.removeSkill("diyeyan_get3");
                }
            }
        }
    },
    //神纳西妲
    diyunzhong: {
        audio: 6,
        enable: "phaseUse",
        position: "he",
        filter: function (event, player) {
            return player.countCards("he") > 0;
        },
        filterCard: function (card) {
            var suit = get.suit(card);
            for (var i = 0; i < ui.selected.cards.length; i++) {
                if (get.suit(ui.selected.cards[i]) == suit) return false;
            }
            return true;
        },
        complexSelect: true,
        complexCard: true,
        complexTarget: true,
        selectTarget() {
            return [ui.selected.cards.length, ui.selected.cards.length];
        },
        filterTarget: function (card, player, target) {
            return true;
        },
        check: function (card) {
            if (ui.selected.cards.length > 1) return 0;
            return 5 - get.value(card);
        },
        selectCard: [1, 4],
        line: { "color": "green" },
        content: function () {
            target.link();
        },
        group: ["diyunzhong_huo", "diyunzhong_lei"],
    },
    diyunzhong_huo: {
        audio: "diyunzhong",
        trigger: {
            global: "damageEnd",
        },
        filter: function (event, player) {
            return event.lianhuanable == true && event.player.isIn() && event.hasNature("fire");
        },
        content: function () {
            game.broadcastAll(function (target) {
                target.addSkill("diyunzhong_huo_effect");
            }, trigger.player);
        },
        subSkill: {
            effect: {
                trigger: { player: "phaseBegin" },
                forced: true,
                mark: true,
                marktext: "燃",
                intro: {
                    name: "蕴种：燃",
                    content: "每回合开始时受到一点无来源火属性伤害并进行判定，若不为草花则移除该效果。",
                },
                content: function () {
                    "step 0"
                    player.damage("fire", "nosource");
                    player.judge(function (card) {
                        return get.suit(card) == "club";
                    });
                    "step 1"
                    if (!result.bool) {
                        game.broadcastAll(function (target) {
                            target.removeSkill("diyunzhong_huo_effect");
                        }, player);
                    }
                }
            }
        }
    },
    diyunzhong_lei: {
        audio: "diyunzhong",
        trigger: {
            global: "damageBegin3",
        },
        filter: function (event, player) {
            return event.player.isLinked() && event.hasNature("thunder");
        },
        content: function () {
            trigger.getParent().player.draw();
        },
    },
    dihuancheng: {
        audio: 3,
        group: ["dihuancheng_x", "dihuancheng_y", "dihuancheng_z"],
    },
    dihuancheng_x: {
        forced: true,
        trigger: { player: "phaseBegin" },
        content: function () {
            var x = game.countPlayer(function (current) {
                return (current.isLinked() || current == player) && current.group == "wei";
            });
            player.recover(x);
        }
    },
    dihuancheng_y: {
        forced: true,
        trigger: { player: "phaseDrawBegin2" },
        content: function () {
            var y = game.countPlayer(function (current) {
                return (current.isLinked() || current == player) && current.group == "shu";
            });
            trigger.num += y;
        },
    },
    dihuancheng_z: {
        forced: true,
        trigger: { player: "phaseUseEnd" },
        content: function () {
            "step 0";
            var z = game.countPlayer(function (current) {
                return (current.isLinked() || current == player) && current.group == "wu";
            });
            if (z == 0) event.finish();
            /*var cards = [];
            for (var i = 0; i < z; i++) {
                var card = get.discardPile(function (card) {
                    if (cards.includes(card)) return false;
                    if (card.name == "sha") return game.hasNature(card, "thunder") || game.hasNature(card, "fire");
                    return card.name == "huogong";
                });
                if (card) {
                    cards.push(card);
                }
            }
            player.gain(cards, "gain2");
            if (_status.connectMode)
                game.broadcastAll(function () {
                    _status.noclearcountdown = true;
                });
            */
            event.given_map = {};
            event.num = z;
            "step 1";
            player.chooseCardTarget({
                filterCard: function (card) {
                    return get.itemtype(card) == "card" && !card.hasGaintag("dihuancheng_z_tag");
                },
                filterTarget: lib.filter.notMe,
                selectCard: [1, event.num],
                prompt: "请选择要分配的卡牌和目标",
                ai1: function (card) {
                    if (!ui.selected.cards.length) return 1;
                    return 0;
                },
                ai2: function (target) {
                    var player = _status.event.player,
                        card = ui.selected.cards[0];
                    var val = target.getUseValue(card);
                    if (val > 0) return val * get.attitude(player, target) * 2;
                    return get.value(card, target) * get.attitude(player, target);
                },
            });
            "step 2";
            if (result.bool) {
                var res = result.cards,
                    target = result.targets[0].playerid;
                player.addGaintag(res, "dihuancheng_z_tag");
                event.num -= res.length;
                if (!event.given_map[target]) event.given_map[target] = [];
                event.given_map[target].addArray(res);
                if (event.num > 0) event.goto(1);
            }
            "step 3";
            if (_status.connectMode) {
                game.broadcastAll(function () {
                    delete _status.noclearcountdown;
                    game.stopCountChoose();
                });
            }
            var map = [],
                cards = [];
            for (var i in event.given_map) {
                var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                player.line(source, "green");
                //if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.18);
                map.push([source, event.given_map[i]]);
                cards.addArray(event.given_map[i]);
            }
            game.loseAsync({
                gain_list: map,
                player: player,
                cards: cards,
                giver: player,
                animate: "giveAuto",
            }).setContent("gaincardMultiple");
        },

    },
    //桐谷和人
    dierdao: {
        group: ["dierdao_kaishi", "dierdao_jiu", "dierdao_sha"],
    },
    dierdao_kaishi: {
        audio: 1,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0) && player.hasEnabledSlot(2);
        },
        content() {
            player.disableEquip(2);
            player.expandEquip(1);
        },
    },
    dierdao_jiu: {
        mod: {
            cardname(card) {
                if (get.subtype(card, false) == "equip2") return "jiu";
            },
        },
    },
    dierdao_sha: {
        mod: {
            cardUsable: function (card, player, num) {
                if (card.name == "sha") return num + player.getEquips(1).length;
            }
        }
    },
    difengbi: {
        audio: 1,
        round: 1,
        trigger: { global: "phaseEnd" },
        filter: function (event, player) {
            return game.roundNumber < 5;
        },
        content: function () {
            "step 0";
            event.cards = get.cards(5 - game.roundNumber);
            player.chooseCardButton(event.cards, 1, "选择一张牌获得");
            "step 1";
            player.gain(result.links, "gain2");
        }
    },
    /*
    dirishi: {
        trigger: { player: "phaseDrawEnd" },
        frequent: true,
        marktext: "蚀",
        intro: {
            name: "日蚀",
            content: "回合内使用【杀】造成了#点伤害",
        },
        filter: function (event, player) {
            return player.countMark("dirishi") > 0;
        },
        content: function () {
            var num = player.countMark("dirishi");
            player.removeMark("dirishi", player.countMark("dirishi"));
            var cards = get.cards(num);
            player.showCards(cards);
            game.delay(2);
            var gainCards = [];
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].name == "sha" || get.type(cards[i]) == "equip") {
                    gainCards.push(cards[i]);
                }
            }
            if (gainCards.length > 0) {
                player.gain(gainCards, "gain2");
            }
        },
        group: ["dirishi_damage"],
    },
    dirishi_damage: {
        trigger: { source: "damageEnd" },
        forced: true,
        silent: true,
        filter: function (event, player) {
            var evt = event.getParent("phaseUse");
            return evt && evt.player == player && event.card && event.card.name == "sha";
        },
        content: function () {
            player.addMark("dirishi", trigger.num);
        }
    },*/
    dirishi: {
        limited: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "fire",
        filter: function (event, player) {
            return player.countCards("e") > player.hp;
        },
        content: function () {
            player.awakenSkill("dirishi");
            player.addTempSkill("dirishi2");
        },
    },
    dirishi2: {
        mark: true,
        intro: {
            content: "最后两张牌的花色：$",
            onunmark: true,
        },
        group: ["dirishi2_jilu", "dirishi2_sha", "dirishi2_mo", "dirishi2_use"],
        subSkill: {
            jilu: {
                trigger: { player: "useCard" },
                forced: true,
                silent: true,
                content: function () {
                    player.storage.dirishi2_2 = (player.storage.dirishi2_1 || "");
                    player.storage.dirishi2_1 = get.suit(trigger.card);
                    player.storage.dirishi2 = [];
                    if (player.storage.dirishi2_2)
                        player.storage.dirishi2.push(player.storage.dirishi2_2);
                    if (player.storage.dirishi2_1)
                        player.storage.dirishi2.push(player.storage.dirishi2_1);
                }
            },
            sha: {
                enable: "chooseToUse",
                viewAs: {
                    name: "sha",
                    storage: { dirishi2_sha: true },
                },
                filterCard: function (card, player) {
                    return get.suit(card) != player.storage.dirishi2_1 && get.suit(card) != player.storage.dirishi2_2;
                },
                prompt: "将一张与记录花色不同的手牌当做不计入次数的【杀】使用",
                position: "h",
                filter: function (event, player) {
                    return player.countCards("h", function (card) {
                        return get.suit(card) != player.storage.dirishi2_1 && get.suit(card) != player.storage.dirishi2_2;
                    });
                },
                check: function (card) {
                    return 6 - get.value(card);
                },
                precontent: function () {
                    event.getParent().addCount = false;
                },
                ai: {
                    order: () => get.order({ name: "sha" }) + 0.2,
                    result: { player: 1 },
                },
            },
            mo: {
                trigger: { source: "damageAfter" },
                forced: true,
                silent: true,
                filter: function (event) {
                    return event.parent.skill == "dirishi2_sha";
                },
                content: function () {
                    player.draw();
                }
            },
            use: {
                audio: 1,
                trigger: { player: "useCard" },
                forced: true,
                content: function () {
                }

            }
        }
    },
    //珊瑚宫心海
    diqice: {
        audio: 3,
        trigger: { player: "phaseEnd" },
        direct: true,
        content: function () {
            "step 0"
            var tricks = ["guohe", "jiedao", "juedou", "nanman", "shunshou", "taoyuan", "wanjian", "wugu", "wuzhong", "huogong", "tiesuo", "wuxie"];
            var usedTricks = player.getHistory("useCard", function (evt) {
                return tricks.includes(evt.card.name);
            }).map(function (evt) { return evt.card.name; });
            var available = tricks.filter(function (trick) {
                return !usedTricks.includes(trick);
            }).map(function (trick) {
                return ["锦囊", "", trick];
            });

            if (available.length) {
                player.chooseButton(["选择一张本回合未使用过的普通锦囊牌视为于你的下个准备阶段使用", [available, "vcard"]]).set("ai", function (button) {
                    return get.value({ name: button.link[2] });
                });
            } else {
                event.finish();
            }
            "step 1"
            if (result.bool) {
                player.storage.diqice = { name: result.links[0][2] };
                player.addSkill("diqice_activate");
                player.logSkill("diqice");
            }
        },
        subSkill: {
            activate: {
                audio: "diqice",
                trigger: { player: "phaseBegin" },
                forced: true,
                content: function () {
                    "step 0"
                    if (player.storage.diqice) {
                        player.chooseUseTarget(player.storage.diqice);
                        delete player.storage.diqice;
                    }
                    player.removeSkill("diqice_activate");
                }
            }
        }
    },
    dimiaosuan: {
        audio: 3,
        trigger: {
            source: "damageBegin1",
        },
        direct: true,
        filter: function (event, player) {
            return event.card && get.type(event.card, "trick") == "trick";
        },
        content: function () {
            "step 0"
            player.chooseControl(["弃牌", "摸牌", "cancel2"]).set("ai", function (event) {
                if (get.attitude(player, trigger.player) > 0) {
                    return "摸牌";
                }
                if (trigger.player.hp == 1 || trigger.player.countCards("he") == 0) return "cancel2";
                return "弃牌";
            }).set("prompt", "是否取消此伤害，并弃置" + get.translation(trigger.player) + "一张牌或使其摸一张牌");
            "step 1"
            if (result.control === "弃牌") {
                player.logSkill("dimiaosuan", trigger.player);
                trigger.cancel();
                trigger.player.chooseToDiscard("he", true);
            } else if (result.control === "摸牌") {
                player.logSkill("dimiaosuan", trigger.player);
                trigger.cancel();
                trigger.player.draw();
            }
        }
    },
    //桃金娘
    dijunli: {
        audio: 2,
        trigger: { player: "damageBegin" },
        filter: function (event, player) {
            return !player.isTurnedOver();
        },
        content: function () {
            "step 0"
            player.turnOver();
            trigger.cancel();
            "step 1"
            if (trigger.source)
                player.give(player.getCards("h"), trigger.source);
        },
    },
    dizhiyuan: {
        usable: 1,
        audio: 3,
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        filter: function (event, player) {
            if (player.countCards("h")) return false;
            var evt = event.getl(player);
            return evt && evt.hs && evt.hs.length;
        },
        content: function () {
            player.draw(3);
        }
    },
    //界甘雨
    dijie_shuanghua: {
        audio: 4,
        marktext: "矢",
        intro: {
            name: "霜华矢",
            markcount: "expansion",
            content: "expansion",
        },
        group: ["dijie_shuanghua_jieshu", "dijie_shuanghua_sha", "dijie_shuanghua_mopai", "dijie_shuanghua_shoushang", "dijie_shuanghua_wuqi", "dijie_shuanghua_wuqiskill"],
        subSkill: {
            jieshu: {
                trigger: { player: "phaseEnd" },
                direct: true,
                filter: function (event, player) {
                    return player.countCards("h", { name: "sha" }) > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCard("将一张【杀】置于武将牌上称为【矢】", "h", { name: "sha" });
                    "step 1"
                    if (result.bool) {
                        if (result.cards && result.cards.length) {
                            player.addToExpansion(result.cards, player, "give").gaintag.add("dijie_shuanghua");
                        }
                    }
                }
            },
            sha: {
                trigger: { player: "phaseUseBefore" },
                direct: true,
                filter: function (event, player) {
                    return player.getExpansions("dijie_shuanghua").length > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseTarget("选择一名角色，视为对其及其上下家使用冰【杀】", lib.filter.notMe);
                    "step 1"
                    if (result.bool) {
                        var targets = [result.targets[0], result.targets[0].next, result.targets[0].previous].filter(function (target) {
                            return target && player.canUse({ name: "sha", nature: "ice" }, target);
                        });
                        if (targets.length > 0) {
                            player.useCard({ name: "sha", nature: "ice" }, targets, "dijie_shuanghua");
                            player.logSkill("dijie_shuanghua", targets);
                        }
                    } else {
                        event.finish();
                    }
                    "step 2"
                    player.chooseCardButton("弃置一张【矢】", player.getExpansions("dijie_shuanghua"), true);
                    "step 3"
                    if (result.bool) {
                        player.loseToDiscardpile(result.links);
                    }
                }
            },
            mopai: {
                trigger: { source: "damageAfter" },
                forced: true,
                silent: true,
                filter: function (event) {
                    return event.parent.skill == "dijie_shuanghua";
                },
                content: function () {
                    player.draw();
                }
            },
            shoushang: {
                forced: true,
                silent: true,
                trigger: { player: "damageEnd" },
                filter: function (event, player) {
                    return player.getExpansions("dijie_shuanghua").length > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCardButton("弃置一张【矢】", player.getExpansions("dijie_shuanghua"), true);
                    "step 1"
                    if (result.bool) {
                        player.loseToDiscardpile(result.links);
                    }
                },
            },
            wuqi: {
                mod: {
                    attackFrom: function (from, to, distance) {
                        if (from.getExpansions("dijie_shuanghua").length > 0) return distance - 5;
                    },
                },
            },
            wuqiskill: {
                trigger: { source: "damageBegin2" },
                filter: function (event, player) {
                    return (
                        player.getExpansions("dijie_shuanghua").length > 0 &&
                        event.card &&
                        event.card.name == "sha" &&
                        event.notLink() &&
                        event.player.getCards("e", { subtype: ["equip3", "equip4", "equip6"] }).length > 0
                    );
                },
                direct: true,
                audio: "qilin_skill",
                content: function () {
                    "step 0";
                    var att = get.attitude(player, trigger.player) <= 0;
                    var next = player.chooseButton();
                    next.set("att", att);
                    next.set("createDialog", [
                        "是否发动【麒麟弓】，弃置" + get.translation(trigger.player) + "的一张坐骑牌？",
                        trigger.player.getCards("e", { subtype: ["equip3", "equip4", "equip6"] }),
                    ]);
                    next.set("ai", function (button) {
                        if (_status.event.att) return get.buttonValue(button);
                        return 0;
                    });
                    "step 1";
                    if (result.bool) {
                        player.logSkill("qilin_skill", trigger.player);
                        trigger.player.discard(result.links[0]);
                    }
                },
            },
        }
    },
    dijie_linji: {
        audio: 3,
        trigger: { player: ["respond", "useCard"] },
        direct: true,
        filter: function (event, player) {
            if (player == _status.currentPhase) return false;
            if (player.getExpansions("dijie_shuanghua").length == 0 && player.countCards("h", { name: "sha" }) == 0) return false;
            if (event.card.name == "shan" || event.card.viewAs == "shan") return true;
            return false;
        },
        content: function () {
            "step 0"
            game.log(player.getExpansions("dijie_shuanghua").length);
            if (player.getExpansions("dijie_shuanghua").length > 0) {
                player.chooseTarget("选择一名角色，视为对其及其上下家使用冰【杀】", lib.filter.notMe);
            } else {
                player.chooseCard("将一张【杀】置于武将牌上称为【矢】", "h", { name: "sha" });
            }
            "step 1"
            if (player.getExpansions("dijie_shuanghua").length > 0) {
                if (result.bool) {
                    var targets = [result.targets[0], result.targets[0].next, result.targets[0].previous].filter(function (target) {
                        return target && player.canUse({ name: "sha", nature: "ice" }, target);
                    });
                    if (targets.length > 0) {
                        player.useCard({ name: "sha", nature: "ice" }, targets, "dijie_shuanghua");
                        player.logSkill("dijie_shuanghua", targets);
                    }
                } else {
                    event.finish();
                }
            } else {
                if (result.bool) {
                    if (result.cards && result.cards.length) {
                        player.addToExpansion(result.cards, player, "give").gaintag.add("dijie_shuanghua");
                    }
                }
                event.finish();
            }
            "step 2"
            player.chooseCardButton("弃置一张【矢】", player.getExpansions("dijie_shuanghua"), true);
            "step 3"
            if (result.bool) {
                player.loseToDiscardpile(result.links);
            }
        },
        group: ["dijie_linji_shan", "dijie_linji_wuxie"],
        subSkill: {
            shan: {
                audio: "dijie_linji",
                position: "hes",
                enable: ["chooseToRespond", "chooseToUse"],
                filterCard: function (card) {
                    return get.type(card) == "equip";
                },
                viewAs: { name: "shan" },
                viewAsFilter: function (player) {
                    if (!player.countCards("hes", { type: "equip" })) return false;
                    return true;
                },
                prompt: "将一张装备牌当作【闪】使用或打出",
            },
            wuxie: {
                audio: "dijie_linji",
                position: "hes",
                enable: ["chooseToRespond", "chooseToUse"],
                filterCard: function (card) {
                    return get.type(card) == "equip";
                },
                viewAs: { name: "wuxie" },
                viewAsFilter: function (player) {
                    if (!player.countCards("hes", { type: "equip" })) return false;
                    return true;
                },
                prompt: "将一张装备牌当作【无懈可击】使用或打出",
            }
        }
    },
    //半藏
    difengshi: {
        audio: 7,
        trigger: { player: "useCardToPlayered" },
        direct: true,
        filter: function (event, player) {
            if (event.target != player && event.targets && event.targets.length == 1) {
                return player.countCards("he", function (card) {
                    return get.suit(card) == event.card.suit || Math.abs(get.number(card) - event.card.number) <= 1 || Math.abs(get.number(card) - event.card.number) >= 8;
                });
            }
            return false;
        },
        content: function () {
            "step 0"
            player.chooseToDiscard("he", 1, get.prompt2("difengshi"));
            "step 1"
            if (result.bool) {
                player.logSkill("difeng", trigger.target);
                var card = result.cards[0];
                var dif = Math.abs(get.number(card) - trigger.card.number);
                if (get.suit(card) == trigger.card.suit)
                    trigger.directHit.addArray(game.players);
                if (dif == 0) {
                    trigger.getParent().baseDamage += 2;
                } else if (dif == 1) {
                    trigger.getParent().baseDamage += 1;
                } else if (dif >= 8) {
                    player.discardPlayerCard(trigger.targets[0], "he");
                }
            }
        }
    },
    dilonghun: {
        audio: 2,
        enable: "phaseUse",
        limited: true,
        skillAnimation: true,
        animationColor: "thunder",
        mark: true,
        init: function (player) {
            player.storage.dilonghun = 0;
        },
        marktext: "竜",
        intro: {
            content: "竜魂已触发#次伤害"
        },
        content: function () {
            "step 0"
            player.awakenSkill("dilonghun");
            event.current = player;
            event.previousCard = null;
            "step 1"
            event.current.draw();
            "step 2"
            var promptText = "";
            if (event.previousCard) {
                promptText += "上一张牌是【" + get.translation(event.previousCard) + "】，如果你弃置的牌与此牌点数、花色均不相同，你受到一点无来源伤害。";
            }
            event.current.chooseToDiscard("弃置一张牌", promptText, "hes", true).set("ai", function (card) {
                var previous = event.previousCard;
                if (previous && (get.suit(card) === get.suit(previous) || get.number(card) === get.number(previous))) {
                    return 12 - get.value(card);
                }
                return 8 - get.value(card);
            });
            "step 3"
            if (result.bool) {
                if (event.previousCard && (get.suit(event.previousCard) !== get.suit(result.cards[0]) && get.number(event.previousCard) !== get.number(result.cards[0]))) {
                    event.current.damage(1, "nosource");
                    player.addMark("dilonghun", 1);
                    if (player.countMark("dilonghun") >= 6) {
                        event.finish();
                        player.removeMark("dilonghun", player.countMark("dilonghun"));
                        player.unmarkSkill("dilonghun");
                    }
                }
                event.previousCard = result.cards[0];
                event.current = event.current.next;
                event.goto(1);

            } else {
                event.finish();
            }
        },
    },
    //钟离
    diyuzhang: {
        audio: 6,
        direct: true,
        trigger: { player: "phaseEnd" },
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        content: function () {
            "step 0"
            game.filterPlayer(function (current) {
                if (current.hasSkill("diyuzhang_jianshang")) {
                    current.removeSkill("diyuzhang_jianshang");
                }
            });
            "step 1"
            player.chooseCardTarget({
                position: "h",
                prompt: get.prompt2("diyuzhang"),
                selectCard: [1, Infinity],
                selectTarget() {
                    return [ui.selected.cards.length, ui.selected.cards.length];
                },
            });
            "step 2"
            if (result.bool) {
                player.discard(result.cards);
                player.logSkill("diyuzhang", result.targets);
                for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].changeHujia(1);
                    result.targets[i].addSkill("diyuzhang_jianshang");
                }
            }
        },
        subSkill: {
            jianshang: {
                trigger: {
                    player: "damageBegin3",
                },
                filter: function (event, player) {
                    return event.hasNature();
                },
                forced: true,
                onremove: true,
                charlotte: true,
                content: function () {
                    trigger.num -= 1;
                },
                ai: {
                    nofire: true,
                    nothunder: true,
                    effect: {
                        target: function (card, player, target, current) {
                            if (get.tag(card, "natureDamage")) return "zeroplayertarget";
                        },
                    },
                },
                mark: true,
                marktext: "璋",
                intro: {
                    content: "受到的属性伤害-1。",
                },
            },
        }
    },
    dichuijin: {
        forced: true,
        trigger: { player: "phaseDrawBegin2" },
        content: function () {
            var num = game.countPlayer(function (current) {
                return current.hujia > 0;
            });
            trigger.num += num;
        },
    },
    //五条悟
    diwuliang: {
        audio: 1,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        filter: function (event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        content: function () {
            game.log(player, "展开了领域【无量空处】");
        },
        group: ["diwuliang_juli"],
        subSkill: {
            juli: {
                lastDo: true,
                mod: {
                    globalTo: function (from, to, distance) {
                        var n = 0;
                        const equips1 = from.getCards("e", function (card) {
                            return !ui.selected.cards || !ui.selected.cards.includes(card);
                        }),
                            equips2 = to.getCards("e", function (card) {
                                return !ui.selected.cards || !ui.selected.cards.includes(card);
                            });
                        for (let i = 0; i < equips1.length; i++) {
                            let info = get.info(equips1[i]).distance;
                            if (!info) continue;
                            if (info.globalFrom) {
                                n += info.globalFrom;
                            }
                        }
                        for (let i = 0; i < equips2.length; i++) {
                            let info = get.info(equips2[i]).distance;
                            if (!info) continue;
                            if (info.globalTo) {
                                n += info.globalTo;
                            }
                        }
                        return Math.max(2 - n, distance);
                    },
                }
            },
        }
    },
    diliuyan: {
        direct: true,
        trigger: { player: "phaseDrawBefore" },
        filter: function (event, player) {
            return player.hp < player.maxHp;
        },
        content: function () {
            "step 0"
            var x = player.maxHp - player.hp;
            player.chooseTarget("选择" + x + "名其他角色，你依次观察他们的手牌并各从中选择一张获得", [1, x], lib.filter.notMe);
            "step 1"
            if (!result.bool) {
                event.finish();
            } else {
                player.logSkill("diliuyan", result.targets);
                event.targets = result.targets;
                event.num = 0;
            }
            "step 2"
            if (event.num == event.targets.length) event.finish();
            "step 3"
            var t = event.targets[event.num];
            if (t.countCards("h") == 0)
                event.goto(6);
            "step 4"
            var t = event.targets[event.num];
            player.chooseCardButton("观察" + get.translation(t) + "的手牌并获得一张", t, t.getCards("h"));
            "step 5"
            if (result.bool)
                player.gain(result.links[0], "gain2");
            "step 6"
            event.num++;
            event.goto(2);
        }
    },
    ditiaozhan: {
        audio: 1,
        forced: true,
        trigger: { player: "phaseUseBegin" },
        content: function () {
            "step 0"
            player.chooseTarget("选择一名手牌最多的其他角色", "视为其对你使用【决斗】。你不会受到此【决斗】造成的伤害，但如果决斗失败，若【虚式】为【顺势】：你死亡；为【反转】，你减少一点体力上限。", function (card, player, target) {
                return target != player && game.countPlayer(function (current) {
                    return current != player && current.countCards("h") > target.countCards("h");
                }) == 0;
            }, true);
            "step 1"
            if (result.bool) {
                result.targets[0].useCard({ name: "juedou", isCard: true, ditiaozhan: true }, player, false);
            }
        },
        group: ["ditiaozhan_shoushang", "ditiaozhan_zhuanhuan"],
        subSkill: {
            shoushang: {
                trigger: { player: "damageBegin4" },
                forced: true,
                filter: function (event, player) {
                    return event.card && event.card.ditiaozhan;
                },
                content: function () {
                    trigger.cancel();
                    if (player.storage.dixushi)
                        player.loseMaxHp();
                    else
                        player.die();
                }
            },
            zhuanhuan: {
                trigger: { global: "useCardAfter" },
                forced: true,
                filter: function (event, player) {
                    return event.card && event.card.ditiaozhan;
                },
                content: function () {
                    game.broadcastAll(function (target) {
                        target.changeZhuanhuanji("dixushi");
                    }, player);
                }
            }
        }
    },
    dixushi: {
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        init: function (player) {
            player.storage.dixushi = true;
        },
        intro: {
            content: function (storage, player) {
                if (storage) return "转换技。当你成为【杀】的目标，你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能。";
                return "转换技。出牌阶段，你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害。";
            },
        },
        group: ["dixushi_shun", "dixushi_fan", "dixushi_sha"],
        subSkill: {
            shun: {
                audio: 1,
                enable: "phaseUse",
                direct: true,
                filter: function (event, player) {
                    return !player.storage.dixushi && player.countCards("he") > 0 &&
                        game.countPlayer(function (current) {
                            return player.inRange(current);
                        }) > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCardTarget({
                        position: "he",
                        prompt: "你可弃置任意张牌并对攻击范围内等量的角色各造成一点伤害",
                        selectCard: [1, Infinity],
                        selectTarget() {
                            return [ui.selected.cards.length, ui.selected.cards.length];
                        },
                        filterTarget: function (card, player, target) {
                            return player.inRange(target);
                        }
                    });
                    "step 1"
                    if (result.bool) {
                        player.discard(result.cards);
                        for (var i = 0; i < result.targets.length; i++) {
                            player.line(result.targets[i]);
                            result.targets[i].damage();
                        }
                        player.logSkill("dixushi_shun", result.targets);
                        game.broadcastAll(function (target) {
                            target.changeZhuanhuanji("dixushi");
                        }, player);
                    }
                }
            },
            fan: {
                audio: 1,
                trigger: { target: "useCardToTarget" },
                direct: true,
                filter: function (event, player) {
                    return player.storage.dixushi && event.card && event.card.name == "sha" && player.countCards("he") > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseToDiscard("he", [1, Infinity], "你可弃置任意张牌，若你至【杀】使用者的距离+X之后在其攻击范围外（X为你弃置的牌数），你取消并获得这张【杀】，并视为发动了技能");
                    "step 1"
                    if (result.bool) {
                        var distance = get.distance(trigger.player, player);
                        if (distance + result.cards.length > trigger.player.getAttackRange()) {
                            trigger.targets.remove(player);
                            trigger.getParent().triggeredTargets2.remove(player);
                            trigger.getParent().xushier = player;
                            player.logSkill("dixushi_fan", result.targets);
                            game.broadcastAll(function (target) {
                                target.changeZhuanhuanji("dixushi");
                            }, player);
                        }

                    }
                }
            },
            sha: {
                sub: true,
                trigger: { global: "useCardAfter" },
                forced: true,
                silent: true,
                popup: false,
                filter: function (event, player) {
                    if (event.xushier != player) return false;
                    if (event.cards) {
                        for (var i = 0; i < event.cards.length; i++) {
                            if (event.cards[i].isInPile()) return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    var list = [];
                    for (var i = 0; i < trigger.cards.length; i++) {
                        if (trigger.cards[i].isInPile()) {
                            list.push(trigger.cards[i]);
                        }
                    }
                    player.gain(list, "gain2", "log");
                },
            },
        }

    },
    //界重岳
    dijie_zhige: {
        audio: 2,
        trigger: { source: "damageBegin2" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseControl(["基本牌", "锦囊牌", "装备牌", "cancel2"]).set("prompt", "是否对" + get.translation(trigger.player) + "发动【止戈】？").set("prompt2", "你可要求目标角色交给你指定类型的牌以取消此伤害");
            "step 1"
            if (result.control && result.control != "cancel2") {
                var t = result.control;
                trigger.player.chooseCard(
                    "交给" + get.translation(player) + "一张" + t + "以取消此伤害"
                    , "h",
                    function (card) {
                        if (get.type(card) == "basic" && _status.event.cardx == "基本牌")
                            return true;
                        if ((get.type(card) == "trick" || get.type(card) == "delay") && _status.event.cardx == "锦囊牌")
                            return true;
                        if (get.type(card) == "equip" && _status.event.cardx == "装备牌")
                            return true;
                        return false;
                    }
                ).set("cardx", t).set("ai", function (card) {
                    if (trigger.player.hp - trigger.num >= 2) return 6 - get.value(card);
                    else return 10 - get.value(card);
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.cards.length) {
                trigger.player.give(result.cards, player);
                trigger.cancel();
                player.logSkill("dijie_zhige", trigger.player);
            }
        }
    },
    dijie_wowu: {
        audio: 4,
        trigger: {
            player: "useCard"
        },
        frequent: true,
        init: function (player) {
            player.storage.dijie_wowu = [];
        },
        mark: true,
        marktext: "我",
        intro: {
            name: "我无",
            content: function (storage, player) {
                if (player.storage.dijie_wowu.length == 0) return "未记录";
                var text = "已记录";
                for (var i = 0; i < player.storage.dijie_wowu.length; i++) {
                    text += player.storage.dijie_wowu[i];
                    if (i < player.storage.dijie_wowu.length - 1) text += "、";
                }
                return text;
            }
        },
        content: function () {
            var t = get.type(trigger.card);
            if (t == "basic") t = "基本牌";
            if (t == "trick" || t == "delay") t = "锦囊牌";
            if (t == "equip") t = "装备牌";
            if (!player.storage.dijie_wowu.includes(t)) {
                game.broadcastAll(function (target, type) {
                    target.storage.dijie_wowu.push(type);
                    target.syncStorage("dijie_wowu");
                    target.updateMarks();
                }, player, t);
            }
            if (player.storage.dijie_wowu.length >= 3) {
                game.broadcastAll(function (target) {
                    target.storage.dijie_wowu = [];
                    target.syncStorage("dijie_wowu");
                    target.updateMarks();
                }, player);
                player.addMark("dijie_huiming", 1);
                player.draw(2);
            }
        }
    },
    dijie_huiming: {
        trigger: { player: "useCardAfter" },
        init: function (player) {
            player.storage.dijie_huiming = 0;
        },
        mark: true,
        marktext: "晦",
        intro: {
            markname: "晦明",
            content: "已发动#次【我无】",
        },
        forced: true,
        unique: true,
        juexingji: true,
        audio: 2,
        skillAnimation: true,
        animationColor: "soil",
        filter: function (event, player) {
            return player.countMark("dijie_huiming") >= 2;
        },
        content: function () {
            player.awakenSkill("dijie_huiming");
            player.removeMark("dijie_huiming", player.countMark("dijie_huiming"));
            player.unmarkSkill("dijie_huiming");
            player.recover();
            player.removeSkill("dijie_zhige");
            player.removeSkill("dijie_wowu");
            player.addSkill("dijie_wowu_v2");
            //player.markSkill("dijie_wowu_v2_sha");
        }
    },
    dijie_wowu_v2: {
        audio: "dijie_wowu",
        trigger: {
            player: "useCard"
        },
        frequent: true,
        init: function (player) {
            player.storage.dijie_wowu = [];
        },
        mark: true,
        marktext: "我",
        intro: {
            name: "我无",
            content: function (storage, player) {
                if (player.storage.dijie_wowu.length == 0) return "未记录";
                var text = "已记录";
                for (var i = 0; i < player.storage.dijie_wowu.length; i++) {
                    text += player.storage.dijie_wowu[i];
                    if (i < player.storage.dijie_wowu.length - 1) text += "、";
                }
                return text;
            }
        },
        content: function () {
            var t = get.type(trigger.card);
            if (t == "basic") t = "基本牌";
            if (t == "trick" || t == "delay") t = "锦囊牌";
            if (t == "equip") t = "装备牌";
            if (!player.storage.dijie_wowu.includes(t)) {
                game.broadcastAll(function (target, type) {
                    target.storage.dijie_wowu.push(type);
                    target.syncStorage("dijie_wowu");
                    target.updateMarks();
                }, player, t);
            }
            if (player.storage.dijie_wowu.length >= 2) {
                if (player.storage.dijie_wowu.includes("基本牌")) {
                    if (player.storage.dijie_wowu.includes("锦囊牌")) {
                        player.addSkill("dijie_wowu_v2_target");
                    } else if (player.storage.dijie_wowu.includes("装备牌")) {
                        player.addSkill("dijie_wowu_v2_base");
                        trigger.card.diwowu_notme = true;
                    }
                } else {
                    player.draw();
                }
                game.broadcastAll(function (target) {
                    target.storage.dijie_wowu = [];
                    target.syncStorage("dijie_wowu");
                    target.updateMarks();
                }, player);
                player.draw();
                if (player.hasSkill("dijie_wowu_v2_sha")) {
                    player.storage.dijie_wowu_v2_sha += 1;
                } else {
                    player.addTempSkill("dijie_wowu_v2_sha");
                    player.storage.dijie_wowu_v2_sha = 1;
                }
            }
        },
        subSkill: {
            sha: {
                mark: true,
                marktext: "无",
                intro: {
                    markname: "我无",
                    content: "本回合使用【杀】的次数上限+#",
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") {
                            return num + player.countMark("dijie_wowu_v2_sha");
                        }
                    }
                },
            },
            target: {
                trigger: { player: "useCard2" },
                forced: true,
                filter: function (event, player) {
                    var card = event.card;
                    if (get.type(card) != "trick" && get.type(card) != "basic") return false;
                    var info = get.info(card);
                    if (info.allowMultiple == false) return false;
                    if (event.targets && !info.multitarget) {
                        if (
                            game.hasPlayer(function (current) {
                                return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
                            })
                        ) {
                            return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    "step 0";
                    player.removeSkill("dijie_wowu_v2_target");
                    player
                        .chooseTarget("为" + get.translation(trigger.card) + "增加一个目标", function (card, player, target) {
                            var player = _status.event.player;
                            return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
                        })
                        .set("ai", function (target) {
                            var trigger = _status.event.getTrigger();
                            var player = _status.event.player;
                            return get.effect(target, trigger.card, player, player);
                        })
                        .set("card", trigger.card)
                        .set("targets", trigger.targets);
                    "step 1";
                    if (result.bool) {
                        if (!event.isMine() && !event.isOnline()) game.delayx();
                        event.targets = result.targets;
                    } else {
                        event.finish();
                    }
                    "step 2";
                    if (event.targets) {
                        trigger.targets.addArray(event.targets);
                        game.log(get.translation(trigger.player) + "为" + get.translation(trigger.card) + "多指点了目标" + get.translation(event.targets));
                    }
                },
            },
            base: {
                trigger: { player: "useCardToPlayered" },
                filter: function (event, player) {
                    return !event.card.diwowu_notme;
                },
                forced: true,
                content: function () {
                    trigger.getParent().baseDamage += 1;
                    player.removeSkill("dijie_wowu_v2_base");
                }
            },
        }
    },
    //艾雅法拉
    diluanhuo: {
        audio: 1,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        filter: function (event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        content: function () {
            player.discard(player.getCards("h"));
            player.draw(Math.floor(Math.random() * 6) + 2);
        }
    },
    didianran: {
        audio: 5,
        mark: true,
        marktext: "燃",
        init: function (player) {
            player.storage.didianran = 0;
        },
        intro: {
            content: "有#个【点燃】标记",
        },
        usable: 1,
        enable: "phaseUse",
        direct: true,
        filter: function (event, player) {
            return player.countMark("didianran") > 0;
        },
        content: function () {
            "step 0"
            var num = Math.min(player.countMark("didianran"), 3);
            var choices = [];
            for (var i = 1; i <= num; i++)
                choices.push(i);
            choices.push("cancel2");
            player.chooseControl(choices).set("prompt", "点燃：选择弃置【点燃】的数量。").set("prompt2", "出牌阶段限一次，你可弃置1~3个【点燃】，视为使用一张有前X项效果的火【杀】（X为弃置【点燃】的数量）：1.无距离限制，2.无法响应，3.对距离目标1以内所有其他角色各造成一点无属性伤害。");
            "step 1"
            if (result.control != "cancel2") {
                var num = result.control;
                player.removeMark("didianran", num);
                if (num == 1) {
                    player.chooseUseTarget({ name: "sha", nature: "fire" }, get.prompt("didianran"), "视为使用一张无距离限制的火【杀】", false, "nodistance").logSkill = "didianran";
                } else if (num == 2) {
                    player.chooseUseTarget({ name: "sha", nature: "fire", "dianran2": true }, get.prompt("didianran"), "视为使用一张无距离限制、无法响应的火【杀】", false, "nodistance").logSkill = "didianran";
                } else if (num == 3) {
                    player.chooseUseTarget({ name: "sha", nature: "fire", "dianran2": true, "dianran3": true }, get.prompt("didianran"), "视为使用一张无距离限制、无法响应的火【杀】，且对距离目标1以内所有其他角色各造成一点无属性伤害（包括自己）", false, "nodistance").logSkill = "didianran";
                }
            }
        },
        group: ["didianran_huo", "didianran_hit"],
        subSkill: {
            huo: {
                audio: "didianran",
                trigger: { global: "damageEnd" },
                forced: true,
                filter: function (event, player) {
                    return event.nature === "fire";
                },
                content: function () {
                    player.addMark("didianran", 1);
                },
            },
            hit: {
                silent: true,
                forced: true,
                trigger: { player: "useCardToPlayered" },
                filter: function (event, player) {
                    return event.card.name == "sha" && event.card.nature == "fire" && event.card.dianran2;
                },
                content: function () {
                    trigger.directHit.addArray(game.players);
                    if (trigger.card.dianran3) {
                        game.filterPlayer(function (current) {
                            if (get.distance(current, trigger.target) <= 1 && trigger.target != current) {
                                player.line(current);
                                current.damage();
                            }
                        });
                    }
                }
            }
        }
    },
    dihuoshan: {
        audio: 1,
        limited: true,
        skillAnimation: true,
        animationColor: "fire",
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countCards("h", { color: "red" }) > 0;
        },
        content: function () {
            "step 0"
            player.awakenSkill("dihuoshan");
            "step 1"
            player.chooseCardTarget({
                position: "h",
                prompt: "你可弃置任意张红色手牌并对等量角色各造成一点火属性伤害",
                selectCard: [1, Infinity],
                filterCard: { color: "red" },
                selectTarget() {
                    return [ui.selected.cards.length, ui.selected.cards.length];
                },
                filterTarget: function (card, player, target) {
                    return true;
                }
            });
            "step 2"
            if (result.bool) {
                player.discard(result.cards);
                for (var i = 0; i < result.targets.length; i++) {
                    player.line(result.targets[i], "fire");
                    result.targets[i].damage("fire");
                }
            }
        }
    },
    //木里空
    diyinjian: {
        trigger: { player: "useCardToPlayered" },
        forced: true,
        filter: function (event, player) {
            return event.targets && event.targets.length == 1 && get.distance(player, event.targets[0]) <= game.roundNumber;
        },
        content: function () {
            trigger.getParent().baseDamage += Math.floor(game.roundNumber / 2);
            trigger.directHit.addArray(game.players);
        }
    },
    diyali: {
        audio: "baonu",
        mark: true,
        marktext: "怒",
        init: function (player) {
            player.storage.diyali = 0;
        },
        intro: {
            name: "怒",
            content: "有#个【怒】标记",
        },
        forced: true,
        trigger: { player: "damageEnd" },
        content: function () {
            player.addMark("diyali");
        }
    },
    dihongwen: {
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            return player.countMark("diyali") > 0;
        },
        content: function () {
            player.removeMark("diyali", 1);
            player.useCard({ name: "jiu", isCard: true }, player);
        }
    },
    dicanzhu: {
        trigger: { target: "useCardToTarget" },
        forced: true,
        filter(event, player) {
            if (event.card.name != "sha") return false;
            return true;
        },
        content: function () {
            game.broadcastAll(function (t) {
                t.addTempSkill("ollongdan");
                t.addTempSkill("olpaoxiao");
            }, trigger.player);
        }
    },
    //史尔特尔
    dironghuo: {
        audio: 3,
        forced: true,
        trigger: { player: "useCardToPlayered" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha";
        },
        content: function () {
            for (var i = 0; i < trigger.targets.length; i++) {
                game.broadcastAll(function (t, c) {
                    t.addTempSkill("dironghuo_shan");
                    t.storage.dironghuo_shan = get.number(c);
                    t.markSkill("dironghuo_shan");
                }, trigger.targets[i], trigger.card);
            }
        },
        group: ["dironghuo_pan"],
        subSkill: {
            shan: {
                forced: true,
                silent: true,
                mark: true,
                marktext: "熔",
                init: function (player) {
                    player.storage.dironghuo_shan = 0;
                },
                intro: {
                    name: "熔火",
                    content: function (storage, player) {
                        if (player.storage.dironghuo_shan == 0) return "";
                        var s = ["?", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
                        return "不能打出或使用点数低于" + s[player.storage.dironghuo_shan] + "的【闪】";
                    }
                },
                mod: {
                    cardEnabled: function (card, player) {
                        if (card.name == "shan" && get.number(card) < player.storage.dironghuo_shan) return false;
                    },
                    cardUsable: function (card, player) {
                        if (card.name == "shan" && get.number(card) < player.storage.dironghuo_shan) return false;
                    },
                    cardRespondable: function (card, player) {
                        if (card.name == "shan" && get.number(card) < player.storage.dironghuo_shan) return false;
                    },
                    cardSavable: function (card, player) {
                        if (card.name == "shan" && get.number(card) < player.storage.dironghuo_shan) return false;
                    },
                },
            },
            pan: {
                trigger: { source: "damageAfter" },
                forced: true,
                silent: true,
                audio: "dironghuo",
                filter: function (event) {
                    return event.card && event.card.name == "sha";
                },
                content: function () {
                    "step 0"
                    player.judge();
                    "step 1"
                    if (result.number < trigger.card.number) {
                        player.loseHp();
                    }
                }
            },
        }
    },
    diyujin: {
        audio: 2,
        trigger: { player: "dying" },
        filter: function (event, player) {
            return !player.storage.diyujin;
        },
        content: function () {
            player.storage.diyujin = true;
            player.recover(1 - player.hp);
            player.insertPhase("diyujin_die");
            player.addSkill("diyujin_die");
            player.storage.diyujin_die = _status.currentPhase == player ? 2 : 1;
        },
        subSkill: {
            die: {
                forced: true,
                silent: true,
                trigger: { player: "phaseEnd" },
                content: function () {
                    player.storage.diyujin_die--;
                    if (player.storage.diyujin_die == 0)
                        player.die();
                }
            }
        }
    },
    dihuanghun: {
        audio: 2,
        enable: "phaseUse",
        limited: true,
        skillAnimation: true,
        animationColor: "fire",
        content: function () {
            "step 0"
            player.awakenSkill("dihuanghun");
            player.gainMaxHp(5 - player.maxHp);
            player.recover(5 - player.hp);
            var sum = 0;
            player.countCards("h", function (card) {
                sum += get.number(card);
            });
            event.num = sum;
            "step 1"
            player.discard(player.getCards("h"));
            "step 2"
            var card = get.cardPile2("sha");
            player.gain(card, "gain2");
            event.num -= get.number(card);
            game.delay(1);
            "step 3"
            if (event.num > 0) event.goto(2);
            "step 4"
            player.addSkill("olpaoxiao");
            player.removeSkill("dironghuo");
            player.addSkill("dironghuo_v2");
        }
    },
    dironghuo_v2: {
        audio: "dironghuo",
        forced: true,
        trigger: { player: "useCardToPlayered" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha";
        },
        content: function () {
            for (var i = 0; i < trigger.targets.length; i++) {
                game.broadcastAll(function (t, c) {
                    t.addTempSkill("dironghuo_shan");
                    t.storage.dironghuo_shan = get.number(c);
                    t.markSkill("dironghuo_shan");
                }, trigger.targets[i], trigger.card);
            }
        },
        group: ["dironghuo_v2_sha", "dironghuo_v2_jieshu"],
        subSkill: {
            sha: {
                trigger: { source: "damageAfter" },
                forced: true,
                silent: true,
                audio: "dironghuo",
                filter: function (event) {
                    return event.card && event.card.name == "sha";
                },
                content: function () {
                    player.loseHp();
                }
            },
            jieshu: {
                trigger: { player: "phaseEnd" },
                forced: true,
                silent: true,
                audio: "dironghuo",
                content: function () {
                    player.loseHp();
                }
            }
        }
    },
    //季沧海
    diliaoyuan: {
        audio: 3,
        usable: 1,
        direct: true,
        trigger: { target: "useCardToTarget" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && player.countCards("h", { name: "shan" }) > 0;
        },
        content: function () {
            "step 0"
            player.chooseToDiscard("h", get.prompt2("diliaoyuan"), { name: "shan" });
            "step 1"
            if (result.bool) {
                player.logSkill("diliaoyuan", trigger.player);
                trigger.targets.remove(player);
                trigger.getParent().triggeredTargets2.remove(player);
                //trigger.untrigger();
                game.delayx();
                player.line(trigger.player, "fire");
                trigger.player.damage("fire");
            }
        }
    },
    difenshen: {
        audio: 3,
        mark: true,
        marktext: "焚",
        init: function (player) {
            player.storage.difenshen = 0;
        },
        intro: {
            name: "焚身",
            content: "累计造成或受到#点伤害",
        },
        trigger: { player: "damageEnd", source: "damageEnd" },
        forced: true,
        content: function () {
            "step 0"
            player.addMark("difenshen", trigger.num);
            "step 1"
            if (player.countMark("difenshen") >= 3) {
                choices = ["获得【冲拳】", "获得【巨焰】", "cancel2"];
                player.chooseControl(choices).set("prompt", "移除之前以此法获得的技能，并从【冲拳】或【巨焰】中选择一个技能获得").set("prompt2", "【冲拳】有角色使用【杀】时，若其在你的攻击范围内，你可弃置一张【闪】取消该【杀】的全部目标，并对其造成一点火属性伤害。<br/>【巨焰】出牌阶段限一次，你可将一张红色牌交给一名其他玩家，然后你摸一张牌，并令其选择获得一项效果：1.下次受到的伤害 + 1，且直到其下次出牌阶段开始前，桃对其无效；2.受到2点火属性伤害。");
            } else {
                event.finish();
            }
            "step 2"
            if (result.control != "cancel2") {
                player.removeMark("difenshen", player.countMark("difenshen"));
                player.logSkill("difenshen");
                if (result.control == "获得【冲拳】") {
                    game.broadcastAll(function (t) {
                        t.removeSkill("dijuyan");
                        t.addSkill("dichongquan");
                    }, player);

                } else {
                    game.broadcastAll(function (t) {
                        t.removeSkill("dichongquan");
                        t.addSkill("dijuyan");
                    }, player);
                }
            }
        }
    },
    dichongquan: {
        audio: "diliaoyuan",
        firstDo: true,
        direct: true,
        trigger: { global: "useCardToTarget" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && player.countCards("h", { name: "shan" }) > 0 && player.inRange(event.player);
        },
        content: function () {
            "step 0"
            player.chooseToDiscard("h", get.prompt2("diliaoyuan"), { name: "shan" });
            "step 1"
            if (result.bool) {
                player.logSkill("dichongquan", trigger.player);
                trigger.targets.length = 0;
                trigger.getParent().triggeredTargets2.length = 0;
                trigger.untrigger();
                game.delayx();
                player.line(trigger.player, "fire");
                trigger.player.damage("fire");
            }
        }
    },
    dijuyan: {
        usable: 1,
        enable: "phaseUse",
        audio: 3,
        filter: function (event, player) {
            return player.countCards("h", { color: "red" }) > 0;
        },
        content: function () {
            "step 0"
            player.chooseCardTarget({
                position: "he",
                prompt: "将一张红色牌交给一名其他玩家，并令其选择获得一项效果：1.下次受到的伤害 + 1，且直到其下次出牌阶段开始前，桃对其无效；2.受到2点火属性伤害",
                selectCard: 1,
                filterCard: { color: "red" },
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return target != player;
                }
            });
            "step 1"
            if (result.bool) {
                player.give(result.cards, result.targets[0]);
                player.draw();
                choices = ["选项一", "选项二"];
                event.target = result.targets[0];
                result.targets[0].chooseControl(choices).set("prompt", "选择获得一项效果").set("prompt2", "1.下次受到的伤害 + 1，且直到你的下次出牌阶段开始前，桃对你无效；2.受到2点火属性伤害");
            } else {
                event.finish();
            }
            "step 2"
            if (result.control == "选项一") {
                game.broadcastAll(function (t) {
                    t.addSkill("dijuyan_shanghai");
                    t.addTempSkill("dijuyan_tao", { player: "phaseUseBegin" });
                }, event.target);
            } else {
                event.target.damage(2, "fire");
            }
        },
        subSkill: {
            shanghai: {
                forced: true,
                mark: true,
                marktext: "焰",
                intro: {
                    name: "巨焰",
                    content: "下次受到的伤害+1",
                },
                trigger: { player: "damageBegin1" },
                content: function () {
                    trigger.num++;
                    game.broadcastAll(function (t) {
                        t.removeSkill("dijuyan_shanghai");
                    }, player);
                }
            },
            tao: {
                forced: true,
                mark: true,
                marktext: "焰",
                intro: {
                    name: "巨焰",
                    content: "下次出牌阶段开始前，桃对你无效",
                },
                trigger: { target: "useCardToTarget" },
                filter: function (event, player) {
                    return event.card && event.card.name == "tao";
                },
                content: function () {
                    trigger.targets.remove(player);
                    trigger.getParent().triggeredTargets2.remove(player);
                }
            }
        }
    },
    //知更鸟
    didiezou: {
        audio: 6,
        trigger: { player: "phaseEnd" },
        direct: true,
        marktext: "音",
        intro: {
            name: "音",
            markcount: "expansion",
            content: "expansion",
        },
        filter: function (event, player) {
            var cards = player.getExpansions("didiezou");
            let suits = new Set();
            cards.forEach(card => { if (card.suit) { suits.add(card.suit); } });
            const allSuits = ["heart", "diamond", "club", "spade"];
            let remainingSuits = allSuits.filter(suit => !suits.has(suit));
            return player.countCards("h", { suit: remainingSuits }) > 0;
        },
        content: function () {
            "step 0"
            var cards = player.getExpansions("didiezou");
            let suits = new Set();
            cards.forEach(card => { if (card.suit) { suits.add(card.suit); } });
            const allSuits = ["heart", "diamond", "club", "spade"];
            let remainingSuits = allSuits.filter(suit => !suits.has(suit));
            player.chooseCard("h", "是否发动【迭奏】", "你可以将一张手牌置于武将牌上，称为【音】（每种花色的【音】限一张）", { suit: remainingSuits });
            "step 1"
            if (result.bool) {
                if (result.cards && result.cards.length) {
                    player.addToExpansion(result.cards, player, "give").gaintag.add("didiezou");
                    player.logSkill("didiezou");
                }
            }
        },
        group: ["didiezou_sha", "didiezou_shan"],
        subSkill: {
            sha: {
                audio: "didiezou",
                trigger: { global: "useCardAfter" },
                direct: true,
                usable: 1,
                filter: function (event, player) {
                    if (event.card && event.card.name == "sha" && event.card.isCard && event.cards.length == 1) {
                        var cards = player.getExpansions("didiezou");
                        let suits = new Set();
                        cards.forEach(card => { if (card.suit) { suits.add(card.suit); } });
                        const allSuits = ["heart", "diamond", "club", "spade"];
                        let remainingSuits = allSuits.filter(suit => !suits.has(suit));
                        if (event.cards[0].suit && remainingSuits.includes(get.suit(event.cards[0]))) return true;
                        if (event.player.countCards("h", { suit: remainingSuits }) > 0) return true;
                    }
                    return false;
                },
                content: function () {
                    "step 0"
                    var cards = player.getExpansions("didiezou");
                    let suits = new Set();
                    cards.forEach(card => { if (card.suit) { suits.add(card.suit); } });
                    const allSuits = ["heart", "diamond", "club", "spade"];
                    let remainingSuits = allSuits.filter(suit => !suits.has(suit));
                    event.suits = remainingSuits;
                    choices = [];
                    if (trigger.cards[0].suit && remainingSuits.includes(get.suit(trigger.cards[0]))) {
                        choices.push("置入此【杀】");
                    }
                    if (trigger.player.countCards("h", { suit: remainingSuits }) > 0) {
                        choices.push("置入一张手牌");
                    }
                    choices.push("cancel2");
                    trigger.player.chooseControl(choices).set("prompt", "是否响应知更鸟的【迭奏】？").set("prompt2", "你可以将此【杀】或一张手牌置于其武将牌上，称为【音】，然后你与其各摸一张牌。")
                        .set("ai", function () {
                            if (get.attitude(trigger.player, player) > 0) return choices[0];
                            return "cancel2";
                        });
                    "step 1"
                    if (result.control == "置入此【杀】") {
                        player.logSkill("didiezou", trigger.player);
                        player.addToExpansion(trigger.cards[0], player, "gain2").gaintag.add("didiezou");
                        player.draw();
                        trigger.player.draw();
                        event.finish();
                    } else if (result.control == "置入一张手牌") {
                        trigger.player.chooseCard("h", "选择一张手牌置入【音】", { suit: event.suits });
                    } else {
                        event.finish();
                    }
                    "step 2"
                    if (result.bool) {
                        player.logSkill("didiezou", trigger.player);
                        player.addToExpansion(result.cards, player, "give").gaintag.add("didiezou");
                        player.draw();
                        trigger.player.draw();
                    }
                }
            },
            shan: {
                audio: "didiezou",
                trigger: { player: ["chooseToRespondBefore", "chooseToUseBefore"] },
                direct: true,
                filter: function (event, player) {
                    if (event.responded) return false;
                    if (!event.filterCard({ name: "shan" }, player, event)) return false;
                    return player.getExpansions("didiezou").length > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCardButton("是否弃置一张【音】，视为你使用或打出了【闪】并摸一张牌", player.getExpansions("didiezou"));
                    "step 1"
                    if (result.bool) {
                        trigger.untrigger();
                        trigger.responded = true;
                        trigger.result = { bool: true, card: { name: "shan" } };
                        player.loseToDiscardpile(result.links);
                        player.draw();
                        player.logSkill("didiezou", trigger.player);
                    }
                }
            }
        }
    },
    dihesong: {
        audio: 2,
        trigger: { player: "phaseUseBegin" },
        filter: function (event, player) {
            return player.getExpansions("didiezou").length >= 3;
        },
        content: function () {
            "step 0"
            event.num = player.getExpansions("didiezou").length;
            player.loseToDiscardpile(player.getExpansions("didiezou"));
            var prompt2 = "";
            if (event.num == 3)
                prompt2 = "你与其各摸两张牌";
            else
                prompt2 = "其从【英姿】【咆哮】【神速】【帷幕】中选择一个技能获得，然后你与其各摸两张牌";
            player.chooseTarget("选择一名角色", prompt2);
            "step 1"
            if (result.bool) {
                if (event.num == 3) {
                    player.draw(2);
                    result.targets[0].draw(2);
                    event.finish();
                } else {
                    var choices = ["英姿", "咆哮", "神速", "帷幕"];
                    result.targets[0].chooseControl(choices).set("prompt", "选择一个技能获得").set("prompt2", "【英姿】锁定技，摸牌阶段摸牌时，你额外摸一张牌；你的手牌上限为你的体力上限。<br/>【咆哮】①锁定技，你使用【杀】无次数限制。②锁定技，当你使用的【杀】被【闪】抵消时，你获得一枚“咆”（→）当你因【杀】造成伤害时，你弃置所有“咆”并令伤害值+X（X为“咆”数）。回合结束后，你弃置所有“咆”。<br/>【神速】你可以选择一至三项：1. 跳过判定阶段和摸牌阶段；2. 跳过出牌阶段并弃置一张装备牌；3. 跳过弃牌阶段并将你的武将牌翻面。你每选择一项，视为你对一名其他角色使用一张没有距离限制的【杀】。<br/>【帷幕】锁定技。①你不能成为黑色锦囊牌的目标。②当你于回合内受到伤害时，你防止此伤害并摸2X张牌（X为伤害值）。");
                    event.target = result.targets[0];
                }
            } else {
                event.finish();
            }
            "step 2"
            if (result.control) {
                var skillName = "";
                if (result.control == "英姿") skillName = "reyingzi";
                else if (result.control == "咆哮") skillName = "olpaoxiao";
                else if (result.control == "神速") skillName = "xinshensu";
                else if (result.control == "帷幕") skillName = "reweimu";
                game.broadcastAll(function (t, s) {
                    t.addSkill(s);
                }, event.target, skillName);
                player.draw(2);
                event.target.draw(2);
            }
        }
    },
    dixieyue: {
        audio: 2,
        enable: "phaseUse",
        content: function () {
            "step 0"
            choices = [];
            if (game.bgMusic.paused)
                choices.push("播放");
            else
                choices.push("暂停");
            choices.push("在银河中孤独摇摆", "Never gonna give you up", "See You Again", "冬の花");
            choices.push("cancel2");
            player.chooseControl(choices).set("prompt", "谐乐：你可播放/切换/暂停音乐");
            "step 1"
            if (result.control == "cancel2") {
                event.finish();
            }
            else if (result.control == "播放") {
                game.broadcastAll(function () {
                    game.bgMusic.play();
                });
            } else if (result.control == "暂停") {
                game.broadcastAll(function () {
                    game.bgMusic.pause();
                });
            } else {
                game.broadcastAll(function (r) {
                    game.bgMusic.src = "audio/music/" + r + ".mp3";
                    game.bgMusic.play();
                }, result.control);
            }
        },
        group: ["dixieyue_kaishi"],
        subSkill: {
            kaishi: {
                firstDo: true,
                silent: true,
                audio: 1,
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                filter: function (event, player) {
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                forced: true,
                content: function () {
                    game.log(player, "开始歌唱！")
                    game.broadcastAll(function () {
                        game.bgMusic.loop = true;
                        game.bgMusic.volume = 0.2;
                    });
                },
            }
        }
    },
    //一方通行
    dishiliang: {
        audio: 3,
        usable: 1,
        trigger: { global: "useCardToTargeted" },
        filter: function (event, player) {
            return event.player != player && !event.targets.includes(event.player) && player.maxHp > 2;
        },
        content: function () {
            "step 0";
            player.chooseTarget(
                "取消" + get.translation(trigger.card) + "的任意个目标",
                [1, Math.min(trigger.targets.length, player.maxHp - 2)],
                function (card, player, target) {
                    return _status.event.sourcex.includes(target);
                }
            ).set("sourcex", trigger.targets);
            "step 1";
            if (result.bool) {
                event.targets = result.targets;
                player.loseMaxHp(result.targets.length + 1);
                trigger.targets.removeArray(result.targets);
                trigger.getParent().triggeredTargets2.removeArray(result.targets);
            } else {
                event.finish();
            }
            "step 2";
            event.num = event.targets.length;
            event.correct = event.targets.length;
            "step 3"
            game.check();
            game.pause();
            fetch('./character/divineintervention/dic.json').then(function (response) {
                return response.json();
            }).then(function (data) {
                event.dic = JSON.parse(JSON.stringify(data, null, 2));
                game.resume();
            });
            "step 4";
            if (event.num > 0) {
                const choice = Math.floor(Math.random() * 2);
                const selectedEntry = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)];
                const selectedWord = selectedEntry.word;
                const selectedPre = selectedEntry.pre;
                if (choice === 1) {
                    const randomPres = [];
                    while (randomPres.length < 3) {
                        const randomPre = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)].pre;
                        if (!randomPres.includes(randomPre)) {
                            randomPres.push(randomPre);
                        }
                    }
                    const insertAt = Math.floor(Math.random() * (randomPres.length + 1));
                    randomPres.splice(insertAt, 0, selectedPre);
                    event.ans = insertAt;
                    player.chooseControl(randomPres).set("prompt", selectedWord);
                } else {
                    const randomWords = [];
                    while (randomWords.length < 3) {
                        const randomWord = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)].word;
                        if (!randomWords.includes(randomWord)) {
                            randomWords.push(randomWord);
                        }
                    }
                    const insertAt = Math.floor(Math.random() * (randomWords.length + 1));
                    randomWords.splice(insertAt, 0, selectedWord);
                    event.ans = insertAt;
                    player.chooseControl(randomWords).set("prompt", selectedPre);
                }
            } else {
                event.goto(6);
            }
            "step 5";
            event.num--;
            if (result.index == event.ans) {
                player.popup("请坐");
            } else {
                player.popup("Again?");
                event.correct--;
            }
            event.goto(4);
            "step 6";
            event.udn1 = event.correct;
            if (event.udn1 <= 0) event.finish();
            "step 7";
            player.gainMaxHp(event.udn1);
            player.chooseTarget("从取消的目标中选择" + event.udn1 + "名角色视为反向处理对其使用的牌（无视限制且无对应实体牌）", [1, event.udn1], function (card, player, target) {
                return _status.event.targetsx.includes(target);
            }).set("targetsx", event.targets);
            "step 8";
            if (result.bool) {
                event.udtargets = result.targets;
            } else {
                event.finish();
            }
            "step 9";
            if (event.udtargets.length) {
                var t = event.udtargets.pop();
                t.useCard(trigger.card, trigger.player, false);
            } else {
                event.finish();
            }
            "step 10";
            event.goto(9);
        }
    },
    //浊心斯卡蒂
    dixueqin: {
        audio: 1,
        trigger: { global: "roundStart" },
        init: function (player) {
            player.storage.dixueqin = [];
        },
        direct: true,
        content: function () {
            "step 0";
            game.filterPlayer(function (current) {
                if (current.hasSkill("dixueqin2"))
                    current.removeSkill("dixueqin2");
            });
            player.chooseTarget("选择至多" + player.hp + "名角色作为【血亲】", [1, player.hp], lib.filter.notMe);
            "step 1";
            if (result.bool) {
                player.logSkill("dixueqin", result.targets);
                if (result.targets.length < player.hp) player.draw(player.hp - result.targets.length);
                result.targets.forEach(function (target) {
                    if (!player.storage.dixueqin.includes(target))
                        player.storage.dixueqin.push(target);
                    target.addSkill("dixueqin2");
                    target.storage.dixueqin2_range = player;
                });
            } else {
                player.draw(player.hp);
            }
        },
    },
    dixueqin2: {
        mark: true,
        marktext: "亲",
        intro: {
            name: "血亲",
            content: "你本轮已成为浊心斯卡蒂的【血亲】",
        },
        group: ["dixueqin2_range"],
        subSkill: {
            range: {
                mod: {
                    targetInRange: function (card, player, target) {
                        if (card.name == "sha" && player.storage.dixueqin2_range.inRange(target)) {
                            return true;
                        }
                    },
                },
            }
        }
    },
    ditongzang: {
        audio: "ditonggui",
        trigger: { global: "damageBegin" },
        filter: function (event, player) {
            return event.player.hasSkill("dixueqin2");
        },
        content: function () {
            if (!player.storage.ditongzang.includes(trigger.player)) {
                player.line(trigger.player, "fire");
                player.storage.ditongzang.push(trigger.player);
                player.loseHp();
                trigger.cancel();
            }
        },
        group: ["ditongzang_lun"],
        subSkill: {
            lun: {
                trigger: { global: "roundStart" },
                forced: true,
                silent: true,
                content: function () {
                    player.storage.ditongzang = [];
                }
            }
        }
    },
    ditonggui: {
        audio: 6,
        direct: true,
        trigger: { global: "useCard" },
        filter: function (event, player) {
            return player.countCards("he") > 0 && event.player.hasSkill("dixueqin2") && event.card && event.card.name == "sha";
        },
        content: function () {
            "step 0";
            player.chooseToDiscard("he", "是否弃置一张牌，使" + get.translation(trigger.player) + "的" + get.translation(trigger.card) + "不计入出【杀】次数？");
            "step 1";
            if (result.bool) {
                player.logSkill("ditonggui", trigger.player);
                trigger.player.getStat().card.sha--;
            }
        }
    },
    dishenghua: {
        audio: 1,
        trigger: { player: "dying" },
        limited: true,
        skillAnimation: true,
        animationColor: "thunder",
        content: function () {
            "step 0"
            player.awakenSkill("dishenghua");
            event.current = player.next;
            "step 1"
            if (event.current != player) {
                if (player.storage.dixueqin.includes(event.current)) {
                    event.current.chooseControl(["选项一", "选项二"]).set("prompt", "请选择一项").set("prompt2", "1.失去一点体力并使" + get.translation(player) + "回复一点体力<br>2.摸一张牌");
                } else {
                    event.current = event.current.next;
                    event.goto(1);
                }
            } else {
                event.goto(3);
            }
            "step 2"
            if (result.control == "选项一") {
                player.recover();
                event.current.loseHp();
            } else {
                event.current.draw();
            }
            event.current = event.current.next;
            event.goto(1);
            "step 3"
            game.broadcastAll(function (t) {
                t.removeSkill("ditongzang");
                t.removeSkill("ditonggui");
                t.addSkill("dichaoyong");
                t.addSkill("dichaoku");
            }, player);
        }
    },
    dichaoyong: {
        audio: "ditonggui",
        frequent: true,
        trigger: { player: "phaseDrawEnd" },
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        direct: true,
        content: function () {
            "step 0"
            event.given_map = {};
            event.num = player.countCards("h");
            "step 1";
            player.chooseCardTarget({
                filterCard: function (card) {
                    return get.itemtype(card) == "card" && !card.hasGaintag("dichaoyong_fenpei");
                },
                filterTarget: function (card, player, target) {
                    return target.hasSkill("dixueqin2");
                },
                selectCard: [1, event.num],
                prompt: "请选择要分配的卡牌和目标",
                ai1: function (card) {
                    if (!ui.selected.cards.length) return 1;
                    return 0;
                },
                ai2: function (target) {
                    var player = _status.event.player,
                        card = ui.selected.cards[0];
                    var val = target.getUseValue(card);
                    if (val > 0) return val * get.attitude(player, target) * 2;
                    return get.value(card, target) * get.attitude(player, target);
                },
            });
            "step 2";
            if (result.bool) {
                var res = result.cards,
                    target = result.targets[0].playerid;
                player.addGaintag(res, "dichaoyong_fenpei");
                event.num -= res.length;
                if (!event.given_map[target]) event.given_map[target] = [];
                event.given_map[target].addArray(res);
                if (event.num > 0) event.goto(1);
            }
            "step 3";
            if (_status.connectMode) {
                game.broadcastAll(function () {
                    delete _status.noclearcountdown;
                    game.stopCountChoose();
                });
            }
            var map = [],
                cards = [];
            for (var i in event.given_map) {
                var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                player.line(source, "green");
                //if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.18);
                map.push([source, event.given_map[i]]);
                source.addTempSkill("dichaoyong_sha", { player: "phaseEnd" });
                source.addMark("dichaoyong_sha", event.given_map[i].length);
                cards.addArray(event.given_map[i]);
            }
            game.loseAsync({
                gain_list: map,
                player: player,
                cards: cards,
                giver: player,
                animate: "giveAuto",
            }).setContent("gaincardMultiple");
        },
        subSkill: {
            sha: {
                mark: true,
                marktext: "潮",
                intro: {
                    name: "潮涌",
                    content: "出牌阶段使用【杀】的次数+#",
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha") return num + player.countMark("dichaoyong_sha");
                    }
                }
            }
        }
    },
    dichaoku: {
        firstDo: true,
        audio: "ditonggui",
        forced: true,
        trigger: { global: "roundStart" },
        init: function (player) {
            player.storage.dichaoku = false;
        },
        filter: function (event, player) {
            return game.roundNumber > 1;
        },
        content: function () {
            if (!player.storage.dichaoku)
                player.loseHp();
            player.storage.dichaoku = false;
        },
        group: ["dichaoku_dead"],
        subSkill: {
            dead: {
                forced: true,
                silent: true,
                trigger: { global: "die" },
                filter: function (event, player) {
                    return !player.storage.dichaoku
                },
                content: function () {
                    player.storage.dichaoku = true;
                }
            }
        }
    },
    //宗小静
    dimoxie: {
        usable: 4,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        content: function () {
            "step 0";
            player.chooseCardTarget({
                position: "he",
                selectCard: 1,
                selectTarget: [1, Infinity],
                filterTarget: lib.filter.notMe,
                prompt: get.prompt("dimoxie"),
                prompt2: "弃置一张牌选择任意名其他角色同时参加英语默写",
            });
            "step 1";
            if (result.bool) {
                player.discard(result.cards);
                event.players = result.targets.slice(0);
                event._global_waiting = true;
            } else event.finish();
            "step 2";
            game.check();
            game.pause();
            fetch('./character/divineintervention/dic.json').then(function (response) {
                return response.json();
            }).then(function (data) {
                event.dic = JSON.parse(JSON.stringify(data, null, 2));
                game.resume();
            });
            "step 3";
            const questionType = Math.floor(Math.random() * 2);
            const selectedEntry = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)];
            const selectedWord = selectedEntry.word;
            const selectedPre = selectedEntry.pre;
            event.moxie = [];
            if (questionType === 1) {
                const randomPres = [];
                while (randomPres.length < 3) {
                    const randomPre = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)].pre;
                    if (!randomPres.includes(randomPre)) {
                        randomPres.push(randomPre);
                    }
                }
                const insertAt = Math.floor(Math.random() * (randomPres.length + 1));
                randomPres.splice(insertAt, 0, selectedPre);
                event.moxie = [selectedWord, randomPres, selectedPre];
            } else {
                const randomWords = [];
                while (randomWords.length < 3) {
                    const randomWord = event.dic.dic[Math.floor(Math.random() * event.dic.dic.length)].word;
                    if (!randomWords.includes(randomWord)) {
                        randomWords.push(randomWord);
                    }
                }
                const insertAt = Math.floor(Math.random() * (randomWords.length + 1));
                randomWords.splice(insertAt, 0, selectedWord);
                event.moxie = [selectedPre, randomWords, selectedWord];
            }
            game.broadcastAll(function (t, m) {
                t.forEach(function (target) {
                    target.storage.moxie = m;
                });
            }, event.players, event.moxie);
            "step 4";
            var send = function (source) {
                var next = game.createEvent("dimoxie_choose", false);
                next.player = game.me;
                next.source = source;
                next.setContent(lib.skill.dimoxie.contentx);
                game.resume();
            };
            var sendback = function (result, player) {
                if (!result) {
                    result = "random";
                }
                event.results.push([player, result]);
            };
            event.ai_targets = [];
            event.results = [];
            event.correctPlayers = [];
            event.answerPlayers = [];
            event.wrongPlayers = [];
            var players = game
                .filterPlayer(function (current) {
                    return current != player;
                })
                .sortBySeat();
            var time = 10000;
            if (lib.configOL && lib.configOL.choose_timeout) time = parseInt(lib.configOL.choose_timeout) * 1000;
            for (var i = 0; i < players.length; i++) {
                players[i].showTimer(time);
                if (!event.players.includes(players[i])) continue;
                if (players[i].isOnline()) {
                    event.withol = true;
                    players[i].send(send, player);
                    players[i].wait(sendback);
                } else if (players[i] == game.me) {
                    event.withme = true;
                    var next = game.createEvent("dimoxie_choose", false);
                    next.player = game.me;
                    next.source = player;
                    next.setContent(lib.skill.dimoxie.contentx);
                    if (_status.connectMode) game.me.wait(sendback);
                } else {
                    event.ai_targets.push(players[i]);
                }
            }
            if (event.ai_targets.length) {
                event.ai_targets.randomSort();
                setTimeout(function () {
                    event.interval = setInterval(
                        function () {
                            var target = event.ai_targets.shift();
                            sendback("random", target);
                            if (!event.ai_targets.length) {
                                clearInterval(event.interval);
                                if (event.withai) game.resume();
                            }
                        },
                        _status.connectMode ? 750 : 75
                    );
                }, 500);
            }
            "step 5";
            if (event.withme) {
                if (_status.connectMode) game.me.unwait(result, game.me);
                else {
                    if (!result) {
                        result = "random";
                    }
                    event.results.push([player, result]);
                }
            }
            "step 6";
            if (event.withol && !event.resultOL) {
                game.pause();
            }
            "step 7";
            if (event.ai_targets.length > 0) {
                event.withai = true;
                game.pause();
            }
            "step 8";
            delete event._global_waiting;
            for (var i of game.players) i.hideTimer();
            event.videoId = lib.status.videoId++;
            game.broadcastAll(
                function (name, id, results, answerPlayers, correctPlayers, wrongPlayers) {
                    var dialog = ui.create.dialog(name + "发动了技能【默写】", "hidden", "forcebutton");
                    dialog.videoId = id;
                    dialog.classList.add("scroll1");
                    dialog.classList.add("scroll2");
                    dialog.classList.add("fullwidth");
                    dialog.classList.add("fullheight");
                    dialog.buttonss = [];

                    var list = ["及格名单", "不及名单"];
                    for (var i = 0; i < list.length; i++) {
                        dialog.add('<div class="text center">' + list[i] + "</div>");
                        var buttons = ui.create.div(".buttons", dialog.content);
                        dialog.buttonss.push(buttons);
                        buttons.classList.add("popup");
                        buttons.classList.add("guanxing");
                    }
                    dialog.open();
                    var getx = function () {
                        var item = results.shift();
                        var index = item[1] == "0" ? 0 : 1;
                        var index = 0;
                        answerPlayers.push(item[0]);
                        if (item[1] == "correct") {
                            index = 0;
                            correctPlayers.push(item[0]);
                        }
                        else if (item[1] == "random") {
                            var dui = Math.random() < 0.7;
                            if (dui) {
                                index = 0;
                                correctPlayers.push(item[0]);
                            }
                            else {
                                index = 1;
                                wrongPlayers.push(item[0]);
                            }
                        }
                        else {
                            index = 1;
                            wrongPlayers.push(item[0]);
                        }
                        var button = ui.create.button(item[0], "player", dialog.buttonss[index]);
                        if (results.length > 0) getx();
                    };
                    getx();

                },
                get.translation(player),
                event.videoId,
                event.results.slice(0),
                event.answerPlayers,
                event.correctPlayers,
                event.wrongPlayers
            );
            game.delay(0, 1500 + event.results.length * 500);
            "step 9";
            game.broadcastAll("closeDialog", event.videoId);
            "step 10"
            game.log("默写正确的名单（按顺序）：", event.correctPlayers);
            game.log("默写不及的名单（按顺序）：", event.wrongPlayers);
            game.log("参加默写的名单（按顺序）：", event.answerPlayers);
            if (event.correctPlayers.length > 0) {
                player.line(event.correctPlayers[0], "green");
                event.correctPlayers[0].draw(2);
            }
            var punishPlayers = event.wrongPlayers;
            punishPlayers.addArray(event.answerPlayers.slice(-1));
            punishPlayers.forEach(function (target) {
                player.line(target, "fire");
                target.addMark("dimoxie_buji", 1);
            });
        },
        contentx: function () {
            "step 0";
            event._global_waiting = true;
            event.result = "random";
            player
                .chooseControl(player.storage.moxie[1])
                .set("prompt", "Now here 把书收起来，本子拿出来")
                .set("prompt2", "Listen to my question：" + player.storage.moxie[0])
                .set("_global_waiting", true);
            "step 1";
            if (result.control && result.control == player.storage.moxie[2]) {
                event.result = "correct";
            } else {
                event.result = "wrong";
            }
        },
        group: ["dimoxie_fa"],
        subSkill: {
            buji: {
                mark: true,
                marktext: "寄",
                intro: {
                    name: "不及",
                    content: "你已#次不及",
                },
            },
            fa: {
                forced: true,
                trigger: { player: "phaseUseEnd" },
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        return current.countMark("dimoxie_buji") > 0;
                    }) > 0;
                },
                content: function () {
                    game.filterPlayer(function (current) {
                        if (current.countMark("dimoxie_buji") > 0) {
                            player.line(current, "yellow");
                            var num = current.countMark("dimoxie_buji");
                            current.removeMark("dimoxie_buji", num);
                            if (num == 4) {
                                current.turnOver();
                                player.turnOver();
                            } else if (num == 3) {
                                player.loseHp();
                                current.chooseToDiscard("he", 3, true);
                            } else if (num == 2) {
                                current.loseHp();
                            } else if (num == 1) {
                                current.chooseToDiscard("he", true);
                            }
                        }
                    });
                }
            }
        }
    },
    //符玄
    diqiongguan: {
        audio: 3,
        marktext: "阵",
        intro: {
            name: "穷观阵",
            markcount: "expansion",
            content: "expansion",
        },
        group: ["diqiongguan_mopai", "diqiongguan_panding"],
        subSkill: {
            mopai: {
                audio: "diqiongguan",
                trigger: { player: "drawBegin" },
                prompt2(event, player) {
                    var num = event.num - player.getExpansions("diqiongguan").length;
                    if (num > 0) {
                        return "从【穷观阵】中获得" + get.translation(player.getExpansions("diqiongguan")) + "，并从牌堆中摸" + num + "张牌";
                    } else {
                        return "从【穷观阵】中获得" + get.translation(player.getExpansions("diqiongguan").slice(0, event.num));
                    }
                },
                filter: function (event, player) {
                    return player.getExpansions("diqiongguan").length > 0;
                },
                content: function () {
                    if (trigger.num > player.getExpansions("diqiongguan").length) {
                        var num = trigger.num - player.getExpansions("diqiongguan").length;
                        trigger.player.gain(player.getExpansions("diqiongguan"), "draw");
                        trigger.num = num;
                    } else {
                        trigger.player.gain(player.getExpansions("diqiongguan").splice(0, trigger.num), "draw");
                        trigger.cancel();
                    }
                }
            },
            panding: {
                audio: "diqiongguan",
                trigger: { global: "judgeBefore" },
                prompt2(event, player) {
                    return "是否使" + get.translation(event.player) + "的" + get.translation(event.judgestr) + "判定牌改为【穷观阵】中的" + get.translation(player.getExpansions("diqiongguan").splice(0, 1));
                },
                filter: function (event, player) {
                    return player.getExpansions("diqiongguan").length > 0;
                },
                priority: 1,
                content: function () {
                    "step 0";
                    var card = player.getExpansions("diqiongguan").splice(0, 1)[0];
                    var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
                    event.videoId = lib.status.videoId++;
                    event.dialog = ui.create.dialog(judgestr);
                    event.dialog.classList.add("center");
                    event.dialog.videoId = event.videoId;

                    game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
                    var node;
                    if (game.chess) {
                        node = card.copy("thrown", "center", ui.arena).addTempClass("start");
                    } else {
                        node = player.$throwordered(card.copy(), true);
                    }
                    node.classList.add("thrownhighlight");
                    ui.arena.classList.add("thrownhighlight");
                    if (card) {
                        trigger.cancel();
                        trigger.result = {
                            card: card,
                            judge: trigger.judge(card),
                            node: node,
                            number: get.number(card),
                            suit: get.suit(card),
                            color: get.color(card),
                        };
                        if (trigger.result.judge > 0) {
                            trigger.result.bool = true;
                        }
                        if (trigger.result.judge < 0) {
                            trigger.result.bool = false;
                        }
                        game.log(trigger.player, "的判定结果为", card);
                        trigger.direct = true;
                        trigger.position.appendChild(card);
                        game.delay(2);
                    } else {
                        event.finish();
                    }
                    "step 1";
                    ui.arena.classList.remove("thrownhighlight");
                    event.dialog.close();
                    game.addVideo("judge2", null, event.videoId);
                    ui.clear();
                    var card = trigger.result.card;
                    trigger.position.appendChild(card);
                    trigger.result.node.delete();
                    player.updateMarks();
                    game.delay();
                },
            },
        }
    },
    disanyan: {
        audio: 3,
        trigger: { player: "phaseBegin" },
        frequent: true,
        content: function () {
            "step 0";
            var num = game.countPlayer() < 4 ? 3 : 5;
            var cards = get.cards(num);
            game.cardsGotoOrdering(cards);
            var qgcards = player.getExpansions("diqiongguan");
            game.cardsGotoOrdering(qgcards);
            var next = player.chooseToMove();
            next.set("list", [["牌堆顶", cards], ["穷观阵", qgcards]]);
            next.set("prompt", "三眼：将这些牌以任意顺序置于牌堆顶或【穷观阵】中");
            next.set("filterMove", function (from, to, moved) {
                if (to == 1 && moved[to].length >= 4) return false;
                return true;
            });
            next.processAI = function (list) {
                /*var cards = list[0][1],
                    player = _status.event.player;
                var target = _status.event.getTrigger().name == "phaseZhunbei" ? player : player.next;
                var att = get.sgn(get.attitude(player, target));
                var top = [];
                var judges = target.getCards("j");
                var stopped = false;
                if (player != target || !target.hasWuxie()) {
                    for (var i = 0; i < judges.length; i++) {
                        var judge = get.judge(judges[i]);
                        cards.sort(function (a, b) {
                            return (judge(b) - judge(a)) * att;
                        });
                        if (judge(cards[0]) * att < 0) {
                            stopped = true;
                            break;
                        } else {
                            top.unshift(cards.shift());
                        }
                    }
                }
                var bottom;
                if (!stopped) {
                    cards.sort(function (a, b) {
                        return (get.value(b, player) - get.value(a, player)) * att;
                    });
                    while (cards.length) {
                        if (get.value(cards[0], player) <= 5 == att > 0) break;
                        top.unshift(cards.shift());
                    }
                }
                bottom = cards;
                return [top, bottom];*/
                return [list[0][1], []];
            };
            "step 1";
            var list = result.moved[0];
            while (list.length) {
                ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
            }
            player.addToExpansion(result.moved[1].reverse(), player, "give").gaintag.add("diqiongguan");
            "step 2";
            game.delayx();
        },
    },
    dibie: {
        audio: 2,
        trigger: { player: "dying" },
        prompt2(event, player) {
            var heart = 0;
            var cards = player.getExpansions("diqiongguan");
            for (var i = 0; i < cards.length; i++) {
                if (get.suit(cards[i]) == "heart") heart++;
            }
            return "弃置【穷观阵】中所有牌，视为对自己使用" + get.cnNumber(heart) + "张【桃】。";
        },
        filter: function (event, player) {
            return player.getExpansions("diqiongguan").length > 0;
        },
        content: function () {
            "step 0";
            var cards = player.getExpansions("diqiongguan");
            event.heart = 0;
            for (var i = 0; i < cards.length; i++) {
                if (get.suit(cards[i]) == "heart") event.heart++;
            }
            "step 1";
            player.loseToDiscardpile(player.getExpansions("diqiongguan"));
            "step 2";
            for (var i = 0; i < event.heart; i++) {
                player.useCard({ name: "tao", isCard: true }, player);
            }

        },
    },
    //神主日
    direnxing: {
        forced: true,
        trigger: { player: "phaseUseBegin" },
        filter: function (event, player) {
            return player.hujia == 0;
        },
        content: function () {
            player.changeHujia(10);
        },
        group: ["direnxing_po", "direnxing_mo"],
        subSkill: {
            po: {
                trigger: { player: "changeHujiaAfter" },
                forced: true,
                filter: function (event, player) {
                    return player.hujia == 0;
                },
                content: function () {
                    player.turnOver();
                    player.discard(player.getCards("h"));
                    game.filterPlayer(function (current) {
                        if (current != player && current.name != "difellowhuisheng")
                            current.changeHujia(2);
                    });
                }
            },
            mo: {
                forced: true,
                trigger: { player: "turnOverEnd" },
                filter: function (event, player) {
                    return !player.isTurnedOver();
                },
                content: function () {
                    player.draw(4);
                }
            }
        }
    },
    diyuxiang: {
        init: function (player) {
            player.storage.diyuxiang = 0;
        },
        group: ["diyuxiang_d1j", "diyuxiang_d2j"],
        subSkill: {
            d1j: {
                audio: 1,
                forced: true,
                trigger: { player: "dying" },
                filter: function (event, player) {
                    return player.storage.diyuxiang == 0;
                },
                content: function () {
                    trigger.yuxiang = true;
                    player.storage.diyuxiang++;
                    player.gainMaxHp(5);
                    player.recover(5 + player.maxHp - player.hp);
                    if (player.isTurnedOver()) player.turnOver();
                    if (player.isLinked()) player.link();
                    player.discard(player.getCards("j"));
                    game.filterPlayer(function (current) {
                        if (current.name == "difellowhuisheng") {
                            game.broadcastAll(function (t) {
                                t.removeSkill("difellowhuishengskill");
                                t.addSkill("difellowhuishengskill2");
                            }, current);
                        }
                        game.broadcastAll(function (t) {
                            if (t.hasSkill("diyimeng_shoushang"))
                                t.removeSkill("diyimeng_shoushang");
                        }, current);
                    });
                    game.broadcastAll(function (t) {
                        t.removeSkill("diyimeng");
                        t.addSkill("diyimeng2");
                    }, player);
                }
            },
            d2j: {
                audio: 1,
                forced: true,
                trigger: { player: "dying" },
                filter: function (event, player) {
                    return player.storage.diyuxiang == 1 && !event.yuxiang;
                },
                content: function () {
                    game.broadcastAll(function () {
                        game.bgMusic.loop = true;
                        game.bgMusic.volume = 0.3;
                        game.bgMusic.src = "audio/music/dishenzhuri3.mp3";
                        game.bgMusic.play();
                    });
                    player.storage.diyuxiang++;
                    player.gainMaxHp(10);
                    player.recover(10 + player.maxHp - player.hp);
                    if (player.isTurnedOver()) player.turnOver();
                    if (player.isLinked()) player.link();
                    player.discard(player.getCards("j"));
                    game.filterPlayer(function (current) {
                        if (current.name == "difellowhuisheng")
                            current.die();
                        game.broadcastAll(function (t) {
                            if (t.hasSkill("diyimeng2_shoushang"))
                                t.removeSkill("diyimeng2_shoushang");
                        }, current);
                    });
                    game.broadcastAll(function (t) {
                        t.removeSkill("dihuisheng");
                        t.removeSkill("diyimeng2");
                        t.addSkill("ditaichu");
                        t.addSkill("dizaowu");
                    }, player);
                }
            }
        }
    },
    dihuisheng: {
        audio: 1,
        lastDo: true,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        filter: function (event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        content: function () {
            game.broadcastAll(function () {
                game.bgMusic.loop = true;
                game.bgMusic.volume = 0.3;
                game.bgMusic.src = "audio/music/dishenzhuri12.mp3";
                game.bgMusic.play();
            });
            game.filterPlayer(function (current) {
                if (current.name == "difellowhuisheng")
                    current.discard(current.getCards("h"), false);
            });
        },
        group: ["dihuisheng_mopai"],
        subSkill: {
            mopai: {
                forced: true,
                trigger: { player: "phaseDrawBegin2" },
                content: function () {
                    trigger.num += game.countPlayer(function (current) {
                        return current.name == "difellowhuisheng" && !current.isTurnedOver();
                    });
                },
            }
        }
    },
    diyimeng: {
        audio: 2,
        enable: "phaseUse",
        usable: 1,
        filterTarget: function (card, player, target) {
            return target != player;
        },
        filterCard: true,
        position: "h",
        check: function (card) {
            return 5 - get.value(card);
        },
        line: "thunder",
        content: function () {
            game.broadcastAll(function (t) {
                t.addSkill("diyimeng_shoushang");
            }, target);
        },
        ai: {
            order: 12,
            result: {
                target: function (player, target) {
                    if (
                        get.damageEffect(target, player, target) < 0
                        && !target.hasSkill("diyimeng_shoushang")
                    ) {
                        return -4;
                    }
                    return 0;
                },
            },
        },
        group: ["diyimeng_remove"],
        subSkill: {
            remove: {
                silent: true,
                forced: true,
                trigger: { player: "phaseUseBegin" },
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        return current.hasSkill("diyimeng_shoushang");
                    }) > 0;
                },
                content: function () {
                    game.filterPlayer(function (current) {
                        if (current.hasSkill("diyimeng_shoushang"))
                            current.removeSkill("diyimeng_shoushang");
                    });
                }
            },
            shoushang: {
                forced: true,
                mark: true,
                marktext: "梦",
                intro: {
                    name: "异梦",
                    content: "受到的伤害+1",
                },
                trigger: { player: "damageBegin1" },
                content: function () {
                    trigger.num++;
                }
            }
        }
    },
    diyimeng2: {
        audio: "diyimeng",
        enable: "phaseUse",
        usable: 1,
        position: "h",
        filterTarget: function (card, player, target) {
            return target != player;
        },
        complexCard: true,
        complexSelect: true,
        selectTarget: function () {
            return ui.selected.cards.length;
        },
        filterCard: true,
        selectCard: [1, Infinity],
        check: function (card) {
            var player = _status.event.player;
            if (ui.selected.cards.length < game.countPlayer(function (current) {
                if (player == current) return false;
                return get.attitude(player, current) < 0;
            }))
                return 5 - get.value(card);
            else
                return 0;
        },
        line: "thunder",
        content: function () {
            game.broadcastAll(function (t) {
                t.addSkill("diyimeng2_shoushang");
            }, target);
        },
        ai: {
            order: 12,
            result: {
                target: function (player, target) {
                    if (get.attitude(player, target) < 0 && !target.hasSkill("diyimeng2_shoushang")) {
                        return -4;
                    }
                    return 0;
                },
            },
        },
        group: ["diyimeng2_remove"],
        subSkill: {
            remove: {
                silent: true,
                forced: true,
                trigger: { player: "phaseUseBegin" },
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        return current.hasSkill("diyimeng2_shoushang");
                    }) > 0;
                },
                content: function () {
                    game.filterPlayer(function (current) {
                        if (current.hasSkill("diyimeng2_shoushang"))
                            current.removeSkill("diyimeng2_shoushang");
                    });
                }
            },
            shoushang: {
                forced: true,
                mark: true,
                marktext: "梦",
                intro: {
                    name: "异梦",
                    content: "受到的伤害+1，手牌上限-1",
                },
                trigger: { player: "damageBegin1" },
                content: function () {
                    trigger.num++;
                },
                mod: {
                    maxHandcardBase: function (player, num) {
                        return num - 1;
                    },
                },
            }
        }
    },
    ditaichu: {
        forced: true,
        mark: true,
        marktext: "日",
        intro: {
            name: "太初",
            content: function (storage, player) {
                return "第" + get.cnNumber(player.countMark("ditaichu")) + "日";
            }
        },
        trigger: { player: "phaseBegin" },
        content: function () {
            player.skip("phaseZhunbei");
            player.skip("phaseJudge");
            player.skip("phaseDraw");
            player.skip("phaseUse");
            player.skip("phaseDiscard");
            player.skip("phaseJieshu");
        },
        group: ["ditaichu_di1ri", "ditaichu_di2ri", "ditaichu_di3ri", "ditaichu_di4ri", "ditaichu_di5ri", "ditaichu_di6ri", "ditaichu_di7ri", "ditaichu_di8ri"],
        subSkill: {
            di1ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 0 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di2ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 1 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di3ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 2 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di4ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 3 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di5ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 4 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di6ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 5 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di7ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 6 && !event.taichu;
                },
                content: function () {
                    player.addMark("ditaichu", 1);
                    trigger.taichu = true;
                }
            },
            di8ri: {
                audio: 1,
                forced: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return event.player != player && player.countMark("ditaichu") == 7 && !event.taichu;
                },
                content: function () {
                    trigger.taichu = true;
                    player.removeMark("ditaichu", player.countMark("ditaichu"));
                    game.filterPlayer(function (current) {
                        if (current != player) {
                            player.line(current);
                            current.damage(4);
                        }
                    });
                }
            },
        }
    },
    dizaowu: {
        audio: "difellowhuishengskill2",
        forced: true,
        trigger: { player: "turnOverEnd" },
        content: function () {
            player.removeMark("ditaichu", 3);
        },
        group: ["dizaowu_mopai"],
        subSkill: {
            mopai: {
                audio: "difellowhuishengskill",
                forced: true,
                trigger: { player: "damageEnd" },
                content: function () {
                    trigger.source.draw();
                }
            }
        }
    },
    //神主日召唤：旧梦的回声
    difellowhuishengskill: {
        audio: 4,
        forced: true,
        trigger: { player: ["damageBegin", "loseHpBegin"] },
        filter: function (event, player) { return !event.huisheng; },
        content: function () {
            trigger.cancel();
            trigger.huisheng = true;
            if (trigger.name == "damage") {
                for (var i = 0; i <= game.players.length; i++) {
                    if (game.players[i].name == "dishenzhuri") {
                        var nature = "";
                        if (trigger.hasNature("fire")) nature = "fire";
                        if (trigger.hasNature("thunder")) nature = "thunder";
                        if (trigger.hasNature("ice")) nature = "ice";
                        if (trigger.hasNature("kami")) nature = "kami";
                        player.line(game.players[i], nature);
                        game.players[i].damage(trigger.num, trigger.source, nature);
                        player.turnOver();
                        break;
                    }
                };
            } else {
                for (var i = 0; i <= game.players.length; i++) {
                    if (game.players[i].name == "dishenzhuri") {
                        player.line(game.players[i], nature);
                        game.players[i].loseHp(trigger.num);
                        player.turnOver();
                    }
                };
            }
        }
    },
    difellowhuishengskill2: {
        audio: 7,
        forced: true,
        trigger: { player: ["damageBegin", "loseHpBegin"] },
        filter: function (event, player) { return !event.huisheng; },
        content: function () {
            trigger.cancel();
            trigger.huisheng = true;
            if (trigger.name == "damage") {
                for (var i = 0; i <= game.players.length; i++) {
                    if (game.players[i].name == "dishenzhuri") {
                        var nature = "";
                        if (trigger.hasNature("fire")) nature = "fire";
                        if (trigger.hasNature("thunder")) nature = "thunder";
                        if (trigger.hasNature("ice")) nature = "ice";
                        if (trigger.hasNature("kami")) nature = "kami";
                        player.line(game.players[i], nature);
                        game.players[i].damage(trigger.num, trigger.source, nature);
                        player.turnOver();
                        break;
                    }
                };
            } else {
                for (var i = 0; i <= game.players.length; i++) {
                    if (game.players[i].name == "dishenzhuri") {
                        player.line(game.players[i], nature);
                        game.players[i].loseHp(trigger.num);
                        player.turnOver();
                    }
                };
            }
        },
        group: ["difellowhuishengskill2_sha"],
        subSkill: {
            sha: {
                trigger: { player: "phaseZhunbeiBegin" },
                direct: true,
                content: function () {
                    player.chooseUseTarget("视为使用一张没有距离限制的【杀】", { name: "sha" }, false, "nodistance").logSkill = "difellowhuishengskill2_sha";
                },
                ai: {
                    threaten: function (player, target) {
                        return 1.6;
                    },
                },
            }
        }
    },
};

export default skills;
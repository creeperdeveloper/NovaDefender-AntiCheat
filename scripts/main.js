import * as server from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import * as data from "data.js";
import * as action from "action.js";
let readmes =
  "NovaDefenderの改造、自己制作発言は禁止です。 \n\nこのアドオンによって発生した損害については一切の責任を問いません。\n\n機能作れとか言わないでください()（提案はして欲しいです（逆に）)";

let changelog_list = [
  { name: "changelog 機能追加", disp: " ", time: "2025/3/11" },
  {
    name: "over enchant 検知機能を追加",
    disp: "UIdevelop",
    time: "2025/3/13/",
  },
  {
    name: "公式サイトを作成",
    disp: "site create",
    time: "2025/3/13",
  },
  {
    name: "修正",
    disp: "欠点を修正",
    time: "2025/3/21",
  },
  {
    name: "更新",
    disp: "公式サイトを更新",
    time: "2025/4/21",
  },
];

let creater_about = "http://about.creeper.developers.f5.si";
let official_support_server = data.getsupport();
let official_site_url = "https://novadefender.anticheat.f5.si/";
let blacklist = ["iZet2", "sabakan8484"];
let grade = data.getgrade();
let saku = data.getsaku();
let admin = "FlimsyDeer05833";
let abouts = [
  `§e${grade}${saku}`,
  "§r",
  "§sscriptAPIを使った",
  "§s多機能アンチチートアドオンです。",
  "\n\n\n\n§vdeveloper: §rFlimsyDeer05833 / creeper_developer",
  `ダウンロード: `,
  `§v公式サイト: §r${official_site_url}`,
  `§vサポートサーバー: §r${official_support_server}`,
  `§v作者情報: §r${creater_about}`,
];

let elapsedTicks = 0;
let ms = true;
let msc = 0;
let v = "v1.2.3-beta";
let tickCount = 0;
let lastTime = Date.now();
let currentTPS = 20;
let joincount = 0;
server.system.runInterval(() => {
  if (getdp("nova:command_firsts") == undefined) {
    setdp("nova:command_firsts", ";");
  }
});

function getprefix() {
  return String(getdp("nova:command_firsts"));
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(";admin setdp ")) {
    if (ev.sender.name == admin) {
      ev.cancel = true;
      let args = ev.message.split(";admin setdp ");
      setdp(String(args[0]), String(args[1]));
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §eAdmin Console: §aworld.dynamicproperty §e${args[0]} = ${args[1]}`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(";admin setdp.bool ")) {
    if (ev.sender.name == admin) {
      ev.cancel = true;
      let arg = ev.message.split(";admin setdp.bool ");
      let args = arg[1].split(" ");
      if (args[1] == "true") {
        setdp(String(args[0]), true);
        ev.sender.sendMessage(
          `[§a§lNovaDefender§r] §eAdmin Console: §aworld.dynamicproperty §e${args[0]} = true`
        );
      } else {
        setdp(String(args[0]), false);
        ev.sender.sendMessage(
          `[§a§lNovaDefender§r] §eAdmin Console: §aworld.dynamicproperty §e${args[0]} = false`
        );
      }
    }
  }
});

server.system.runInterval(() => {
  if (server.world.scoreboard.getObjective("nova:data") == undefined) {
    server.world.scoreboard.addObjective("nova:data");
  }
});

server.system.runInterval(() => {
  server.system.run(() => {
    command(`scoreboard players set tps nova:data ${Math.floor(currentTPS)}`);
  });
});

let command_list = {
  kick: {
    disp: "プレイヤーをkickします。",
    syntax: `kick [player: String]`,
    permission: "operator",
  },
  help: {
    disp: "コマンドのヘルプを表示します。 helpの後にコマンドを入れるとそのコマンドについて詳しくわかります。",
    syntax: `help [command: String]`,
    permission: "operator",
  },
  setting: {
    disp: "設定パネルを表示します。",
    syntax: `setting`,
    permission: "operator",
  },
  op: {
    disp: "operator権限を付与します プレイヤー名を指定しない場合実行プレイヤーが指定されます",
    syntax: `op [player: String]`,
    permission: "operator",
  },
  deop: {
    disp: "operator権限を奪略します プレイヤー名を指定しない場合実行プレイヤーが指定されます",
    syntax: `deop [player: String]`,
    permission: "operator",
  },
  tps: {
    disp: "現在のワールドTPSを表示します。",
    syntax: `tps`,
    permission: "operator",
  },
  data: {
    disp: "特定のプレイヤーの詳細データを表示します。",
    syntax: `data [playername: String]`,
    permission: "operator",
  },
  item: {
    disp: "パネルを開くアイテムを取得します",
    syntax: `item`,
    permission: "operator",
  },
  about: {
    disp: "このアドオンの情報を表示します",
    syntax: `about`,
    permission: "operator",
  },
  time: {
    disp: "現在時刻とワールド起動経過時間を表示します。",
    syntax: `time`,
    permission: "operator",
  },
  discord: {
    disp: "現在のサポートディスコードサーバーのURLを表示します。",
    syntax: `discord`,
    permission: "operator",
  },
  afk: {
    disp: "放置状態を切り替えます。",
    syntax: `afk`,
    permission: "member",
  },
  mute: {
    disp: "プレイヤーのミュート状態を変更します。 ミュートがfalseの場合trueに変更し、trueの場合はfalseに変更します 対象プレイヤーを指定していない場合はコマンド実行者が対象にされます。",
    syntax: `mute [player: String]`,
    permission: "operator",
  },
  site: {
    disp: "NovaDefender AntiCheatに関連するサイトURLを表示します。",
    syntax: `site`,
    permission: "operator",
  },
  command: {
    disp: "コマンドを実行します。",
    syntax: `command [command: String]`,
    permission: "operator",
  },
};

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  if (ev.initialSpawn && joincount == 0) {
    console.log(`[NovaDefender AntiCheat ${v}] activation.`);
    joincount++;
  } else {
    return;
  }
});

server.system.run(() => {
  console.log(`[NovaDefender AntiCheat ${v}] activation.`);
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}time`) {
    ev.cancel = true;
    if (getop(ev.sender) == true) {
      ev.sender.sendMessage(`§v--- world time data ---`);
      ev.sender.sendMessage(
        `§pRealTime:§r ${dispgetjptime()}\n§pWorld Elapsed Time: §r${getWorldUptime()}`
      );
    } else {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}version`) {
    ev.cancel = true;
    if (getop(ev.sender) == true) {
      ev.sender.sendMessage(`§aNovaDefender version in use is ${v}!`);
    } else {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}site`) {
    ev.cancel = true;
    if (getop(ev.sender) == true) {
      ev.sender.sendMessage(
        `§v--- NovaDefneder AntiCheat ${v} official site ---`
      );
      ev.sender.sendMessage(` §e- §asite url: §p${official_site_url}`);
      ev.sender.sendMessage(
        ` §e- §acreater about site url: §p${creater_about}`
      );
    } else {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

function getop(player) {
  if (player.getDynamicProperty("nova:operator") === undefined) {
    return false;
  } else if (player.getDynamicProperty("nova:operator") == false) {
    return false;
  } else if (player.getDynamicProperty("nova:operator") == true) {
    return true;
  } else {
    return undefined;
  }
}

server.world.afterEvents.chatSend.subscribe((ev) => {
  let afk_player_list = [];
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:sleep") == true) {
      afk_player_list.push(player.name);
    }
  });

  afk_player_list.forEach((players) => {
    if (ev.message.includes(players)) {
      action.worldnotfi(`[§a§lNovaDefender§r] §a${players} は AFKです。`);
    }
  });
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (
    ev.message == ";owner addon.reset" &&
    ev.sender.name == String(getdp("nova:owner"))
  ) {
    ev.cancel = true;
    server.world.clearDynamicProperties();
    server.system.runTimeout(() => {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §aNovaDefenderをリセットしました。`
      );
    }, 20);
  }
});

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:sleep") == undefined) {
      player.setDynamicProperty("nova:sleep", false);
    } else {
      return;
    }
  });
});

function getsleep(player) {
  if (player.getDynamicProperty("nova:sleep") == true) {
    return "true";
  } else {
    return "false";
  }
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}afk`) {
    ev.cancel = true;
    ev.sender.setDynamicProperty(
      "nova:sleep",
      !ev.sender.getDynamicProperty("nova:sleep")
    );
    ev.sender.sendMessage(
      "[§a§lNovaDefender§r] §a放置状態を §e" +
        String(ev.sender.getDynamicProperty("nova:sleep")) +
        "§r §aに変更しました。"
    );
    server.world.sendMessage(
      "[§a§lNovaDefender§r] §e" +
        ev.sender.name +
        " §aの放置状態が §e" +
        String(ev.sender.getDynamicProperty("nova:sleep")) +
        "§r §aに変更されました。"
    );
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}about`) {
    ev.cancel = true;
    if (getop(ev.sender)) {
      ev.cancel = true;
      let about_view = "";
      abouts.forEach((nakami) => {
        about_view = about_view + nakami + `\n`;
      });
      ev.sender.sendMessage(
        `§a§lNovaDefender AntiCheat ${v} \n§v------------------------§r\n${about_view}`
      );
    } else {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

server.system.runInterval(() => {
  if (getdp("nova:autoop") == undefined) {
    setdp("nova:autoop", true);
  }
});

server.system.runInterval(() => {
  if (getdp("nova:autoop")) {
    if (getPlayerByName(getdp("nova:owner")) === undefined) {
      return;
    }
    let owner = getPlayerByName(getdp("nova:owner"));
    if (
      owner.getDynamicProperty("nova:operator") == false &&
      owner.getDynamicProperty("nova:operator") !== undefined
    ) {
      owner.sendMessage(
        "[§a§lNovaDefender§r] §aオペレーター権限が取り消されたため自動付与しました。"
      );
      owner.setDynamicProperty("nova:operator", true);
    } else {
      return;
    }
  }
});

server.system.run(() => {
  server.world.sendMessage(
    "§7このワールドにはNovaDefender AntiCheat " + v + "が搭載されています。"
  );
});

function over_enchantment_processing(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button(`§lnone`);
  form.button(`§lnotification`);
  form.button(`§lkick`);
  form.button(`§lban`);
  form.button("§l戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          setdp("nova:over_enchantment_processing", 0);
          over_enchantment_setting(player);
          break;
        case 1:
          setdp("nova:over_enchantment_processing", 1);
          over_enchantment_setting(player);
          break;
        case 2:
          setdp("nova:over_enchantment_processing", 2);
          over_enchantment_setting(player);
          break;
        case 3:
          player.sendMessage(
            "BAN機能は開発中です。 現在使うことができません。"
          );
          server.system.runTimeout(() => {
            over_enchantment_setting(player);
          }, 40);
          break;
        case 4:
          over_enchantment_setting(player);
          break;
        default:
          over_enchantment_setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

server.system.runInterval(() => {
  if (getdp("nova:over_enchantment_processing") == undefined) {
    setdp("nova:over_enchantment_processing", 1);
  }
});
function over_enchantment_setting(player) {
  let processing = 0;
  if (getdp("nova:over_enchantment_processing") == 0) {
    processing = "none";
  } else if (getdp("nova:over_enchantment_processing") == 1) {
    processing = "notfi";
  } else if (getdp("nova:over_enchantment_processing") == 2) {
    processing = "kick";
  } else if (getdp("nova:over_enchantment_processing") == 3) {
    processing = "ban";
  }
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button(
    `§lactive state\n§7${String(getdp("nova:over_enchantment_get"))}`
  ); //0
  form.button(`§lprocessing\n§7${processing}`); //1
  form.button("§l戻る / return", "textures/ui/realms_red_x"); //2
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        nova_hub(player);
        return;
      }
      switch (response.selection) {
        case 0:
          if (getdp("nova:over_enchantment_get") == true) {
            setdp("nova:over_enchantment_get", false);
            over_enchantment_setting(player);
          } else {
            setdp("nova:over_enchantment_get", true);
            over_enchantment_setting(player);
          }
          break;
        case 1:
          over_enchantment_processing(player);
          break;
        case 2:
          setting(player);
          break;
        default:
          setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function getenchantment(itemStack) {
  let enchantment_list = [];
  if (itemStack && itemStack.getComponent("minecraft:enchantable")) {
    const enchantableComponent = itemStack.getComponent(
      "minecraft:enchantable"
    );
    const enchantments = enchantableComponent.getEnchantments();

    if (enchantments.length > 0) {
      for (const enchantment of enchantments) {
        const enchantmentType = enchantment.type;
        const enchantmentLevel = enchantment.level;
        enchantment_list.push({
          type: enchantmentType,
          id: enchantmentType.id,
          level: enchantmentLevel,
        });
      }
      return enchantment_list;
    } else {
      return [];
    }
  } else {
    return [];
  }
}

function getper(player) {
  if (player.getDynamicProperty("nova:operator") === undefined) {
    return false;
  } else if (player.getDynamicProperty("nova:operator") == true) {
    return true;
  } else if (player.getDynamicProperty("nova:operator") == false) {
    {
      return false;
    }
  }
}

//オーバエンチャント検知関数
function overenchantment_del(player) {
  if (getper(player) == true) return;
  const inventoryComp = player.getComponent("minecraft:inventory");
  const container = inventoryComp.container;

  for (let slot = 0; slot < container.size; slot++) {
    const itemStack = container.getItem(slot);
    getenchantment(itemStack).forEach((item) => {
      if (item.level > item.type.maxLevel) {
        let processing_level = getdp("nova:over_enchantment_processing");
        if (processing_level == 0) {
          return;
        } else if (processing_level == 1) {
          container.setItem(slot, null);
          server.world.sendMessage(
            `[§a§lNovaDefender§r] 不正なエンチャントレベルを検知しました。\n §p- §r${player.name}\n §p- ${item.id} / ${item.level} / ${itemStack.typeId}§r`
          );
        } else if (processing_level == 2) {
          container.setItem(slot, null);
          server.world.sendMessage(
            `[§a§lNovaDefender§r] 不正なエンチャントレベルを検知しました。\n §p- §r${player.name}\n §p- ${item.id} / ${item.level} / ${itemStack.typeId}§r`
          );
          command(
            `kick ${player.name} §lkicked by NovaDefender\n 不正なエンチャントレベルを検知しました。\n - ${player.name} \n - ${item.id} / ${item.level} / ${itemStack.typeId}`
          );
          allop_notfi(
            `${player.name} を 不正なエンチャントレベルを検知したためkickしました。 (${item.id} / ${item.level} / ${itemStack.typeId})`
          );
        } else if (processing_level == 3) {
          // player.setDynamicProperty("nova:ban", true);
          action.opnotfi("BAN機能は開発中です。 現在使うことができません。");
          container.setItem(slot, null);
          server.world.sendMessage(
            `[§a§lNovaDefender§r] 不正なエンチャントレベルを検知しました。\n §p- §r${player.name}\n §p- ${item.id} / ${item.level} / ${itemStack.typeId}§r`
          );
        }
      }
    });
  }
}

server.system.runInterval(() => {
  if (getdp("nova:over_enchantment_get") == undefined) {
    setdp("nova:over_enchantment_get", true);
  }
  if (getdp("nova:over_enchantment_get") == true) {
    server.world.getPlayers().forEach((player) => {
      overenchantment_del(player);
    });
  }
});

//banシステム | 開発中
// server.system.runInterval(() => {
//   server.world.getPlayers().forEach((player) => {
//     if (
//       player.getDynamicProperty("nova:ban") == true ||
//       player.getDynamicProperty("nova:ban") !== undefined
//     ) {
//       player.setDynamicProperty("nova:ban", false);
//       let ban_list = JSON.parse(getdp("nova:ban_list"));
//       ban_list.push(`${player.name}`);
//       setdp(JSON.stringify(ban_list));
//     }
//   });
// });

// server.system.runInterval(() => {
//   server.world.getPlayers().forEach((player) => {
//     if (JSON.parse(getdp("nova:ban_list")).includes(`${player.name}`) == true) {
//       command(`kick ${player.name} §lkicked by NovaDefender\n §r§pType: §rBan`);
//     }
//   });
// });

function allop_notfi(message) {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:operator") == true) {
      player.sendMessage(`[§a§lNovaDefender§r] ${message}`);
    } else {
      return;
    }
  });
}

//利用規約表示ページ
function readme(player) {
  const form = new ui.ActionFormData();
  form.body(`${readmes}`);
  form.button("§a同意して進む §b/§a Agree and proceed");
  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        nova_setup_page_1(player);
        break;
    }
  });
}

//セットアップページ
function nova_setup_page_home(player) {
  const form = new ui.ActionFormData();
  form.body(
    "§aNovaDefender AntiCheat §rセットアップウィザードへようこそ。\nこの度は導入ありがとうございます。   まずはセットアップを行いましょう。"
  );
  form.button("§a進む §b/§a move on.");
  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        readme(player);
        break;
    }
  });
}

//便利系関数
function cancel(ev) {
  ev.cancel = true;
}

function notify(text, pl) {
  pl.sendMessage(`[§a§lNovaDefender§r] ${text}`);
}

function world_notify(text) {
  server.world.sendMessage(`[§a§lNovaDefender§r] ${text}`);
}

function getplayer() {
  return server.world.getPlayers();
}

//----------------------------------------

//セットアップ完了+権限付与ページ
function nova_setup_page_end(player) {
  const form = new ui.ActionFormData();
  form.body(
    `§aセットアップが完了しました。 "help"でコマンド一覧を表示します。`
  );
  form.button("§a完了。 / done.");
  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        player.sendMessage("§aセットアップが完了しました。  お疲れ様でした");
        player.setDynamicProperty("nova:operator", true);
        setdp("nova:active", true);
    }
  });
}

//主名確認フォーム
function nova_setup_page_2(player, owner) {
  const form = new ui.ActionFormData();
  form.body(`§a${owner.name} で本当によろしいですか?`);
  form.button("§aはい §b/§a yes");
  form.button("§aいいえ §b/§a no");
  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        setdp("nova:owner", owner.name);
        player.sendMessage("§aワールド主の設定が完了しました。");
        server.system.runTimeout(() => {
          nova_setup_page_end(player);
        }, 20);
      case 1:
        if (response.selection == 1) {
          player.sendMessage("§a再設定を行います。");
          server.system.runTimeout(() => {
            nova_setup_page_1(player);
          }, 20);
          break;
        }
    }
  });
}

//主名入力フォーム
function nova_setup_page_1(player) {
  const form = new ui.ModalFormData();
  form.textField(
    "§a主の名前を入力 / enter ownername",
    `yourname is ${player.name}`
  );

  form.show(player).then((response) => {
    if (response.canceled) {
      return;
    }
    let owner = String(response.formValues[0]);
    owner = getPlayerByName(owner);
    if (owner === undefined) {
      player.sendMessage("§aプレイヤーが見つかりませんでした。 再度開きます");
      server.system.runTimeout(() => {
        nova_setup_page_1(player);
      }, 40);
    } else {
      nova_setup_page_2(player, owner);
    }
  });
}

//アクティブundefinedエラー回避
server.system.runInterval(() => {
  if (getdp("nova:active") == undefined) {
    setdp("nova:active", false);
  }
});

//セットアップページを開くscriptEventReceive
server.system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id == "nova:setup_page") {
    if (ev.sourceType == "Entity") {
      let player = ev.sourceEntity;
      if (getdp("nova:active")) {
        player.sendMessage("§aNovaDefender is actived.");
      } else {
        nova_setup_page_home(player);
      }
    } else if (ev.sourceType == "Block") {
      return;
    }
  }
});

//operator権限付与通知システム１
server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (
      player.getDynamicProperty("nova:operator") == false ||
      player.getDynamicProperty("nova:operator") == undefined
    ) {
      player.setDynamicProperty("nova:operatorsend", false);
    }
  });
});

//operator権限付与通知システム2
server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (
      player.getDynamicProperty("nova:operator") == true &&
      player.getDynamicProperty("nova:operator") !== undefined
    ) {
      if (
        player.getDynamicProperty("nova:operatorsend") == false ||
        player.getDynamicProperty("nova:operatorsend") == undefined
      ) {
        player.sendMessage(
          "§aoperator権限が付与されました。 help でコマンド一覧を表示します。 コマンド頭文字は" +
            getdp("nova:command_firsts") +
            "です"
        );
        player.setDynamicProperty("nova:operatorsend", true);
      }
    }
  });
});

//セットアップシステム
// server.world.afterEvents.playerSpawn.subscribe((ev) => {
//   if (ev.initialSpawn) {
//     if (joincount === 0) {
//       ev.source.sendMessage(
//         `[§a§lNovaDefender ${v}] NovaDefenderのセットアップを行います。 初めてに §e/function nova/start §rを実行してくだい。`
//       );
//     }
//     joincount++;
//   }
// });

//保留 | 連続チャット禁止システム
{
  // const messageHistory = new Map(); // プレイヤーごとのメッセージ履歴を保存
  // server.world.beforeEvents.chatSend.subscribe((event) => {
  //   const player = event.sender;
  //   const playerId = player.id; // プレイヤーのIDを取得
  //   const message = event.message;
  //   if (!messageHistory.has(playerId)) {
  //     messageHistory.set(playerId, { lastMessage: message, count: 1 });
  //   } else {
  //     const data = messageHistory.get(playerId);
  //     if (data.lastMessage === message) {
  //       data.count++;
  //     } else {
  //       data.lastMessage = message;
  //       data.count = 1;
  //     }
  //     if (data.count >= 10) {
  //       player.sendMessage(
  //         "§c警告: 同じメッセージを10回以上送信しないでください！"
  //       );
  //     }
  //   }
  // });
}

server.system.runInterval(() => {
  if (getdp("nova:fly_data_view_speed") === undefined) {
    setdp("nova:fly_data_view_speed", 40);
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";admin getop" && ev.sender.name == admin) {
    ev.cancel = true;
    ev.sender.setDynamicProperty("nova:operator", true);
    ev.sender.sendMessage(
      `[§a§lNovaDefender§r] §e管理者権限を有効にしました。`
    );
  }
});

function speed_viewer(player, speed, players) {
  const form = new ui.ActionFormData();

  form.title("§a§lNovaDefender data viewer");
  form.body(
    `\n§aNovaDefender SpeedUp DataViewer Notfication System§r\n\n\nPlayer: ${
      players.name
    }\nSpeed: ${speed}b/s\n\n§a通知スピード §e${getdp(
      "nova:fly_data_view_speed"
    )}b/s §aを超えたため通知しました。`
  );

  form.button("§akick");
  form.button("§aspeedclear");
  form.button("§adone");

  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        player.sendMessage(`[§a§lNovaDefender§r] §akickしました。`);
        command(
          `kick ${players.name} "§lKicked By NovaDefender AntiCheat\n\nkick reason: ${player.name}'s speed viewer\nspeed: ${speed}"`
        );
        break;
      case 1:
        command(`execute as ${players.name} at @s run tp @s @s`);
        player.sendMessage(`[§a§lNovaDefender§r] §aspeedclearに成功しました`);
        break;
      case 2:
        player.sendMessage(`[§a§lNovaDefender§r] §a終了します。`);
        break;
    }
  });
}

//flyhack検知関数
function measureHorizontalSpeed(player) {
  if (
    player.getDynamicProperty("nova:operator") == true &&
    player.getDynamicProperty("nova:operator") !== undefined
  )
    return;
  // 現在の速度を取得（ブロック/ティック単位）
  const velocity = player.getVelocity();

  // 水平速度（XとZのみ）を計算（Yを無視）
  const horizontalSpeed = Math.sqrt(
    velocity.x * velocity.x + velocity.z * velocity.z
  );
  const speedPerSecond = horizontalSpeed * 20; // 20tick = 1秒に変換
  let speed = speedPerSecond.toFixed(2);
  if (speed > Number(getdp("nova:fly_data_view_speed"))) {
    server.world.getPlayers().forEach((players) => {
      if (players.getDynamicProperty("nova:data_view") == true) {
        speed_viewer(players, speed, player);
      }
    });
  }
  if (speed > Number(getdp("nova:maxspeed"))) {
    if (getdp("nova:speedprocessing") == 0) {
      return;
    } else if (getdp("nova:speedprocessing") == 1) {
      if (getdp("nova:fly_tpback") == true) {
        pltp(
          player,
          player.location.x,
          player.location.y,
          player.location.z,
          player.dimension
        );
      }
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §e${getdp(
          "nova:maxspeed"
        )}b/s §p以上のスピードを検知しました。\n§7 - ${
          player.name
        } \n§7 - ${speed}b/s`
      );
    } else if (getdp("nova:speedprocessing") == 2) {
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §e${getdp(
          "nova:maxspeed"
        )}b/s §p以上のスピードを検知しました。\n§7 - player \n§7 - ${speed}b/s`
      );
      command(
        `kick ${player.name} §lkicked By NovaDefender\n\n§e${getdp(
          "nova:maxspeed"
        )}b/s §p以上のスピードを検知しました。\n§7 - player \n§7 - ${speed}b/s`
      );
      server.world.getPlayers().forEach((players) => {
        if (
          players.getDynamicProperty("nova:operator") == true &&
          players.getDynamicProperty("nova:operator") !== undefined
        ) {
          players.sendMessage(
            `[§a§lNovaDefender§r] ${player.name} を スピード制限でkickしました。 (${speed}b/s)`
          );
        } else {
          return;
        }
      });
    } else if (getdp("nova:speedprocessing") == 3) {
      action.opnotfi("BAN機能は開発中です。 現在使うことができません。");
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §e${getdp(
          "nova:maxspeed"
        )}b/s §p以上のスピードを検知しました。\n§7 - player \n§7 - ${speed}b/s`
      );
      // player.setDynamicProperty("nova:ban", true);
      // server.world.getPlayers().forEach((players) => {
      //   if (
      //     players.getDynamicProperty("nova:operator") == true &&
      //     players.getDynamicProperty("nova:operator") !== undefined
      //   ) {
      //     players.sendMessage(
      //       `[§a§lNovaDefender§r] ${player.name} を スピード制限でbanしました。 (${speed}b/s)`
      //     );
      //   } else {
      //     return;
      //   }
      // });
    }
  }
}

//undefind回避
server.system.runInterval(() => {
  if (getdp("nova:flyhack_activestate") === true) {
    server.world.getPlayers().forEach((player) => {
      measureHorizontalSpeed(player);
    });
  }
});

//禁止エンティティシステム
function deleteNoentity(id) {
  const dimensions = [
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end",
  ];

  for (const dim of dimensions) {
    const entities = server.world.getDimension(dim).getEntities();

    for (const entity of entities) {
      if (entity.typeId === `${id}`) {
        const { x, y, z } = entity.location;
        const roundedX = Math.round(x);
        const roundedY = Math.round(y);
        const roundedZ = Math.round(z);
        entity.teleport({ x: 0, y: -100, z: 0 });
        entity.kill();

        server.world.sendMessage(
          `[§a§lNovaDefender§r] 禁止エンティティをkillしました。 \n  §m${id} §p(${roundedX}, ${roundedY} ${roundedZ} ${dim})`
        );
      }
    }
  }
}

server.system.beforeEvents.startup.subscribe((ev) => {
  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:tps",
      description: "TPSを確認します。",
      permissionLevel: server.CommandPermissionLevel.Any,
      mandatoryParameters: [],
      optionalParameters: [],
    },
    (origin, arg) => {
      origin.sourceEntity.sendMessage(`§pworld TPS: ${getTPS()}`);
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:discord",
      description: "公式ディスコードサーバーのURLを確認します",
      permissionLevel: server.CommandPermissionLevel.Any,
      mandatoryParameters: [],
      optionalParameters: [],
    },
    (origin, arg) => {
      origin.sourceEntity.sendMessage(
        `§e-- §a§lNovaDefender AntiCheat for minecraft-bedrock §e--\n\ndiscord server: ${official_support_server}`
      );
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:site",
      description: "NovaDefenderに関連するサイトのURLを確認します",
      permissionLevel: server.CommandPermissionLevel.Any,
      mandatoryParameters: [],
      optionalParameters: [],
    },
    (origin, arg) => {
      origin.sourceEntity.sendMessage(
        `§e-- §a§lNovaDefender AntiCheat for minecraft-bedrock §e--\n\ndiscord server: ${official_support_server}\n§edeveloper about: http://about.creeper.developers.f5.si\nofficial homepage: https://novadefender.anticheat.f5.si`
      );
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:setting",
      description: "設定フォームを開きます。",
      permissionLevel: server.CommandPermissionLevel.Admin,
      mandatoryParameters: [],
      optionalParameters: [],
    },
    (origin, arg) => {
      server.system.runTimeout(() => {
        if (getop(origin.sourceEntity)) {
          nova_hub(origin.sourceEntity);
        } else {
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e権限が存在しません`
          );
        }
      }, 5);
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:item",
      description: "設定フォームを開くアイテムを取得します。",
      permissionLevel: server.CommandPermissionLevel.Admin,
      mandatoryParameters: [],
      optionalParameters: [],
    },
    (origin, arg) => {
      server.system.runTimeout(() => {
        if (getop(origin.sourceEntity)) {
          origin.sourceEntity.setDynamicProperty("nova:givepanel", true);
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §aresponse completed.`
          );
        } else {
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e権限が存在しません`
          );
        }
      }, 5);
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:op",
      description: "オペレーター権限を付与します。",
      permissionLevel: server.CommandPermissionLevel.Admin,
      mandatoryParameters: [
        { name: "player", type: server.CustomCommandParamType.String },
      ],
      optionalParameters: [],
    },
    (origin, ...arg) => {
      server.system.runTimeout(() => {
        if (getop(origin.sourceEntity)) {
          let type = getPlayerByName(arg[0]);
          type.setDynamicProperty("nova:operator", true);
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e${arg[0]} §aにオペレーター権限を付与しました。`
          );
        } else {
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e権限が存在しません`
          );
        }
      }, 5);
    }
  );

  ev.customCommandRegistry.registerCommand(
    {
      name: "novadefender:deop",
      description: "オペレーター権限を剝奪します。",
      permissionLevel: server.CommandPermissionLevel.Admin,
      mandatoryParameters: [
        { name: "player", type: server.CustomCommandParamType.String },
      ],
      optionalParameters: [],
    },
    (origin, ...arg) => {
      server.system.runTimeout(() => {
        if (getop(origin.sourceEntity)) {
          let type = getPlayerByName(arg[0]);
          type.setDynamicProperty("nova:operator", false);
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e${arg[0]} §aからオペレーター権限を剝奪しました。`
          );
        } else {
          origin.sourceEntity.sendMessage(
            `[§a§lNovaDefender§r] §e権限が存在しません`
          );
        }
      }, 5);
    }
  );
});

server.system.runInterval(() => {
  if (blacklist.indexOf(getdp("nova:owner")) != -1) {
    let player = getPlayerByName(getdp("nova:owner"));
    if (getop(player)) {
      server.world.setDynamicProperty("nova:owner");
      player.setDynamicProperty("nova:operator", false);
      player.sendMessage(
        "[§aNovaDefender§r] §e " +
          player.name +
          "§a あなたはブラックリストに登録されているためNovaDefenderを利用できません。"
      );
    } else {
      return;
    }
  } else {
    return;
  }
});

//禁止エンティティ取得
function getNoentity() {
  let Noentity = JSON.parse(getdp("nova:noentity"));
  let entityList = [];
  Noentity.forEach((id) => {
    entityList.push(id);
  });
  return entityList;
}

//禁止エンティティ削除
function Noentityremove(player) {
  const form = new ui.ModalFormData();
  form.dropdown("§l削除する禁止エンティティを選択", getNoentity());
  form
    .show(player)
    .then((response) => {
      if (response.canceled) Noentitysetting(player);

      let Noentity = JSON.parse(getdp("nova:noentity"));
      for (let i = 0; i < Noentity.length; i++) {
        if (response.formValues[0] == i) {
          let Noremoveid = Noentity[i];
          Noentity.splice(Number(response.formValues[0]), 1);
          let resultNoentity = Noentity;
          let resultNoentityJson = JSON.stringify(resultNoentity);
          setdp("nova:noentity", resultNoentityJson);
          player.sendMessage(
            `[§a§lNovaDefender§r] §l${Noremoveid}を禁止エンティティから削除しました`
          );
          server.system.runTimeout(() => {
            Noentitysetting(player);
          }, 10);
        }
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//禁止アイテム（エンティティ状態）削除
function deleteNoitem(id) {
  const dimensions = [
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end",
  ];

  for (const dim of dimensions) {
    const entities = server.world.getDimension(dim).getEntities();

    for (const entity of entities) {
      if (
        entity.typeId === "minecraft:item" &&
        entity.getComponent("minecraft:item").itemStack.typeId === `${id}`
      ) {
        const { x, y, z } = entity.location;
        const roundedX = Math.round(x);
        const roundedY = Math.round(y);
        const roundedZ = Math.round(z);

        entity.kill();

        server.world.sendMessage(
          `[§a§lNovaDefender§r] 禁止エンティティをkillしました。 \n  §m${id} (item) §p(${roundedX}, ${roundedY} ${roundedZ} ${dim})`
        );
      }
    }
  }
}

//禁止エンティティ追加
function Noentitysetting_form(player) {
  const form = new ui.ModalFormData();
  form.textField("§lエンティティidを入力してください", "例 : tnt");
  form.show(player).then((response) => {
    if (response.canceled) Noentitysetting(player);

    if (response.formValues[0] === "") {
      player.sendMessage("§7空白のためキャンセルされました");
      return;
    }
    let Noentity = JSON.parse(getdp("nova:noentity"));
    Noentity.push(String(`minecraft:${response.formValues[0]}`));
    setdp("nova:noentity", JSON.stringify(Noentity));
    player.sendMessage(
      "[§lNovaDefender§r] §l" +
        String(response.formValues[0]) +
        "を禁止エンティティに追加しました。"
    );
    server.system.runTimeout(() => {
      Noentitysetting(player);
    }, 10);
  });
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}discord`) {
    ev.cancel = true;
    if (getop(ev.sender) == true) {
      ev.sender.sendMessage(
        `§a--- NovaDefender AntiCheat ${v} discord ---\n - ${official_support_server}`
      );
    } else {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

// server.world.beforeEvents.chatSend.subscribe((ev) => {
//   if (ev.message.startsWith(";tp ") == true) {
//     if (getop(ev.sender) == true) {
//       let player = ev.sender;
//       let args = ev.message.split(",");
//       let args2 = ev.message.split(" ");
//       if (args[2] == "player") {
//         if (getPlayerByName(args[1]) == undefined) {
//           player.sendMessage(
//             `[§a§lNovaDefender§r] §ccommand error: ${args[1]} というプレイヤーは見つかりませんでした。 §r(§7player is undefined§r)`
//           );
//         }
//         command(`tp ${ev.sender.name} ${args[1]}`);
//         player.sendMessage(
//           `[§a§lNovaDefender§r] §acommand complete: ${args[1]} にテレポートしました。`
//         );
//       } else {
//         let x = args[0];
//         let y = args[1];
//         let z = args[2];
//         if (!args[3] == "" || !args[3] == undefined) {
//           command(`tp ${ev.sender.name} ${x} ${y} ${z}`);
//           player.sendMessage(
//             `[§a§lNovaDefender§r] §acommand complete: ${ev.sender.dimension.id} の ${x} ${y} ${z} に テレポートしました。`
//           );
//         } else {
//           command(
//             `execute in ${args[3]} run tp ${ev.sender.name} ${x} ${y} ${z}`
//           );
//           player.sendMessage(
//             `[§a§lNovaDefender§r] §acommand complete: minecraft:${args2[3]} の ${x} ${y} ${z} に テレポートしました。`
//           );
//         }
//       }
//     }
//   }
// });

//禁止エンティティ設定画面テレポーター
async function Noentitysetting(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button("§l追加 / Add.", "textures/ui/color_plus");
  form.button("§l削除 / Delete.", "textures/ui/icon_trash");
  form.button("§l戻る / return.", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      player.setDynamicProperty("setting_open", false);
      switch (response.selection) {
        case 0:
          Noentitysetting_form(player);
          break;
        case 1:
          Noentityremove(player);
          break;
        case 2:
          if (response.selection == 2) setting(player);
          break;
        default:
          setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

//undefined回避
server.system.runInterval(() => {
  if (getdp("nova:noentity") === undefined) {
    setdp("nova:noentity", JSON.stringify(["tnt"]));
  }
});

//禁止エンティティ捜索
server.system.runInterval(() => {
  let Noentity = JSON.parse(getdp("nova:noentity"));
  Noentity.forEach((id) => {
    deleteNoentity(`${id}`);
  });
});

//禁止アイテム（エンティティ状態）捜索
server.system.runInterval(() => {
  let Noitem = JSON.parse(getdp("nova:noitem"));
  Noitem.forEach((id) => {
    deleteNoitem(`${id}`);
  });
});

//helpコマンド
server.world.beforeEvents.chatSend.subscribe((ev) => {
  let player = ev.sender;
  if (ev.message.startsWith(`${getdp("nova:command_firsts")}help`)) {
    ev.cancel = true;

    if (player.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    if (player.getDynamicProperty("nova:operator") == true) {
      if (ev.message == `${getdp("nova:command_firsts")}help`) {
        player.sendMessage(
          `§a--- NovaDefender AntiCheat ---\n§aコマンド頭文字: ${getdp(
            "nova:command_firsts"
          )}\n§cCommand:`
        );
        for (let command in command_list) {
          let commanddisp = command_list[command];
          player.sendMessage(
            `  §r§b-§r §v${command} §r§b==§r ${String(
              commanddisp["disp"]
            )} §r(§ppermission :${String(commanddisp["permission"])}§r)`
          );
        }
        player.sendMessage(
          `\n\n§sSupport Discord Servers: ${official_support_server}`
        );
      } else if (
        ev.message.startsWith(`${getdp("nova:command_firsts")}help `)
      ) {
        let args = ev.message.split(" ");
        let commanddisp = command_list[`${args[1]}`];
        if (commanddisp == undefined) {
          player.sendMessage(
            `[§a§lNovaDefender§r] §ccommand error: コマンドが存在しません。 §r(§7command: ${args[1]} is undefined)`
          );
        } else {
          player.sendMessage(
            `§n${args[1]}: §r${String(
              commanddisp["disp"]
            )} §r(§ppermission: ${String(
              commanddisp["permission"]
            )}§r)\n§ssyntax: \n§r -${commanddisp["syntax"]}`
          );
        }
      }
    } else if (player.getDynamicProperty("nova:operator") == false) {
      if (ev.message == `${getdp("nova:command_firsts")}help`) {
        player.sendMessage(
          `§a--- NovaDefender AntiCheat ---\n§pメンバーコマンドリスト§r\n§aコマンド頭文字: ${getdp(
            "nova:command_firsts"
          )}\n§cCommand:`
        );
        for (let command in command_list) {
          let commanddisp = command_list[command];
          if (commanddisp["permission"] == "operator") return;

          player.sendMessage(
            `  §r§b-§r §v${command} §r§b==§r ${String(
              commanddisp["disp"]
            )} §r(§ppermission :${String(commanddisp["permission"])}§r)`
          );
        }
        player.sendMessage(
          `\n\n§sSupport Discord Servers: ${official_support_server}`
        );
      } else if (
        ev.message.startsWith(`${getdp("nova:command_firsts")}help `)
      ) {
        let args = ev.message.split(" ");
        let commanddisp = command_list[`${args[1]}`];
        if (commanddisp == undefined) {
          player.sendMessage(
            `[§a§lNovaDefender§r] §ccommand error: コマンドが存在しません。 §r(§7command: ${args[1]} is undefined)`
          );
        } else {
          player.sendMessage(
            `§n${args[1]}: §r${String(
              commanddisp["disp"]
            )} §r(§ppermission: ${String(
              commanddisp["permission"]
            )}§r)\n§ssyntax: \n§r -${commanddisp["syntax"]}`
          );
        }
      }
    }
  }
});

const cooldowns = new Map();

//undefined回避
server.system.runInterval(() => {
  if (getdp("nova:cpsmax") === undefined) {
    setdp("nova:cpsmax", 15);
  }
});

//respawnsystem | minecraft:command_block_minecart
// server.system.runInterval(() => {
//   for (const dimension of ["overworld", "nether", "the_end"]) {
//     const entities = server.world.getDimension(dimension).getEntities();

//     for (const entity of entities) {
//       if (
//         entity.typeId === "minecraft:command_block_minecart" &&
//         entity.hasTag("nova:respawn_complete") == false
//       ) {
//         let x = entity.location.x;
//         let y = entity.location.y + 1;
//         let z = entity.location.z;
//         entity.teleport({ x: x, y: -100, z: z });
//         const newNpc = server.world
//           .getDimension(dimension)
//           .spawnEntity("minecraft:command_block_minecart", { x, y, z });
//         newNpc.addTag("nova:respawn_complete");
//       }
//     }
//   }
// });

//undefined回避
server.system.runInterval(() => {
  if (getdp("nova:noitem") === undefined)
    setdp(
      "nova:noitem",
      JSON.stringify([
        "minecraft:tnt",
        "minecraft:moving_block",
        "minecraft:end_crystal",
        "minecraft:ender_pearl",
        "minecraft:respawn_anchor",
      ])
    );
});

//禁止アイテム削除
function Noitemdel(player, item) {
  if (getper(player) == true) return;

  const inventoryComp = player.getComponent("minecraft:inventory");
  const container = inventoryComp.container;

  for (let slot = 0; slot < container.size; slot++) {
    const itemStack = container.getItem(slot);

    // if (itemStack !== undefined) {
    //   amount = itemStack.amount;
    // }
    if (itemStack && itemStack.typeId === `${item}`) {
      let bucketSlot = slot;
      container.setItem(bucketSlot, null);
      server.world.sendMessage(
        `[§a§lNovaDefender§r] 禁止アイテムの所持を検知しました。\n§7 - ${player.name}\n - ${item}`
      );
    }
  }
}

//禁止アイテム捜索
server.system.runInterval(() => {
  let Noitem = JSON.parse(getdp("nova:noitem"));
  server.world.getPlayers().forEach((player) => {
    Noitem.forEach((item) => {
      Noitemdel(player, item);
    });
  });
});

//NBTリセット関数
function itemNBTclear(player, item) {
  if (getop(player) == true) {
    return;
  }
  const inventoryComp = player.getComponent("minecraft:inventory");
  let amount = 0;
  const container = inventoryComp.container;

  for (let slot = 0; slot < container.size; slot++) {
    const itemStack = container.getItem(slot);

    if (itemStack !== undefined) {
      amount = itemStack.amount;
    }
    if (itemStack && itemStack.typeId === `minecraft:${item}`) {
      const lore = itemStack.getLore();
      if (lore.includes("§2NovaDefeder: ItemNBTclear processed.")) continue;
      let bucketSlot = slot;
      container.setItem(bucketSlot, null);

      const newItem = new server.ItemStack(`minecraft:${item}`, amount);
      newItem.setLore(["§2NovaDefeder: ItemNBTclear processed."]);
      container.setItem(bucketSlot, newItem);
    }
  }
}

//MBT削除システム
server.system.runInterval(() => {
  //削除リスト
  let NBTclearitemlist = [
    "axolotl_bucket",
    "beehive",
    "bee_nest",
    "cod_bucket",
    "salmon_bucket",
    "pufferfish_bucket",
    "tropical_fish_bucket",
    "tadpole_bucket",
    "chest",
    "dispenser",
    "trapped_chest",
    "hopper",
    "barrel",
    "movingblock",
    "dropper",
    "MovingBlock",
    "moving_block",
    "command_block_minecart",
  ];

  NBTclearitemlist.forEach((item) => {
    server.world.getPlayers().forEach((player) => {
      itemNBTclear(player, item);
    });
  });
});

//respawnsystem | npc
// server.system.runInterval(() => {
//   for (const dimension of ["overworld", "nether", "the_end"]) {
//     const entities = server.world.getDimension(dimension).getEntities();

//     for (const entity of entities) {
//       if (
//         entity.typeId === "minecraft:npc" &&
//         entity.hasTag("nova:respawn_complete") == false
//       ) {
//         const { x, y, z } = entity.location;
//         entity.teleport({ x: x, y: -100, z: z });
//         // console.log("test");
//         const newNpc = server.world
//           .getDimension(dimension)
//           .spawnEntity("minecraft:npc", { x, y, z });
//         newNpc.addTag("nova:respawn_complete");
//       }
//     }
//   }
// });

//maxspeed設定
function setmaxspeed(player) {
  const form = new ui.ModalFormData();
  form.textField("§l最大スピードを入力", " ");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        fly_hack_setting(player);
        return;
      }
      setdp("nova:maxspeed", String(response.formValues[0]));
      player.sendMessage(
        `[§a§lNovaDefender§r] §l最大スピードを §r§e${String(
          response.formValues[0]
        )} §r§lに変更しました`
      );
      fly_hack_setting(player);
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//kanzan

function setmaxnotfispeed(player) {
  const form = new ui.ModalFormData();
  form.textField("§l最大通知スピードを入力", " ");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        fly_hack_setting(player);
        return;
      }
      setdp("nova:fly_data_view_speed", String(response.formValues[0]));
      player.sendMessage(
        `[§a§lNovaDefender§r] §l最大通知スピードを §r§e${String(
          response.formValues[0]
        )} §r§lに変更しました`
      );
      fly_hack_setting(player);
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//undefined対策
server.system.runInterval(() => {
  if (getdp("nova:maxspeed") == undefined) {
    setdp("nova:maxspeed", 40);
  }
});

//killaura_processing_setting
function killaura_processing_setting(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button(`§lnone`);
  form.button(`§lnotification`);
  form.button(`§lkick`);
  form.button(`§lban`);
  form.button("§l戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          setdp("nova:cpsmax_processing", 0);
          killaura_setting(player);
          break;
        case 1:
          setdp("nova:cpsmax_processing", 1);
          killaura_setting(player);

          break;
        case 2:
          setdp("nova:cpsmax_processing", 2);
          killaura_setting(player);

          break;
        case 3:
          setdp("nova:cpsmax_processing", 3);
          killaura_setting(player);

          break;
        case 4:
          killaura_setting(player);

          break;
        default:
          killaura_setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

//reach_setting
function reach_setting(player) {
  const form = new ui.ModalFormData();
  form.textField(
    "§lリーチを入力してください",
    " ",
    String(getdp("nova:maxattack_distance"))
  );
  form
    .show(player)
    .then((response) => {
      if (response.cancel) {
        killaura_setting(player);
        return;
      }
      if (response.formValues[0] === "" || response.formValues[0] === " ") {
        killaura_setting(player);
      } else {
        setdp("nova:maxattack_distance", response.formValues[0]);
        player.sendMessage("[§lNovaDefender§r] 設定が完了しました");
        killaura_setting(player);
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//killaura_setting
function killaura_setting(player) {
  let processing = 0;
  if (getdp("nova:cpsmax_processing") == 0) {
    processing = "none";
  } else if (getdp("nova:cpsmax_processing") == 1) {
    processing = "notification";
  } else if (getdp("nova:cpsmax_processing") == 2) {
    processing = "kick";
  } else if (getdp("nova:cpsmax_processing") == 3) {
    processing = "ban";
  }
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(
    "§a§l--- NovaDefender AntiCheat ---\n\n§r Killaura Setting (Setting User Interface)\n\n"
  );
  form.button(`status\n§7${getdp("nova:killaura_status")}`);
  form.button(`maxcps\n§r§7${getdp("nova:cpsmax")}cps`); //0
  form.button(`processing\n§r§7${processing}`); //1
  form.button(`maxreach\n§7${getdp("nova:maxattack_distance")}`); //2
  form.button("§l戻る / return", "textures/ui/realms_red_x"); //3
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          setdp("nova:killaura_status", !getdp("nova:killaura_status"));
          killaura_setting(player);
          break;
        case 1:
          cps_setting(player);
          break;
        case 2:
          killaura_processing_setting(player);
          break;
        case 3:
          reach_setting(player);
          break;
        case 4:
          setting(player);
          break;
        default:
          setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

//保留 | maxchatL_setting
function maxchatL_setting(player) {
  const form = new ui.ModalFormData();
  form.textField("§l最大文字数を入力してください");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }
      setdp("nova:cpsmax", response.formValues[0]);
      player.sendMessage("[§lNovaDefender§r] 設定が完了しました");
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//チャット文字数制限
server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (
    ev.sender.getDynamicProperty("nova:operator") !== undefined &&
    ev.sender.getDynamicProperty("nova:operator") == true
  ) {
    return;
  }
  const player = ev.sender;
  let maxchatL = 50;
  if (ev.message.length > maxchatL) {
    player.sendMessage(
      `§7[Chat] チャットの文字数が多すぎます。(${ev.message.length}chars)`
    );
    ev.cancel = true;
    return;
  }
  // クールタイムの確認
  const lastChatTime = cooldowns.get(player.name) || 0;
  const currentTime = Date.now();
  const timeLeft = ((1000 - (currentTime - lastChatTime)) / 1000).toFixed(1); // 残り秒数を計算

  if (currentTime - lastChatTime < 1000) {
    ev.cancel = true; // メッセージをキャンセル
    player.sendMessage(
      `[§a§lNovaDefender§r] §vチャットの送信間隔が早すぎます。§e${timeLeft}§v 秒待って下さい。`
    );
    return;
  }

  // クールタイムを更新
  cooldowns.set(player.name, currentTime);
});

//deopコマンド
server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(`${getdp("nova:command_firsts")}deop`)) {
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") ||
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a2§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    let player = ev.sender;
    const args = ev.message.split(`${getdp("nova:command_firsts")}deop `);
    let playername = args[1];
    if (playername === undefined) playername = ev.sender.name;
    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cというプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }
    let targetplayer = getPlayerByName(playername);
    if (!targetplayer.getDynamicProperty("nova:operator")) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cには既に権限が存在しません。§r(§7player is permission undefined§r)`
      );
    } else {
      targetplayer.setDynamicProperty("nova:operator", false);
      player.sendMessage(
        `[§a§lNovaDefender§r] §2command completed: 権限を奪略しました。 §r(§7response completed.§r)`
      );
    }
  }
});

//作成中 | banコマンド
server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(";ban")) {
    let banlist = getdp("nova:banlist");
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") ||
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    let player = ev.sender;
    const args = ev.message.split(" ");
    let playername = args[1];
    if (playername === undefined) playername = ev.sender.name;
    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error §e${playername}§r §cというプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }
    let targetplayer = getPlayerByName(playername);
    banlist.push(targetplayer.name);
    player.sendMessage(
      `[§a§lNovaDefender] §2command completed: §e${playername}§r §2をbanしました。 §r(§7response completed.§r)`
    );
  }
});

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:mute") === undefined) {
      player.setDynamicProperty("nova:mute", false);
    }
  });
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(`${getdp("nova:command_firsts")}mute`)) {
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") &&
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }

    let player = ev.sender;
    const args = ev.message.split(`${getdp("nova:command_firsts")}mute `);
    let playername = args[1];
    let targetplayer = getPlayerByName(playername);
    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cというプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }

    let status = Boolean(targetplayer.getDynamicProperty("nova:mute"));

    targetplayer.setDynamicProperty("nova:mute", !status);
    if (!status == true) {
      targetplayer.sendMessage("[§a§lNovaDefender§r] §aミュートされました。");
      player.sendMessage("[§a§lNovaDefender§r] §aミュートをONにしました。");
      server.system.runTimeout(() => {
        command(`ability "${targetplayer.name}" mute ${String(!status)}`);
      }, 20);
    } else {
      player.sendMessage("[§a§lNovaDefender§r] §aミュートが解除されました。");
      targetplayer.sendMessage(
        "[§a§lNovaDefender§r] §aミュートを解除しました。"
      );
      server.system.runTimeout(() => {
        command(`ability "${targetplayer.name}" mute ${String(!status)}`);
      }, 20);
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(`${getdp("nova:command_firsts")}op`)) {
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") ||
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    let player = ev.sender;
    const args = ev.message.split(`${getdp("nova:command_firsts")}op `);
    let playername = args[1];
    if (playername === undefined) playername = ev.sender.name;
    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cというプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }
    let targetplayer = getPlayerByName(playername);
    if (targetplayer.getDynamicProperty("nova:operator")) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cには既に権限が存在します。§r(§7player is permission undefined§r)`
      );
    } else {
      targetplayer.setDynamicProperty("nova:operator", true);
      player.sendMessage(
        `[§a§lNovaDefender] §2command completed: ${playername} に権限を付与しました。 §r(§7response completed.§r)`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(`${getdp("nova:command_firsts")}data`)) {
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") ||
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    let player = ev.sender;
    const args = ev.message.split(`${getdp("nova:command_firsts")}data `);
    let playername = args[1];
    if (playername === undefined) playername = ev.sender.name;

    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: ${playername} というプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }
    let players = getPlayerByName(playername);
    let permission = "";
    if (
      players.getDynamicProperty("nova:operator") == true ||
      players.getDynamicProperty("nova:operator") !== undefined
    ) {
      permission = "§r§aOP";
    } else {
      permission = "§r§emember";
    }
    player.sendMessage(
      `--- §a${playername}'data ---\n§7Name: §r${playername}\n§7Permission: §r${permission}\n§7location: §r${Math.floor(
        players.location.x
      )} ${Math.floor(players.location.y)} ${Math.floor(
        players.location.z
      )}\n§7Dimension: §r${players.dimension.id}\n§7Health: §r${Math.floor(
        players.getComponent("minecraft:health").currentValue
      )} / ${
        players.getComponent("minecraft:health").effectiveMax
      }\n§7Gamemode: §r${players.getGameMode()}\n§7CPS: ${get_cps(
        player
      )}\n§7Platform: §r${players.clientSystemInfo.platformType} (${
        players.inputInfo.lastInputModeUsed
      })\nafk: §r${getsleep(players)}`
    );
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";viewer.set on") {
    ev.cancel = true;
    if (!getop(ev.sender)) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    } else {
      let player = ev.sender;
      player.setDynamicProperty("nova:data_view", true);
      player.sendMessage(
        `[§a§lNovaDefender§r] §acommand complete: データ表示をONにしました。`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";viewer.set off") {
    ev.cancel = true;
    if (!getop(ev.sender)) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    } else {
      let player = ev.sender;
      player.setDynamicProperty("nova:data_view", false);
      player.sendMessage(
        `[§a§lNovaDefender§r] §acommand complete: データ表示をOFFにしました。`
      );
    }
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(";kick")) {
    ev.cancel = true;
    if (
      !ev.sender.getDynamicProperty("nova:operator") ||
      ev.sender.getDynamicProperty("nova:operator") === undefined
    ) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    let player = ev.sender;
    const args = ev.message.split(";kick ");
    let playername = args[1];
    if (playername === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: プレイヤー名を入力してください。 §r(§7playername is not input.§r)`
      );
      return;
    }
    if (getPlayerByName(playername) === undefined) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: §e${playername}§r §cというプレイヤーは存在しませんでした §r(§7player is undefined§r)`
      );
      return;
    }
    if (playername === ev.sender.name) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 自分をkickすることはできません §r(§7my is nokick§r)`
      );
      return;
    }
    command(
      `kick ${playername} §lkicked by NovaDefender AntiCheat\n§r§cExecution Player: ${ev.sender.name}\n§r§cType: Kickcommand`
    );
    player.sendMessage(
      `[§a§lNovaDefender§r] §2command complete: ${playername} をkickしました。 §r(§7response completed.§r)`
    );
  }
});

// server.system.afterEvents.scriptEventReceive.subscribe((ev) => {
//   if (ev.id == "nova:time_reset") {
//     setdp(`nova:play_time ${getjpday()} ${ev.sourceEntity.name}`, 0);
//     setdp(`nova:play_all_time ${ev.sourceEntity.name}`, 0);
//     ev.sourceEntity.sendMessage(
//       `§7[NovaDefender] プレイ時間のリセットが完了しました。`
//     );
//   }
// });

function getdayplay_time(player, time) {
  return getdp(`nova:play_time ${time} ${player.name}`);
}

function getall_worldplay_time(player) {
  return getdp(`nova:play_all_time ${player.name}`);
}

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (getdp(`nova:play_time ${getjpday()} ${player.name}`) === undefined)
      setdp(`nova:play_time ${getjpday()} ${player.name}`, 0);

    let play_time = getdp(`nova:play_time ${getjpday()} ${player.name}`);
    play_time = play_time + 1;
    setdp(`nova:play_time ${getjpday()} ${player.name}`, play_time);
  });
}, 20);

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (getdp(`nova:play_all_time ${player.name}`) === undefined)
      setdp(`nova:play_all_time ${player.name}`, 0);

    let play_time = getdp(`nova:play_all_time ${player.name}`);
    play_time = play_time + 1;
    setdp(`nova:play_all_time ${player.name}`, play_time);
  });
}, 20);

server.system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id === "nova:setting") {
    nova_hub(ev.sourceEntity);
  }
});

function command_first_setting_2(player) {
  const form = new ui.ModalFormData();
  form.textField("入力", " ", getdp("nova:command_firsts"));

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        player.sendMessage("キャンセルされました");
        return;
      }
      let text = String(response.formValues[0]);
      if (text == "" || text == " ") {
        command_first_setting(player);
        return;
      } else {
        setdp("nova:command_firsts", text);
        command_first_setting(player);
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

async function command_first_setting(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`§a現在のコマンド頭文字:§r ${getdp("nova:command_firsts")}`);
  form.button("§l変更 / modification.", "textures/ui/icon_setting");
  form.button("§l戻る / return.", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      player.setDynamicProperty("setting_open", false);
      switch (response.selection) {
        case 0:
          command_first_setting_2(player);
          break;
        case 1:
          if (response.selection == 2) setting(player);
          break;
        default:
          setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

async function Noitemsetting(player) {
  let list = "";
  JSON.parse(getdp("nova:noitem")).forEach((item) => {
    list = list + ` §7- ${item}\n`;
  });
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`§a--- list ---\n\n${list}\n\n\n`);
  form.button("§l追加 / Add.", "textures/ui/color_plus");
  form.button("§l削除 / Delete.", "textures/ui/icon_trash");
  form.button("§l戻る / return.", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          Noitemsetting_form(player);
          break;
        case 1:
          Noitemremove(player);
          break;
        case 2:
          if (response.selection == 2) setting(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function noitemlist() {
  let noitem_list = [];
  JSON.parse(getdp("nova:noitem")).forEach((item) => {
    noitem_list.push(item);
  });
  return noitem_list;
}

function Noitemsetting_forms(player, item) {
  const form = new ui.ModalFormData();
  form.textField("§lidを入力してください", item);
  form.show(player).then((response) => {
    if (response.canceled) {
      return;
    }
    if (response.formValues[0] === "") {
      return;
    }
    let Noitem = JSON.parse(getdp("nova:noitem"));
    Noitem.push(String(`minecraft:${response.formValues[0]}`));
    setdp("nova:noitem", JSON.stringify(Noitem));
    player.sendMessage(
      "[§lNovaDefender§r] §l" +
        String(response.formValues[0]) +
        "を禁止アイテムに追加しました。"
    );
  });
}

function Noitemrep_select(player) {
  const form = new ui.ModalFormData();
  form.dropdown("§l変更するするアイテムを選択", noitemlist());
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      let Noitemtest = JSON.parse(getdp("nova:noitem"));
      for (let i = 0; i < Noitemtest.length; i++) {
        if (response.formValues[0] == i) {
          let Noitemremoveid = Noitemtest[i];
        }
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

function Noitemremove(player) {
  const form = new ui.ModalFormData();
  form.dropdown("§l削除するアイテムを選択", noitemlist());
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      let Noitemtest = JSON.parse(getdp("nova:noitem"));
      for (let i = 0; i < Noitemtest.length; i++) {
        if (response.formValues[0] == i) {
          let Noitemremoveid = Noitemtest[i];
          Noitemtest.splice(response.formValues[0], 1);
          let resultNoitem = Noitemtest;
          let resultNoitemJson = JSON.stringify(resultNoitem);
          setdp("nova:noitem", resultNoitemJson);
          player.sendMessage(
            `[§a§lNovaDefender§r] §a${Noitemremoveid}を禁止アイテムから削除しました`
          );
        }
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

function command(command) {
  let player = server.world.getPlayers()[0];

  if (player == undefined) {
    return;
  } else {
    server.system.run(() => {
      player.runCommand(command);
    });
  }
}

function setBlockToAir(x, y, z, dimensionId) {
  const dimension = server.world.getDimension(dimensionId);
  dimension.getBlock({ x: x, y: y, z: z }).setType("minecraft:air");
}

function Noitemsetting_form(player) {
  const form = new ui.ModalFormData();
  form.textField("§lアイテムidを入力してください", " ");
  form.show(player).then((response) => {
    if (response.canceled) {
      return;
    }
    if (response.formValues[0] === "") {
      player.sendMessage("§7空白のためキャンセルされました");
      return;
    }

    let Noitem = JSON.parse(getdp("nova:noitem"));
    if (Noitem.includes(String(response.formValues[0])) == true) {
      player.sendMessage(
        "[§a§lNovaDefender§r] §a" +
          String(response.formValues[0]) +
          "は既に禁止アイテムに登録されています。"
      );
    } else {
      Noitem.push(String(`${response.formValues[0]}`));
      setdp("nova:noitem", JSON.stringify(Noitem));
      player.sendMessage(
        "[§a§lNovaDefender§r] §a" +
          String(response.formValues[0]) +
          "を禁止アイテムに追加しました。"
      );
    }
  });
}

function getlogin_out(type, id) {
  if (type == "login") {
    let data = getdp(`nova:login ${id}`);
    let args = data.split(";");
    return args;
  } else {
    let data = getdp(`nova:logout ${id}`);
    let args = data.split(";");
    return args;
  }
}

function getPlayerByName(targetName) {
  return server.world.getPlayers({ name: targetName })[0];
}

server.world.beforeEvents.playerLeave.subscribe((ev) => {
  let player = getPlayerByName(ev.playerName);
  if (getdp("nova:logoutc") == undefined) setdp("nova:logoutc", 0);
  setdp(
    `nova:logout ${getdp("nova:logoutc")}`,
    `${player.name};${getjptime()};${Math.floor(
      player.location.x
    )} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)}`
  );
  setdp("nova:logoutc", getdp("nova:logoutc") + 1);
});

function getjpday() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jst = new Date(utc + 3600000 * 9); // JST = UTC + 9 hours

  const year = jst.getFullYear();
  const month = (jst.getMonth() + 1).toString().padStart(2, "0");
  const day = jst.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getjptime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jst = new Date(utc + 3600000 * 9); // JST = UTC + 9 hours

  const year = jst.getFullYear();
  const month = (jst.getMonth() + 1).toString().padStart(2, "0");
  const day = jst.getDate().toString().padStart(2, "0");
  const hours = jst.getHours().toString().padStart(2, "0");
  const minutes = jst.getMinutes().toString().padStart(2, "0");
  const seconds = jst.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}

function getdp(id) {
  try {
    return server.world.getDynamicProperty(id);
  } catch (err) {
    console.error("error");
  }
}

function setdp(id, name) {
  server.world.setDynamicProperty(id, name);
}

server.world.afterEvents.itemUse.subscribe((ev) => {
  let player = ev.source;
  if (ev.itemStack.nameTag == "[§a§lNovaDefender§r] パネルを開く") {
    if (player.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
    if (player.getDynamicProperty("nova:operator") == true) {
      nova_hub(player);
    } else if (player.getDynamicProperty("nova:operator") == false) {
      player.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

server.system.runInterval(() => {
  if (getdp("nova:login") == undefined)
    setdp("nova:login", JSON.stringify([""]));
});

server.system.runInterval(() => {
  if (getdp("nova:killaura_status") == undefined) {
    setdp("nova:killaura_status", true);
  }
});

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  if (ev.initialSpawn) {
    const player = ev.player;
    player.sendMessage(
      "§7このワールドにはNovaDefender AntiCheat " + v + "が導入されています"
    );
    if (
      player.getDynamicProperty("nova:mute") == true &&
      player.getDynamicProperty("nova:mute") !== undefined
    ) {
      player.sendMessage(
        "[§a§lNovaDefender§r] §aあなたはミュートされています。"
      );
      command(`ability "${player.name}" mute true`);
    }

    if (getdp(`nova:loginc`) == undefined) setdp(`nova:loginc`, 0);

    let loginc = getdp(`nova:loginc`);
    setdp(`nova:loginc`, loginc + 1);
    setdp(
      `nova:login ${loginc}`,
      `${player.name};${getjptime()};${Math.floor(
        player.location.x
      )} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)}`
    );
  }
});

function getlogout() {
  let item = [];
  for (let i = 0; i < getdp(`nova:logoutc`); i++) {
    item.push(getdp("nova:logout " + i));
  }
  return item;
}

function getlogin() {
  let item = [];
  for (let i = 0; i < getdp(`nova:loginc`); i++) {
    item.push(getdp(`nova:login ${i}`));
  }
  return item;
}

function logoutdata_view(player, id) {
  const data = getlogin_out("logout", id);
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`player: ${data[0]}\ntime: ${data[1]}\nlocation: ${data[2]}`);
  form.button("戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection == 0) {
        logout(player);
        return;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function logout(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  let logs = getlogout();
  logs.forEach((item_str) => {
    let args = item_str.split(";");
    form.button(`§r${args[0]} \n§7${args[1]}`);
  });
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        log(player);
        return;
      }
      let select = response.selection;
      logoutdata_view(player, select);
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function logindata_view(player, id) {
  const data = getlogin_out("login", id);
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`player: ${data[0]}\ntime: ${data[1]}\nlocation: ${data[2]}`);
  form.button("戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      if (response.selection == 0 || response.canceled) {
        login(player);
        return;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function login(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  getlogin(player).forEach((items) => {
    let item = items.split(";");

    form.button(`§r${item[0]} \n§7${item[1]}`);
  });
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        log(player);
        return;
      }

      const select = response.selection;
      logindata_view(player, select);
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function getAE() {
  const overworld = server.world.getDimension("overworld").getEntities().length;
  const nether = server.world.getDimension("nether").getEntities().length;
  const end = server.world.getDimension("the_end").getEntities().length;
  const result = overworld + nether + end;
  return result;
}

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  if (!ev.damagingEntity.typeId == "player") return;

  const { damagingEntity } = ev;
  damagingEntity.setDynamicProperty("nova:cps_c", get_cps(damagingEntity) + 1);
  damagingEntity.setDynamicProperty("nova:tick", true);
});

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  const { player } = ev;
  player.setDynamicProperty("nova:tick", false);
});

function get_cps(player) {
  return player.getDynamicProperty("nova:cps_c");
}

function get_tick(player) {
  return player.getDynamicProperty("nova:tick_c");
}

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  if (ev.initialSpawn == false) return;
  let player = ev.player;
  player.setDynamicProperty("nova:cps_c", 0);
  player.setDynamicProperty("nova:tick_c", 0);
});

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    try {
      get_cps(player);
    } catch {
      player.setDynamicProperty("nova:cps_c", 0);
    }

    try {
      get_tick(player);
    } catch {
      player.setDynamicProperty("nova:tick_c", 0);
    }

    if (player.getDynamicProperty("nova:tick") == true)
      player.setDynamicProperty("nova:tick_c", get_tick(player) + 1);
    const tickscore = get_tick(player);

    if (tickscore && tickscore >= 20) {
      player.setDynamicProperty("nova:tick_c", 0);
      player.setDynamicProperty("nova:tick", false);
      player.setDynamicProperty("nova:cps_c", 0);
    }
  });
});

function generate_player_list() {
  let player_list = [];
  for (const player of server.world.getAllPlayers()) {
    player_list.push(player.name);
  }
  return player_list;
}

server.system.runInterval(() => {
  if (getdp("nova:cpsmax_processing") === undefined)
    setdp("nova:cpsmax_processing", 1);
});

server.system.runInterval(() => {
  if (getdp("nova:maxattack_distance") == undefined) {
    setdp("nova:maxattack_distance", 6);
  }
});

const attackCooldown = new Map();
const attackCooldown2 = new Map();

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == "test") {
    ev.sender.sendMessage(ev.sender.id);
  }
});

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  let reach = getdp("nova:maxattack_distance");
  let player = ev.damagingEntity;
  if (
    player.getDynamicProperty("nova:operator") == true &&
    player.getDynamicProperty("nova:operator") !== undefined
  )
    return;
  if (ev.damagingEntity.typeId !== "minecraft:player") return;

  let cpscount = get_cps(player);

  let location1 = ev.damagingEntity.location;
  let location2 = ev.hitEntity.location;

  const distance = Math.pow(
    Math.pow(location2.x - location1.x, 2) +
      Math.pow(location2.y - location1.y, 2) +
      Math.pow(location2.z - location1.z, 2),
    0.5
  );

  if (cpscount > getdp("nova:cpsmax")) {
    if (getdp("nova:killaura_status") == false) {
      return;
    }
    if (getdp("nova:cpsmax_processing") == 0) {
      return;
    } else if (getdp("nova:cpsmax_processing") == 1) {
      if (attackCooldown.has(player.id)) {
        return;
      } else {
        server.world.sendMessage(
          `[§a§lNovaDefender§r] §v設定以上のCPSを検知しました。\n §p${
            player.name
          }\n §c${cpscount}cps        \n - §7Type: ${ev.hitEntity.typeId} ${
            ev.hitEntity.nameTag || ""
          }
`
        );
        attackCooldown.set(player.id, true);
        server.system.runTimeout(() => {
          attackCooldown.delete(player.id);
        }, 200);
      }
    } else if (getdp("nova:cpsmax_processing") == 2) {
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §v設定以上のCPSを検知しました。\n §p${
          player.name
        }\n §c${cpscount}cps        \n - §7Type: ${ev.hitEntity.typeId} ${
          ev.hitEntity.nameTag || ""
        }
`
      );

      command(
        `kick ${player.name} §lkicked By NovaDefender\n\n設定以上のCPSを検知しました。 ｜ ${cpscount}cps`
      );
      server.world.getPlayers().forEach((players) => {
        if (
          players.getDynamicProperty("nova:operator") == true &&
          players.getDynamicProperty("nova:operator") !== undefined
        ) {
          players.sendMessage(
            `[§a§lNovaDefender§r] ${player.name} を CPS制限でkickしました。 (${cpscount}cps)`
          );
        } else {
          return;
        }
      });
    } else if (getdp("nova:cpsmax_processing") == 3) {
      action.opnotfi("BAN機能は開発中です。 現在使うことができません。");
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §v設定以上のCPSを検知しました。\n §p${player.name}\n §c${cpscount}cps`
      );
      // player.setDynamicProperty("nova:ban", true);
      // server.world.getPlayers().forEach((players) => {
      //   if (
      //     players.getDynamicProperty("nova:operator") == true &&
      //     players.getDynamicProperty("nova:operator") !== undefined
      //   ) {
      //     players.sendMessage(
      //       `[§a§lNovaDefender§r] ${player.name} を CPS制限でbanしました。 (${cpscount}cps)`
      //     );
      //   } else {
      //     return;
      //   }
      // });
    }
  }

  if (distance > reach) {
    if (attackCooldown2.has(player.id)) {
      return;
    } else {
      server.world.sendMessage(
        `[§a§lNovaDefender§r] §v設定以上のリーチを検知しました。\n §p${
          player.name
        }\n §c${Math.floor(distance)}block`
      );
      attackCooldown2.set(player.id, true);
      server.system.runTimeout(() => {
        attackCooldown2.delete(player.id);
      }, 200);
    }
  }
});

server.system.runInterval(() => {
  tickCount++;
}, 1);

server.system.runInterval(() => {
  let now = Date.now();
  let elapsed = (now - lastTime) / 1000; // 経過時間（秒）
  lastTime = now;

  currentTPS = Math.min(20, Math.round((tickCount / elapsed) * 10) / 10);
  tickCount = 0;
}, 20);

function getTPS() {
  if (currentTPS == 20) {
    let view_tps = `${currentTPS}.0 / 20.0`;
    return view_tps;
  } else {
    let view_tps2 = `${currentTPS} / 20.0`;
    return view_tps2;
  }
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}tps`) {
    ev.cancel = true;
    ev.sender.sendMessage(`§vworld TPS: §r§a${getTPS()}`);
  }
});

server.world.afterEvents.playerPlaceBlock.subscribe((ev) => {
  let player = ev.player;
  if (player.getDynamicProperty("nova:place_cancel") == true) {
    setBlockToAir(ev.block.x, ev.block.y, ev.block.z, ev.block.dimension.id);

    server.system.runTimeout(() => {
      player.setDynamicProperty("nova:place_cancel", false);
    }, 20);
  } else {
    if (getdp("nova:place_search_count") == undefined) {
      setdp("nova:place_search_count", 0);
    }
    let log = `block: ${ev.block.typeId} players: ${
      ev.player.name
    } time: ${getjptime()} location: ${ev.block.location.x} ${
      ev.block.location.y
    } ${ev.block.location.z} ${ev.block.typeId}`;
    setdp(
      `p ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`,
      log
    );
  }
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  let log = `block: ${ev.block.typeId} players: ${
    ev.player.name
  } time: ${getjptime()} location: ${ev.block.location.x} ${
    ev.block.location.y
  } ${ev.block.location.z}`;
  setdp(
    `b ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`,
    log
  );
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  let block = [
    "minecraft:bedrock",
    "minecraft:command_block",
    "minecraft:chain_command_block",
    "minecraft:repeat_command_block",
    "minecraft:structure_block",
    "minecraft:barrier",
    "minecraft:allow",
    "minecraft:deny",
  ];
  if (
    block.indexOf(ev.block.typeId) !== -1 &&
    ev.player.getGameMode() !== "creative" &&
    !getop(ev.player)
  ) {
    server.world.sendMessage(
      `[§a§lNovaDefender§r] §l不正なブロック破壊を検知しました ｜ Name: §e${ev.source.name}`
    );
  }
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.itemStack == undefined) return;
  if (ev.itemStack.nameTag == "nova:search.place") {
    ev.cancel = true;
    if (
      getdp(
        `p ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`
      ) === undefined
    ) {
      return;
    }
    ev.player.sendMessage(
      `§l§2[NovaDefender]§r§l logsearcher ログが見つかりました. ${getdp(
        `p ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`
      )}`
    );
  }
});

function log(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");

  form.button("§lログイン履歴 / Login History");
  form.button("§lログアウト履歴 / Logout History");
  form.button("§l破壊ログ検索 / Break Logsearch");
  form.button("§l設置ログ検索 / Place Logsearch");
  form.button("戻る", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) nova_hub(player);
      switch (response.selection) {
        case 0:
          login(player);
          break;
        case 1:
          logout(player);
          break;
        case 2:
          break_search(player);
          break;
        case 3:
          place_searcher_form(player);
          break;
        case 4:
          nova_hub(player);
          break;
        default:
          nova_hub(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

server.system.runInterval(() => {
  elapsedTicks += 1;
}, 1);

// 経過時間を「時間 分 秒」で返す関数
function getWorldUptime() {
  const totalSeconds = Math.floor(elapsedTicks / 20); // 20tick = 1秒
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}時間 ${minutes}分 ${seconds}秒`;
}

async function change_log(player) {
  let changelog = "";
  changelog_list.forEach((item) => {
    changelog = changelog + `${item.name}: ${item.disp} (${item.time})\n`;
  });
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`\n\n§v変更履歴: \n ${changelog} \n\n\n`);
  form.button("§l戻る / return", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      player.setDynamicProperty("setting_open", false);
      switch (response.selection) {
        case 0:
          nova_hub(player);
          break;
        default:
          nova_hub(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

async function about(player) {
  let about_view = "";
  abouts.forEach((item) => {
    about_view = about_view + `   ${item}\n`;
  });
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`§vこのアドオンについて。§r\n${about_view}`);
  form.button("§l戻る / return", "textures/ui/realms_red_x");

  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        nova_hub(player);
        break;
      default:
        nova_hub(player);
        break;
    }
  });
}

//nova:controlpanel form function
async function nova_hub(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(
    `\n\n §l§a--- world data --- \n\n §r§v現在時刻: §r${dispgetjptime()}\n §v経過時間: §r${getWorldUptime()}\n §vプレイヤー人数: §r${
      server.world.getAllPlayers().length
    }\n §v合計エンティティ数: §r${getAE()}\n §vTPS: §r${getTPS()}\n\n\n\n`
  );
  form.button(
    "§lプレイヤーリスト / Player list",
    "textures/gui/newgui/Friends.png"
  );
  form.button("§lエンティティ数 / entity count", "textures/items/egg_pig");
  form.button("§l設定 / setting", "textures/ui/icon_setting");
  form.button("§lログ / log", "textures/items/book_normal");
  form.button("§l変更履歴 / Changelog", "textures/ui/copy");
  form.button("§l概要 / About", "textures/items/chalkboard_large");

  form
    .show(player)
    .then((response) => {
      player.setDynamicProperty("setting_open", false);
      switch (response.selection) {
        case 0:
          all_pl(player);
          break;
        case 1:
          all_entity(player);
        case 2:
          if (response.selection == 2) setting(player);
          break;
        case 3:
          log(player);
          break;
        case 4:
          change_log(player);
          break;
        case 5:
          about(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

async function armorform(player, slot, playerdata) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  let soubi = getpl_soubi(playerdata);
  let slot_select = 0;
  let item = {};
  if (slot === 0) {
    item = soubi["helmet"];
    slot_select = "helmet";
  } else if (slot === 1) {
    item = soubi["chestplate"];
    slot_select = "chestplate";
  } else if (slot === 2) {
    item = soubi["leggings"];
    slot_select = "leggings";
  } else if (slot === 3) {
    item = soubi["boots"];
    slot_select = "boots";
  }
  form.body(
    `Player: ${playerdata.name}\nTypeId: ${item.typeId}\nnameTag: ${item.nameTag}\nSlot: ${slot_select}`
  );
  form.button("§l削除 / delete", "textures/ui/icon_trash");
  form.button("§l戻る / return", "textures/ui/realms_red_x");

  form.show(player).then((response) => {
    if (response.canceled) {
      inventory(player, playerdata);
      return;
    }

    switch (response.selection) {
      case 0:
        if (response.selection == 0) {
          clearPlayerEquipment(playerdata, slot);
        }
        inventory(player, playerdata);
        break;
      case 1:
        inventory(player, playerdata);
      default:
        inventory(player, playerdata);
        break;
    }
  });
}

function clearPlayerEquipment(player, slot) {
  const equipment = player.getComponent("minecraft:equippable");
  if (!equipment) return;

  // すべての装備スロットを空にする
  if (slot === 0) {
    equipment.setEquipment(server.EquipmentSlot.Head, null);
  } else if (slot === 1) {
    equipment.setEquipment(server.EquipmentSlot.Chest, null);
  } else if (slot === 2) {
    equipment.setEquipment(server.EquipmentSlot.Legs, null);
  } else if (slot === 3) {
    equipment.setEquipment(server.EquipmentSlot.Feet, null);
  }
}

async function itemform(player, item, playerdata) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(
    `Player: ${playerdata.name}\nTypeId: ${item.itemStack.typeId}\nnameTag: ${item.itemStack.nameTag}\nSlot: ${item.slot}`
  );
  form.button("§l削除 / delete", "textures/ui/icon_trash");
  form.button("§l戻る / return", "textures/ui/realms_red_x");

  form.show(player).then((response) => {
    if (response.canceled) {
      inventory(player, playerdata);
      return;
    }

    switch (response.selection) {
      case 0:
        if (response.selection == 0)
          clearInventorySlot(playerdata.name, item.slot);
        player.sendMessage(
          `[§a§lNovaDefender§r] §e${playerdata.name} §rの §e${item.itemStack.typeId} §rを削除しました。 §7(slot: ${item.slot})`
        );
        server.system.runTimeout(() => {
          inventory(player, playerdata);
        }, 15);
        break;
      case 1:
        inventory(player, playerdata);
      default:
        inventory(player, playerdata);
        break;
    }
  });
}

/**
 * 指定されたプレイヤーの指定されたスロットのアイテムをクリアする関数
 * @param {string} playerName - プレイヤー名
 * @param {number} slot - スロット番号
 */
function clearInventorySlot(playerName, slot) {
  const player = server.world.getPlayers().find((p) => p.name === playerName);
  if (!player) {
    return;
  }

  const inventory = player.getComponent("minecraft:inventory").container;

  if (slot < 0 || slot >= inventory.size) {
    return;
  }

  inventory.setItem(slot, null);
}

function speed_setting(player) {
  const form = new ui.ModalFormData();
  form.textField("§lspeedを入力してください", "例 : 50");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }
      setdp("nova:cpsmax", response.formValues[0]);
      player.sendMessage("[§lNovaDefender§r] 設定が完了しました");
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

function place_searcher_form(player) {
  const form = new ui.ModalFormData();
  form.textField("§l座標を入力してください", "例 : 15 10 80");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }
      let log = getdp(`p ${String(response.formValues[0])}`);
      player.sendMessage("[§lNovaDefender§r] §aPlace Searcher : " + log);
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

function cps_setting(player) {
  const form = new ui.ModalFormData();
  form.textField("§lCPSを入力してください", " ", String(getdp("nova:cpsmax")));
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        killaura_setting(player);
        return;
      }
      if (response.formValues[0] === "" || response.formValues[0] === " ") {
        killaura_setting(player);
      } else {
        setdp("nova:cpsmax", response.formValues[0]);
        player.sendMessage("[§lNovaDefender§r] 設定が完了しました");
        killaura_setting(player);
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

function all_pl(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(`§pplayer: ${server.world.getPlayers().length}\n`);
  server.world.getPlayers().forEach((player) => {
    if (player.name == admin) {
      form.button(
        `§e[admin] §r${player.name}§r`,
        "textures/ui/permissions_op_crown"
      );
    } else if (player.getDynamicProperty("nova:operator") == true) {
      form.button(
        `§e[operator] §r${player.name}§r`,
        "textures/ui/permissions_op_crown"
      );
    } else {
      form.button(
        `§a[member] §r${player.name}§r`,
        "textures/ui/permissions_member_star"
      );
    }
  });
  form.button("戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      if (server.world.getPlayers()[response.selection] === undefined) {
        nova_hub(player);
        return;
      } else {
        let players = server.world.getPlayers()[response.selection];
        player_setting(player, players);
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

// 名前付きアイテムを付与する関数
function giveNamedItem(playerName) {
  let targetPlayer = getPlayerByName(playerName);
  const item = new server.ItemStack("minecraft:paper", 1); // アイテムIDと数量
  item.setLore(["§7必要権限: operator"]);
  item.nameTag = "[§a§lNovaDefender§r] パネルを開く";

  const inventory = targetPlayer.getComponent("minecraft:inventory").container;
  try {
    inventory.addItem(item);
    return;
  } catch (error) {
    return;
  }
}

server.system.runInterval(() => {
  let players = server.world.getPlayers();
  players.forEach((player) => {
    if (player.getDynamicProperty("nova:givepanel") == undefined) {
      return;
    }
    if (player.getDynamicProperty("nova:givepanel") == true) {
      player.setDynamicProperty("nova:givepanel", false);
      giveNamedItem(player.name);
    } else {
      return;
    }
  });
});

function dispgetjptime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // UTC時刻をミリ秒で取得
  const jst = new Date(utc + 9 * 60 * 60 * 1000); // JST時刻をミリ秒で取得

  const year = jst.getFullYear();
  const month = String(jst.getMonth() + 1).padStart(2, "0");
  const day = String(jst.getDate()).padStart(2, "0");
  const hours = String(jst.getHours()).padStart(2, "0");
  const minutes = String(jst.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// server.system.runInterval(() => {
//   if (getdp("nova:itemkill_switch") == true) {
//     server.world.sendMessage(`[§a§lNovaDefeder§r] アイテムキルを行います。`);
//     let time = 5;
//     server.world.sendMessage(`[§7counter§r] ${time}sec`);
//     server.system.runTimeout(() => {
//       time--;
//       server.world.sendMessage(`[§7counter§r] ${time}sec`);
//       server.system.runTimeout(() => {
//         time--;
//         server.world.sendMessage(`[§7counter§r] ${time}sec`);
//         server.system.runTimeout(() => {
//           time--;
//           server.world.sendMessage(`[§7counter§r] ${time}sec`);
//           server.system.runTimeout(() => {
//             time--;
//             server.world.sendMessage(`[§7counter§r] ${time}sec`);
//             server.system.runTimeout(() => {
//               command(`kill @e[type=item]`);
//               server.world.sendMessage(
//                 `[§a§lNovaDefender§r] §aアイテムキルを行いました。`
//               );
//             }, 20);
//           }, 20);
//         }, 20);
//       }, 20);
//     }, 20);
//   }
// }, getdp("nova:itemkill_tick"));

server.system.runInterval(() => {
  if (getdp("nova:itemkill_tick") == undefined) {
    setdp("nova:itemkill_tick", Number(2400));
  }
});

// server.world.beforeEvents.chatSend.subscribe((ev) => {
//   if (ev.message == "test") {
//     setdp("nova:itemkill_tick", 2400);
//   }
// });

server.system.runInterval(() => {
  if (getdp("nova:itemkill_switch") == undefined) {
    setdp("nova:itemkill_switch", true);
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message === `${getdp("nova:command_firsts")}item`) {
    ev.cancel = true;
    let player = ev.sender;
    if (player.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
    if (player.getDynamicProperty("nova:operator") == true) {
      player.sendMessage(
        "[§a§lNovaDefender§r] 管理者パネルアイテムを付与しました。 右クリックで使用できます"
      );
      ev.sender.setDynamicProperty("nova:givepanel", true);
    } else if (player.getDynamicProperty("nova:operator") == false) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
      return;
    }
  }
});

function all_entity(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  let body = "";
  let entity_o = [];
  let entity_n = [];
  let entity_e = [];
  if (server.world.getDimension("overworld").getEntities().length !== 0) {
    body = body + "overworld";
    server.world
      .getDimension("overworld")
      .getEntities()
      .forEach((type) => {
        if (entity_o.indexOf(`${type.typeId}`) !== -1) {
          return;
        } else {
          body =
            body +
            `\n§7 -${type.typeId}: §r${
              server.world
                .getDimension("overworld")
                .getEntities({ type: type.typeId }).length
            }`;
          entity_o.push(`${type.typeId}`);
        }
      });
  }
  if (server.world.getDimension("nether").getEntities().length !== 0) {
    body = body + "\nnether";
    server.world
      .getDimension("nether")
      .getEntities()
      .forEach((type) => {
        if (entity_n.indexOf(`${type.typeId}`) !== -1) {
          return;
        } else {
          body =
            body +
            `\n§7 -${type.typeId}: §r${
              server.world
                .getDimension("nether")
                .getEntities({ type: type.typeId }).length
            }`;
          entity_n.push(`${type.typeId}`);
        }
      });
  }
  if (server.world.getDimension("the_end").getEntities().length !== 0) {
    body = body + "\nend";
    server.world
      .getDimension("the_end")
      .getEntities()
      .forEach((type) => {
        if (entity_e.indexOf(`${type.typeId}`) !== -1) {
          return;
        } else {
          body =
            body +
            `\n§7 -${type.typeId}: §r${
              server.world
                .getDimension("the_end")
                .getEntities({ type: type.typeId }).length
            }`;
          entity_e.push(`${type.typeId}`);
        }
      });
  }
  form.body(body);
  form.button("§lアイテムをキルする / Item Kill", "textures/ui/icon_trash");
  form.button("§l戻る", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          let item_count = server.world
            .getDimension("overworld")
            .getEntities({ type: "minecraft:item" }).length;
          item_count =
            item_count +
            server.world
              .getDimension("nether")
              .getEntities({ type: "minecraft:item" }).length;
          item_count =
            item_count +
            server.world
              .getDimension("the_end")
              .getEntities({ type: "minecraft:item" }).length;
          command(`kill @e[type=item]`);
          player.sendMessage(
            `[§a§lNovaDefender§r] §aアイテムをキルしました。  (${item_count}kill)`
          );
        case 1:
          nova_hub(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function getpl_soubi(player) {
  let item = checkPlayerEquipment(player);
  let soubi = {
    helmet: item["helmet"],
    chestplate: item["chestplate"],
    leggings: item["leggings"],
    boots: item["boots"],
  };
  return soubi;
}

server.system.runInterval(() => {
  if (getdp("nova:flyhack_activestate") == undefined) {
    setdp("nova:flyhack_activestate", false);
  }

  if (getdp("nova:speedprocessing") == undefined) {
    setdp("nova:speedprocessing", 0);
  }
});

function fly_hack_processing(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button(`none\n§a無視します`);
  form.button(`notification\n§a通知だけします`);
  form.button(`kick\n§akickします`);
  form.button(`ban\n§abanします`);
  form.button("§l戻る", "textures/ui/realms_red_x");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          setdp("nova:speedprocessing", 0);
          fly_hack_setting(player);
          break;
        case 1:
          setdp("nova:speedprocessing", 1);
          fly_hack_setting(player);
          break;
        case 2:
          setdp("nova:speedprocessing", 2);
          fly_hack_setting(player);
          break;
        case 3:
          setdp("nova:speedprocessing", 3);
          fly_hack_setting(player);
          break;
        case 4:
          fly_hack_setting(player);
          break;
        default:
          fly_hack_setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

server.system.runInterval(() => {
  if (getdp("nova:fly_tpback") == undefined) {
    setdp("nova:fly_tpback", true);
  }
});

function pltp(player, x, y, z, dim) {
  player.teleport({ dimension: dim, x: x, y: y, z: z });
}

function fly_hack_setting(player) {
  let processing = 0;
  if (getdp("nova:speedprocessing") == 0) {
    processing = "none";
  } else if (getdp("nova:speedprocessing") == 1) {
    processing = "notfi";
  } else if (getdp("nova:speedprocessing") == 2) {
    processing = "kick";
  } else if (getdp("nova:speedprocessing") == 3) {
    processing = "ban";
  }
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(
    "§a§l--- NovaDefender AntiCheat ---\n\n §rFly Setting (Setting User Interface)\n\n\n"
  );
  form.button(`status\n§7${String(getdp("nova:flyhack_activestate"))}`); //0
  form.button(`maxspeed\n§7${String(getdp("nova:maxspeed"))}`); //1
  form.button(
    `notfication speed\n§7${String(getdp("nova:fly_data_view_speed"))}`
  ); //2
  form.button(`processing\n§7${processing}`); //3
  form.button(`tpback\n§7${getdp("nova:fly_tpback")}`); //4
  form.button("§lリセット / reset", "textures/ui/refresh_light"); //5
  form.button("§l戻る / return", "textures/ui/realms_red_x"); //6
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      switch (response.selection) {
        case 0:
          if (getdp("nova:flyhack_activestate") == true) {
            setdp("nova:flyhack_activestate", false);
            fly_hack_setting(player);
          } else {
            setdp("nova:flyhack_activestate", true);
            fly_hack_setting(player);
          }
          break;
        case 1:
          setmaxspeed(player);
          break;
        case 2:
          setmaxnotfispeed(player);
          break;
        case 3:
          fly_hack_processing(player);
          break;
        case 4:
          if (getdp("nova:fly_tpback") == true) {
            setdp("nova:fly_tpback", false);
            fly_hack_setting(player);
          } else {
            setdp("nova:fly_tpback", true);
            fly_hack_setting(player);
          }
          break;
        case 5:
          setdp("nova:fly_tpback", true);
          setdp("nova:speedprocessing", 0);
          setdp("nova:maxspeed", 50);
          setdp("nova:flyhack_activestate", false);
          fly_hack_setting(player);
          break;
        case 6:
          setting(player);
          break;
        default:
          setting(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function setting(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body("§a§l--- NovaDefender AntiCheat ---\n  §r§vSetting User Interface");
  form.button("Noitem\n§a禁止アイテムの設定");
  form.button("attack\n§a攻撃関連の設定");
  form.button("movement\n§a移動関係の設定");
  form.button("creative\n§aクリエイティブ検知設定");
  form.button("Noentity\n§a禁止エンティティ設定");
  form.button("OverEnchantments\n§aオーバエンチャント検知設定");
  form.button("Command\n§aコマンド系の設定");
  form.button("Maxentity\n§a最大エンティティの設定");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        nova_hub(player);
        return;
      }
      switch (response.selection) {
        case 0:
          Noitemsetting(player);
          break;
        case 1:
          killaura_setting(player);
          break;
        case 2:
          fly_hack_setting(player);
          break;

        case 3:
          creative_setting(player);
          break;

        case 4:
          Noentitysetting(player);
          break;
        case 5:
          over_enchantment_setting(player);
          break;
        case 6:
          command_first_setting(player);
          break;
        case 7:
          max_entity_setting_main(player);
          break;
        default:
          nova_hub(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function creative_setting(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button(`§lswitch\n§r§7${String(getdp("nova:creative_d"))}`);
  form.button("§l戻る", "textures/ui/realms_red_x");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      switch (response.selection) {
        case 0:
          creative_setting_mode(player);
          break;
        case 1:
          setting(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function creative_setting_mode(player) {
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.button("§lON");
  form.button("§lOFF");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      switch (response.selection) {
        case 0:
          setdp("nova:creative_d", true);
          creative_setting(player);
          break;
        case 1:
          setdp("nova:creative_d", false);
          creative_setting(player);

          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

/**
 *
 * @param {server.Player} player - プレイヤーオブジェクト
 * @returns {Array} - アイテムの配列
 */

function getInventoryItems(player) {
  const inventory = player.getComponent("minecraft:inventory").container;
  const items = [];

  for (let i = 0; i < inventory.size; i++) {
    const itemStack = inventory.getItem(i);
    let data = { itemStack: itemStack, slot: i };
    if (itemStack) {
      items.push(data);
    }
  }

  return items;
}

function checkPlayerEquipment(player) {
  const equipment = player.getComponent("minecraft:equippable");
  if (!equipment) return null; // 装備コンポーネントがない場合

  let item = {
    helmet: equipment.getEquipment(server.EquipmentSlot.Head), // ヘルメット
    chestplate: equipment.getEquipment(server.EquipmentSlot.Chest), // チェストプレート
    leggings: equipment.getEquipment(server.EquipmentSlot.Legs), // レギンス
    boots: equipment.getEquipment(server.EquipmentSlot.Feet), // ブーツ
    mainHand: equipment.getEquipment(server.EquipmentSlot.Mainhand), // メインハンド
    offHand: equipment.getEquipment(server.EquipmentSlot.Offhand), // オフハンド
  };
  return item;
}

function inventory(player, players) {
  const form = new ui.ActionFormData();
  let soubi = getpl_soubi(players);
  form.title("§a§lNovaDefender controlpanel");
  form.button("§psetting");
  getInventoryItems(players).forEach((item) => {
    form.button(
      `§7item §v${item.itemStack.typeId}§p\n§7amount: ${
        item.itemStack.amount
      } / nameTag: ${item.itemStack.nameTag || ""} / slot: ${item.slot}`
    );
  });
  if (soubi["helmet"] !== undefined) {
    form.button(
      `§7armor §v${soubi["helmet"].typeId}§7\nnameTag: ${
        soubi["helmet"].nameTag || ""
      } / slot: helmet`
    );
  }
  if (soubi["chestplate"] !== undefined) {
    form.button(
      `§7armor §v${soubi["chestplate"].typeId}§7\nnameTag: ${
        soubi["chestplate"].nameTag || ""
      } / slot: chestplate`
    );
  }

  if (soubi["leggings"] !== undefined) {
    form.button(
      `§7armor §v${soubi["leggings"].typeId}§7\nnameTag: ${
        soubi["leggings"].nameTag || ""
      } / slot: leggings`
    );
  }

  if (soubi["boots"] !== undefined) {
    form.button(
      `§7armor §v${soubi["boots"].typeId}§7\nnameTag: ${
        soubi["boots"].nameTag || ""
      } / slot: boots`
    );
  }

  form
    .show(player)
    .then((response) => {
      if (response.canceled) player_setting(player);

      if (response.selection === 0) {
        inventory_setting(player, players);
      } else {
        if (response.selection > getInventoryItems(players).length) {
          let typeslot =
            getInventoryItems(players).length - response.selection + 1;
          armorform(player, typeslot, players);
        } else {
          let selectitem = getInventoryItems(players);
          itemform(player, selectitem[response.selection - 1], players);
        }
      }
    })
    .catch((err) => {
      player_setting(player, players);
    });
}

async function inventory_setting(player, players) {
  const form = new ui.ActionFormData()
    .title("§einventory setting")
    .button("§p更新 / reload")
    .button("エンダーチェストをクリア")
    .button("インベントリをクリア")
    .button("戻る / return");

  // フォームの表示と結果の代入
  const res = await form.show(player);

  // もしキャンセルされていたら、return;で処理を終了する
  if (res.canceled) return;

  // 押されたボタンに応じてコマンドを実行
  switch (res.selection) {
    case 0:
      inventory(player, players);
      break;
    case 1:
      command(`replaceitem entity "${players.name}" slot.enderchest 0 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 1 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 2 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 3 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 4 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 5 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 6 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 7 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 8 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 9 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 10 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 11 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 12 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 13 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 14 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 15 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 16 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 17 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 18 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 19 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 20 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 21 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 22 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 23 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 24 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 25 air`);
      command(`replaceitem entity "${players.name}" slot.enderchest 26 air`);
      player.sendMessage(
        `[§a§lNovaDefender§r] ${players.name} の エンダーチェストクリアに成功しました。`
      );
      break;
    case 2:
      command(`clear "${players.name}"`);
      player.sendMessage(
        `[§a§lNovaDefender§r] ${players.name} の インベントリクリアに成功しました。`
      );
      break;
    case 3:
      inventory(player, players);
      break;
  }
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";admin auto.op" && ev.sender.name == admin) {
    setdp("nova:autoop", !getdp("nova:autoop"));
    ev.cancel = true;
    ev.sender.sendMessage(
      "[§a§lNovaDefender§r] §aresponse completed. (" +
        getdp("nova:autoop") +
        ")"
    );
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {});

function player_setting(player, players) {
  let playerdata = players;
  let dimension = players.dimension.id;
  const form = new ui.ActionFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.body(
    `§pName: §r${playerdata.name} \n§pPermission: §r${testplop(
      playerdata
    )} \n§pHealth: §r${
      playerdata.getComponent("minecraft:health").currentValue
    } / ${
      players.getComponent("minecraft:health").effectiveMax
    }\n§plocation: §r${Math.floor(playerdata.location.x)} ${Math.floor(
      playerdata.location.y
    )} ${Math.floor(
      playerdata.location.z
    )} \n§pdimension: §r${dimension}\n§pgamemode: §r${getgamemode(
      playerdata
    )}\n§pplatform:§r ${playerdata.clientSystemInfo.platformType} (${
      players.inputInfo.lastInputModeUsed
    })\n§7afk: §r${getsleep(
      players
    )}\n§pplaytime (${getjpday()}): §r${getdayplay_time(
      players,
      getjpday()
    )}sec\n§pworldplaytime (all):§r ${getall_worldplay_time(players)}sec`
  );
  form.button(
    "§l権限設定 / permission management",
    "textures/ui/achievement_locked_icon.png"
  ); //0
  form.button("§lアビリティ設定 / ability setting", "textures/ui/icon_potion"); //1
  form.button("§lインベントリ / inventory", "textures/blocks/bookshelf.png"); //2
  form.button("§lkick", "textures/gui/newgui/X.png"); //3
  form.button("§lban", "textures/blocks/barrier"); //4
  form.button("§lテレポート / teleport", "textures/items/ender_pearl"); //5
  form.button(
    "§l自分にテレポート / Teleport to self",
    "textures/items/ender_eye"
  );
  form.button(
    "§lゲームモード変更 / change gamemode",
    "textures/ui/permissions_op_crown"
  );

  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          player_permissoion_setting(player, players);
          break;
        case 1:
          player_ability_setting(player, players);
          break;
        case 2:
          inventory(player, players);
          break;
        case 3:
          if (response.selection === 3) {
            let command = server.world.getPlayers()[0];
            command(
              `kick ${players.name} §lkicked By NovaDefender \n Type: kickcommand\nExecution Player: ${player.name}`
            );
            player.sendMessage(
              `[§a§lNovaDefender§r] ${players.name}をkickしました`
            );
          }

        case 4:
          // if (response.selection === 4) {
          //   let commands = server.world.getPlayers()[0];
          //   command(`tag ${players.name} add nova:ban`);
          //   player.sendMessage(
          //     `[§a§lNovaDefender§r] ${players.name}をbanしました`
          //   );
          // }

          break;
        case 5:
          command(`tp ${player.name} ${players.name}`);
          player.sendMessage(
            `[§a§lNovaDefender§r] §e${players.name} §aにテレポートしました。`
          );
          break;
        case 6:
          command(`tp ${players.name} ${player.name}`);
          player.sendMessage(
            `[§a§lNovaDefender§r] §e${players.name} §aを §e ${
              player.name
            } §aにテレポートさせました。 (${Math.floor(
              playerdata.location.x
            )} ${Math.floor(playerdata.location.y)} ${Math.floor(
              playerdata.location.z
            )})`
          );
          break;
        case 7:
          change_gamemode(player, players);
          break;
        default:
          all_pl(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

server.system.runInterval(() => {
  if (getdp("nova:maxentityswitch") == undefined) {
    setdp("nova:maxentityswitch", true);
  }
});

server.system.runInterval(() => {
  if (getdp("nova:maxentityswitch") == true) {
    server.world
      .getDimension("overworld")
      .getEntities()
      .forEach((entity) => {
        let length = server.world
          .getDimension("overworld")
          .getEntities({ type: entity.typeId }).length;
        if (length > getdp("nova:maxentity") - 1) {
          server.world
            .getDimension("overworld")
            .getEntities({ type: entity.typeId })
            .forEach((killtype) => {
              killtype.kill();
            });
          server.world.sendMessage(
            `[§a§lNovaDefender§r] §a設定以上のエンティティを検知しました。\n §e- ${entity.typeId}\n§e - ${length}`
          );
        }
      });
    server.world
      .getDimension("the_end")
      .getEntities()
      .forEach((entity) => {
        let length = server.world
          .getDimension("the_end")
          .getEntities({ type: entity.typeId }).length;
        if (length > getdp("nova:maxentity") - 1) {
          server.world
            .getDimension("the_end")
            .getEntities({ type: entity.typeId })
            .forEach((killtype) => {
              killtype.kill();
            });
          server.world.sendMessage(
            `[§a§lNovaDefender§r] §a設定以上のエンティティを検知しました。\n §e- ${entity.typeId}\n§e - ${length}`
          );
        }
      });
    server.world
      .getDimension("nether")
      .getEntities()
      .forEach((entity) => {
        let length = server.world
          .getDimension("nether")
          .getEntities({ type: entity.typeId }).length;
        if (length > getdp("nova:maxentity") - 1) {
          server.world
            .getDimension("nether")
            .getEntities({ type: entity.typeId })
            .forEach((killtype) => {
              killtype.kill();
            });
          server.world.sendMessage(
            `[§a§lNovaDefender§r] §a設定以上のエンティティを検知しました。\n §e- ${entity.typeId}\n§e - ${length}`
          );
        }
      });
  }
});

async function max_entity_setting_main(player) {
  const form = new ui.ActionFormData()
    .title("§a§lNovaDefender controlpanel")
    .button(`§eswitch\n${getdp("nova:maxentityswitch")}`)
    .button(`§emaxentity\n§7${getdp("nova:maxentity")}`)
    .button("§e戻る / return");

  const res = await form.show(player);

  if (res.canceled) {
    setting(player);
    return;
  }

  switch (res.selection) {
    case 0:
      setdp("nova:maxentityswitch", !getdp("nova:maxentityswitch"));
      max_entity_setting_main(player);
      break;
    case 1:
      max_entity_setting(player);
      break;
    default:
      setting(player);
      break;
  }
}
async function max_entity_setting(player) {
  const form = new ui.ModalFormData()
    .title("§a§lNovaDefender controlpanel")
    .textField("maxentity", "");

  // フォームの表示
  form.show(player).then((res) => {
    if (res.canceled) return;

    const c = res.formValues[0];
    setdp("nova:maxentity", Number(c));
    player.sendMessage(
      `[§a§lNovaDefender§r] §a最大エンティティ数を §e${c} §aに変更しました。`
    );
  });
}

async function change_gamemode(players, player) {
  const form = new ui.ActionFormData()
    .title("§a§lNovaDefender controlpanel")
    .button("§ladventure")
    .button("§lcreative")
    .button("§lsurvival")
    .button("§l戻る / return");

  const res = await form.show(players);

  if (res.canceled) {
    player_setting(players, player);
    return;
  }

  switch (res.selection) {
    case 0:
      player.runCommand("gamemode a @s");
      player_setting(players, player);
      break;
    case 1:
      player.runCommand("gamemode c @s");
      player_setting(players, player);
      break;
    case 2:
      player.runCommand("gamemode s @s");
      player_setting(players, player);
      break;
    case 3:
      player_setting(players, player);
      break;
    default:
      player_setting(players, player);
      break;
  }
}

function getPlayerSpeed(player) {
  const velocity = player.getVelocity(); // プレイヤーの速度を取得
  const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2); // X, Zの速度のみ計算
  return speed;
}

async function player_permissoion_setting(player, typeplayer) {
  let operator = false;
  if (
    typeplayer.getDynamicProperty("nova:operator") == undefined ||
    typeplayer.getDynamicProperty("nova:operator") == false
  ) {
    operator = false;
  } else {
    operator = true;
  }
  const form = new ui.ModalFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.toggle("§loperator", operator);
  form.toggle("§lcreative");
  form.toggle("§lbuilder");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        player_setting(player);
        return;
      }
      if (response.formValues[0] == true) {
        typeplayer.setDynamicProperty("nova:operator", true);
      } else if (response.formValues[0] == false) {
        typeplayer.setDynamicProperty("nova:operator", false);
      }

      if (response.formValues[1] == true) {
        typeplayer.setDynamicProperty("nova:creativepermit", true);
      } else if (response.formValues[1] == false) {
        typeplayer.setDynamicProperty("nova:creativepermit", false);
      }
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//hub open 2
server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("setting_open") == true) {
      server.system.runTimeout(() => {
        nova_hub(player);
      }, 30);
      player.setDynamicProperty("setting_open", false);
    }
  });
});

//hub open 1
server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == `${getdp("nova:command_firsts")}item`) {
    ev.cancel = true;
    return;
  }
  if (ev.message == `${getdp("nova:command_firsts")}setting`) {
    ev.cancel = true;
    if (ev.sender.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
    if (ev.sender.getDynamicProperty("nova:operator") == true) {
      ev.sender.setDynamicProperty("setting_open", true);

      ev.sender.sendMessage("§7[NovaDefender] チャットを閉じてください");
    } else if (ev.sender.getDynamicProperty("nova:operator") == false) {
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §ccommand error: 権限が存在しません。 §r(§7permission is undefined§r)`
      );
    }
  }
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.getDynamicProperty("nova:fixed") == true) {
    ev.cancel = true;
  }
});

async function player_ability_setting(player, typeplayer) {
  const form = new ui.ModalFormData();
  form.title("§a§lNovaDefender controlpanel");
  form.toggle(
    `§lfixed (${String(typeplayer.getDynamicProperty("nova:fixed"))})`,
    typeplayer.getDynamicProperty("nova:fixed")
  );
  form.toggle(
    `§lmuted (${String(typeplayer.getDynamicProperty("nova:mute"))})`,
    typeplayer.getDynamicProperty("nova:mute")
  );

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        player_setting(player);
        return;
      }
      player.sendMessage("§lfixed : " + String(response.formValues[0]));
      player.sendMessage("§lmuted : " + String(response.formValues[1]));
      typeplayer.setDynamicProperty("nova:fixed", response.formValues[0]);
      typeplayer.setDynamicProperty("nova:mute", response.formValues[1]);
      command(`ability "${typeplayer.name}" mute ${response.formValues[1]}`);
      if (response.formValues[1] == true) {
        typeplayer.sendMessage("[§a§lNovaDefender§r] §aミュートされました。");
      } else {
        typeplayer.sendMessage(
          "[§a§lNovaDefender§r] §aミュートが解除されました。"
        );
      }
    })

    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

//testop
function testplop(player) {
  if (player.isOp()) {
    return "operator";
  } else if (!player.isOp()) {
    return "member";
  } else {
    return "etr...";
  }
}

function getgamemode(player) {
  let gamemode = player.getGameMode();
  return gamemode;
}

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    let gamemode = getgamemode(player);
    if (gamemode == "creative") {
      if (
        getdp("nova:creative_d") == false ||
        getdp("nova:creative_d") === undefined
      ) {
        return;
      }

      if (
        player.getDynamicProperty("nova:operator") == true ||
        player.getDynamicProperty("nova:operator") !== undefined
      ) {
        return;
      }

      if (
        player.getDynamicProperty("nova:creativepermit") !== undefined ||
        player.getDynamicProperty("nova:creativepermit") == true
      ) {
        return;
      }

      server.world.sendMessage(
        `[§a§lNovaDefender§r] ${player.name} >> 不正なクリエイティブを検知しました。 §r(§7Gamemode detection)`
      );
      let command = server.world.getPlayers()[0];
      command(`gamemode s ${player.name}`);
    }
  });
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.startsWith(`${getprefix()}command`)) {
    ev.cancel = true;
    if (getop(ev.sender)) {
      let args = ev.message.split(`${getprefix()}command `);
      ev.sender.sendMessage(
        `[§a§lNovaDefender§r] §aコマンド §e${args[1]} §aを実行しました。`
      );
      server.system.run(() => {
        ev.sender.runCommand(`${args[1]}`);
      });
    } else {
      ev.sender.sendMessage(
        "[§a§lNovaDefender§r] §ecommand error: §a権限が存在しません。 §7(operator undefined)"
      );
    }
  }
});

//breaksearcher
function break_search(player) {
  const form = new ui.ModalFormData();
  form.title("§a§lNovaDefender break searcher from");
  form.textField("調べる座標を入力", "例 : 1 -1 5");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        log(player);
        return;
      }
      player.sendMessage(
        "[§a§lNovaDefender§r] §aBreak Searcher: " +
          getdp(`b ${String(response.formValues[0])}`)
      );
    })
    .catch((error) => {
      log(player);
      return;
    });
}

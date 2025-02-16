import * as server from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
let tps_c = 0;
let msc = 0;
let ms = true;

server.world.afterEvents.playerJoin

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";idsetup") {
    ev.cancel = true;
    if (ev.sender.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage("§7[NovaDefender] 権限がありません");
    }
    if (ev.sender.getDynamicProperty("nova:operator") == true) {
      ev.sender.sendMessage("§7[NovaDefender] IDを設定します");
      setdp("nova:b_id", 0);
    } else if (ev.sender.getDynamicProperty("nova:operator") == false) {
      ev.sender.sendMessage("§7[NovaDefender] 権限がありません");
    }
  }
});

function get_tps() {
  return tps_c;
}
server.system.run(() => {
  let nova_noitem_set_two = ["minecraft:tnt", "minecraft:lava_bucket"];
  setdp("nova_noitem", nova_noitem_set_two);
});

function getAE() {
  const overworld = server.world.getDimension("overworld").getEntities().length;
  const nether = server.world.getDimension("nether").getEntities().length;
  const end = server.world.getDimension("the_end").getEntities().length;
  const result = overworld + nether + end;
  return result;
}

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  const { damagingEntity } = ev;
  server.world.scoreboard.getObjective("nova:CPS")?.addScore(damagingEntity, 1);
  damagingEntity.setDynamicProperty("nova:tick", true);
});

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  const { player } = ev;
  player.setDynamicProperty("nova:tick", false);
});

server.system.runInterval(() => {
  const tick = server.world.scoreboard.getObjective("nova:tick");
  const cps = server.world.scoreboard.getObjective("nova:CPS");

  server.world.getPlayers().forEach((player) => {
    try {
      cps?.getScore(player);
    } catch {
      cps?.setScore(player, 0);
    }

    try {
      tick?.getScore(player);
    } catch {
      tick?.setScore(player, 0);
    }

    if (player.getDynamicProperty("nova:tick")) tick?.addScore(player, 1);
    const tickscore = tick?.getScore(player);

    if (tickscore && tickscore >= 20) {
      tick?.setScore(player, 0);
      player.setDynamicProperty("nova:tick", false);
      cps?.setScore(player, 0);
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

  return `${year} ${month} ${day} ${hours}:${minutes}:${seconds}`;
}

function getdp(id) {
  return server.world.getDynamicProperty(id);
}

function setdp(id, name) {
  server.world.setDynamicProperty(id, name);
}

server.world.afterEvents.playerJoin.subscribe((ev) => {
  ev.source.sendMessage(
    "§7このワールドはNovaDefender v1.0によって保護されています"
  );
});

server.system.runInterval(() => {
  if (ms == true) {
    msc++;
  }
});

// server.world.beforeEvents.chatSend.subscribe(ev => {
//   let player = ev.sender
//   if (ev.message.startsWith(";op ")) {
//     if ()
//   }

// })

server.system.run(() => {
  console.log(`[NovaDefender Anti-Cheat v1.0] effective completion (${msc}ms)`);
  ms = false;
  msc = 0;
  server.world.sendMessage("§7[NovaDefender v1.0] ワールド保護を開始します");
  if (!server.world.scoreboard.getObjective("nova:CPS")) {
    server.world.scoreboard.addObjective("nova:CPS");
  }
  if (!server.world.scoreboard.getObjective("nova:tick")) {
    server.world.scoreboard.addObjective("nova:tick");
  }
  setdp("nova:maxspeed", 2);
});

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  let player = ev.damagingEntity;
  let cps = server.world.scoreboard.getObjective("nova:CPS");
  let cpscount = cps?.getScore(player);
  if (cpscount > getdp("nova:cpsmax")) {
    server.world.sendMessage(
      `[§2NovaDefender§r] §4§lCPS detection §e>>§r§l 設定以上のCPSを検知しました\nname : ${player.name}\ncps : ${cpscount}`
    );
  }
});

let lastTickTime = Date.now();
let tps = 20; // 初期値

server.system.runInterval(() => {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTickTime;

  // 1秒ごとにTPSを計算
  if (deltaTime >= 1000) {
    tps = Math.round((1000 / deltaTime) * 20); // 1秒間のティック数を計算
    tps_c = tps;
    lastTickTime = currentTime;
  }
}, 20); // 20ティックごとに実行 (1秒間隔)

server.system.runInterval(() => {
  for (let player of server.world.getPlayers()) {
    const speed = getPlayerSpeed(player);
    if (speed > getdp("nova:maxspeed")) {
      server.world.sendMessage(
        `[§2§lNovaDefender§r] §4§lSpeed detection \n§r§lplayer : ${player.name}\n §r§lspeed : ${speed}`
      );
    }
  }
});

// server.system.runInterval(() => {
//   let nova_noitem = getdp("nova_noitem");

//   server.world.getAllPlayers().forEach((player) => {
//     const inventory = player.getComponent("minecraft:inventory").container;

//     for (let i = 0; i <= 8; i++) {
//       const itemId = inventory.getSlot(i)?.typeId;
//       if (nova_noitem.indexOf(itemId) !== -1) {
//         server.world.sendMessage(
//           `[§2NovaDefender§r] Warning. >> 禁止アイテムの所持を検出 \nName §4${
//             player.name
//           }\n§eTime §4${getjptime()}`
//         );
//         player.runCommand("clear @a " + itemId);
//       }
//     }
//   });
// });

server.world.afterEvents.playerPlaceBlock.subscribe((ev) => {
  let log = `[§2NovaDefender§r] placelogs ｜ ${ev.player.name} ${getjptime()} ${
    ev.block.location.x
  } ${ev.block.location.y} ${ev.block.location.z} ${ev.block.typeId}`;
  ev.player.runCommand(
    `tellraw @a[tag=nova_config] {"rawtext":[{"text":"${log}"}]}`
  );
  setdp(
    `p ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`,
    log
  );
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  if (
    ev.itemStack !== undefined &&
    ev.itemStack.nameTag == "nova:search.place"
  ) {
    return;
  }
  let log = `[§2NovaDefender§r]§4 breaklogs ｜ ${
    ev.player.name
  } ${getjptime()} ${ev.block.location.x} ${ev.block.location.y} ${
    ev.block.location.z
  } ${ev.block.typeId}`;

  setdp(
    `b ${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`,
    log
  );

  let id = getdp("nova:b_id");

  let logp = {
    player: `${ev.player.name}`,
    time: `${getjptime()}`,
    x: ev.block.location.x,
    y: ev.block.location.y,
    z: ev.block.location.z,
    block: ev.block.typeId,
    data: id,
  };

  setdp(`b ${id}`, logp);
  let id_n = id + 1;
  setdp("nova:b_id", id_n);
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  let nova_maxchatL = getdp("maxchatL");
  if (ev.message.length > nova_maxchatL) {
    ev.cancel = true;
    ev.sender.sendMessage(
      "§2§l[NovaDefender] §4 " +
        nova_maxchatL +
        "文字を超えたチャットを検知したため、チャットをキャンセルしました"
    );
  }
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";help") {
    ev.cancel = true;

    ev.sender.sendMessage(
      "§lNovaDefender コマンド一覧 \n;help コマンド一覧を表示\n;setting コントロールパネルを表示"
    );
  }
});

function command(command) {
  let player = server.world.getPlayers()[0];
  player.runCommandAsync(command);
}

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  let block = [
    "minecraft:bedrock",
    "minecraft:command_block",
    "minecraft:chain_command_block",
    "minecraft:repeat_command_block",
    "minecraft:structure_block",
    "minecraft:barrier",
    "minecraft:structure_void",
    "minecraft:allow",
    "minecraft:deny",
  ];
  if (
    block.indexOf(ev.block.typeId) !== -1 &&
    ev.player.getGameMode() !== "creative"
  ) {
    server.world.sendMessage(
      `[§2NovaDefender§r] §lillegal blocking §r§e>>§r §l不正なブロック破壊を検知しました\n§r§lModule: illegal blocking\nName: §4${ev.source.name}`
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
//nova:controlpanel form function
async function nova_hub(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(
    `\n\n §l--- world data --- \n\n 現在時刻 ${server.world.getTimeOfDay()}tick\n 現実時刻 ${getjptime()}\n プレイヤー人数 ${
      server.world.getAllPlayers().length
    }\n 合計エンティティ数 ${getAE()}\n TPS ${get_tps()}\n\n\n\n`
  );
  form.button("§lプレイヤーリスト / Player list");
  form.button("§lエンティティ数 / entity count");
  form.button("§l設定 / setting");
  form.button("§l破壊ログ検索");

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
          break_search(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

async function itemform(player, slot, playerdata) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");

  form.button("§l削除 / delete");

  form.show(player).then((response) => {
    if (response.canceled) {
      inventory(player);
      return;
    }

    switch (response.selection) {
      case 0:
        if (response.selection == 0) clearInventorySlot(playerdata.name, slot);
        break;
      default:
        inventory(player);
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
    console.log(`Player ${playerName} not found.`);
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

function cps_setting(player) {
  const form = new ui.ModalFormData();
  form.textField("§lCPSを入力してください", "例 : 50");
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

function all_pl(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:operator") == true) {
      form.button(`${player.name} \n §eoperator`);
    } else {
      form.button(`${player.name} \n member`);
    }
  });
  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      if (server.world.getPlayers()[response.selection] === undefined) {
        nova_hub(player);
        return;
      }
      let players = server.world.getPlayers()[response.selection];
      player_setting(player, players);
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function getentity(dimension) {
  return dimension.getEntities().length;
}

function getitem(dimension) {
  return dimension.getEntities({
    type: "minecraft:item",
  }).length;
}

function overworld_entity(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(
    `\nitem ${getitem(
      server.world.getDimension("minecraft:overworld")
    )}\nentity ${getentity(server.world.getDimension("minecraft:overworld"))}`
  );
  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          all_entity(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function nether_entity(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(
    `\nitem ${getitem(
      server.world.getDimension("minecraft:nether")
    )}\nentity ${getentity(server.world.getDimension("minecraft:nether"))}`
  );
  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          all_entity(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function end_entity(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(
    `\nitem ${getitem(
      server.world.getDimension("minecraft:the_end")
    )}\nentity ${getentity(server.world.getDimension("minecraft:the_end"))}`
  );
  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          all_entity(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function all_entity(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.button("§loverworld");
  form.button("§lnether");
  form.button("§lend");
  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          overworld_entity(player);
          break;
        case 1:
          nether_entity(player);
          break;
        case 2:
          end_entity(player);
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function setting(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(`§2§l項目を選択してください`);
  form.button("§l禁止アイテム設定 / Prohibited item setting");
  form.button("§lCPS制限設定 / CPS limit setting");

  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          noitem_setting(player);
          break;
        case 1:
          cps_setting(player);
          break;
        default:
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function checkAndClearTNT(player) {
  const inventory = player.getComponent("minecraft:inventory").container;

  for (let i = 0; i < inventory.size; i++) {
    const itemStack = inventory.getItem(i);
    if (itemStack == undefined) return;
    if (itemStack.typeId === "minecraft:tnt") {
      // プレイヤーに警告メッセージを表示
      player.sendMessage(
        "警告: あなたはTNTを持っています。アイテムをクリアします。"
      );

      inventory.setItem(i, null);
    }
  }
}

// 定期的にすべてのプレイヤーのインベントリをチェックする
server.system.runInterval(() => {
  const players = server.world.getPlayers();
  players.forEach((player) => {
    checkAndClearTNT(player);
  });
});

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

function inventory(player, players) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  getInventoryItems(players).forEach((item) => {
    form.button(
      `${item.itemStack.typeId}\n${item.itemStack.amount} ${item.itemStack.nameTag}`
    );
  });

  form.show(player).then((response) => {
    if (response.canceled) player_setting(player);
    let selectitem = getInventoryItems(players)[response.selection];

    itemform(player, selectitem.slot, players);
  });
}

function player_setting(player, players) {
  let playerdata = players;
  let dimension = players.dimension.id;
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.body(
    `§lName: ${playerdata.name} \nPermission: ${testplop(
      playerdata
    )} \nHealth: ${
      playerdata.getComponent("minecraft:health").currentValue
    }\nlocation: ${Math.floor(playerdata.location.x)} ${Math.floor(
      playerdata.location.y
    )} ${Math.floor(
      playerdata.location.z
    )} \ndimension: ${dimension}\ngamemode: ${getgamemode(
      playerdata
    )}\nplatform: ${playerdata.clientSystemInfo.platformType}\n`
  );
  form.button("§l権限設定 / Permission settings"); //0
  form.button("§lアビリティ設定 / Mute setting"); //1
  form.button("§lインベントリ"); //2
  form.button("§4§lプレイヤーをkick"); //3
  form.button("§4§lプレイヤーをban"); //4

  form
    .show(player)
    .then((response) => {
      // let selection = response.selection;
      // server.world.sendMessage(selection);
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
          let command = server.world.getPlayers()[0];
          command.runCommandAsync(
            `kick ${players.name} §lkicked By NovaDefender \n Type: kickcommand\nExecution Player: ${player.name}`
          );
          player.sendMessage(
            `[§2NovaDefender§r] ${players.name}をkickしました`
          );
        case 4:
          let commands = server.world.getPlayers()[0];
          commands.runCommandAsync(`tag ${players.name} add nova:ban`);
          player.sendMessage(`[§2NovaDefender§r] ${players.name}をbanしました`);
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

function getPlayerSpeed(player) {
  const velocity = player.getVelocity(); // プレイヤーの速度を取得
  const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2); // X, Zの速度のみ計算
  return speed;
}

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.sender.getDynamicProperty("nova:mute") == undefined) return;
  if (ev.sender.getDynamicProperty("nova:mute") == true) {
    ev.cancel = true;
    ev.sender.sendMessage("[§2NovaDefender§r] §4現在ミュートされています");
  }
});

async function player_permissoion_setting(player, typeplayer) {
  const form = new ui.ActionFormData()
    .button("§ladmin.")
    .button("§lcheat allow")
    .button("§lusual")
    .button("§lspect")

    .button("終了");

  // フォームの表示と結果の代入
  const res = await form.show(player);

  if (res.canceled) return;
  switch (res.selection) {
    case 0:
      typeplayer.setDynamicProperty("nova:operator", true);
      break;
    case 1:
      break;
    case 2:
      typeplayer.setDynamicProperty("nova:operator", false);

      break;
    case 4:
      player_setting(player);
    default:
      player_setting(player);
      break;
  }
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
  if (ev.message == ";setting") {
    ev.cancel = true;
    if (ev.sender.getDynamicProperty("nova:operator") == undefined) {
      ev.sender.sendMessage("§7[NovaDefender] 権限がありません");
    }
    if (ev.sender.getDynamicProperty("nova:operator") == true) {
      ev.sender.setDynamicProperty("setting_open", true);

      ev.sender.sendMessage("§7[NovaDefender] チャットを閉じてください");
    } else if (ev.sender.getDynamicProperty("nova:operator") == false) {
      ev.sender.sendMessage("§7[NovaDefender] 権限がありません");
    }
  }
});

server.world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.getDynamicProperty("nova:fixed") == true) {
    ev.cancel = true;
    server.world.sendMessage("test6");
  }
});

async function player_ability_setting(player, typeplayer) {
  let fixed_b = false;
  if (
    typeplayer.getDynamicProperty("nova:fixed") !== undefined ||
    typeplayer.getDynamicProperty("nova:fixed") !== false
  ) {
    fixed_b = true;
  } else {
    fixed_b = false;
  }
  const form = new ui.ModalFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.toggle("§lfixed", fixed_b);
  form.toggle("§lmuted");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        player_setting(player);
        return;
      }
      player.sendMessage("fixed : " + String(response.formValues[0]));
      player.sendMessage("muted : " + String(response.formValues[1]));
      if (response.formValues[0] == true) {
        typeplayer.setDynamicProperty("fixed", true);
        player.runCommandAsync(
          `inputpermission set ${typeplayer.name} movement disabled`
        );
      } else if (response.formValues[0] == false) {
        typeplayer.setDynamicProperty("fixed", false);

        player.runCommandAsync(
          `inputpermission set ${typeplayer.name} movement enabled`
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
    if (player.getDynamicProperty("nova:operator") == undefined) return;

    if (player.getDynamicProperty("nova:operator") == true) {
      return;
    } else if (player.getDynamicProperty("nova:creativepermit") !== undefined) {
      return;
    }

    if (player.getGameMode() == "creative") {
      server.world.sendMessage(
        `[§2NovaDefender§r] §lGamemode detection\n§r§lModule: §r§4Game mode detection\n§r§lName: §r§4${player.name}`
      );
      let command = server.world.getPlayers()[0];
      command.runCommandAsync(`gamemode s ${player.name}`);
    }
  });
});

//breaksearcher
function break_search(player) {
  const form = new ui.ModalFormData();
  form.title("§2§lNovaDefender break searcher from");
  form.textField("調べる座標を入力", "例 : 1 -1 5");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }
      player.sendMessage(
        "§2§l[NovaDefender] break searcher ログが見つかりました : " +
          getdp(`b ${String(response.formValues[0])}`)
      );
    })
    .catch((error) => {
      player.sendMessage("error : " + error);
    });
}

server.world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack.nameTag == "nova:searcher_b") {
    break_search(ev.source);
  }
});

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:ban") == undefined) return;
    if (player.getDynamicProperty("nova:ban") == true) {
      player.runCommandAsync(
        `kick ${player.name} §l§4kicked By NovaDefender §r\n §r§btype bancommand`
      );
    } else {
      return;
    }
  });
}, 40);

server.world.afterEvents.playerJoin.subscribe((ev) => {});

import * as server from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
let tps_c = 0;
let msc = 0;
let ms = true;
let v = "v3.0bata";

/**
 * @param {string} playerName
 * @param {string} itemId
 * @param {string} itemName
 * @param {number} amount
 */

function setLoreitem(playerName, itemId, itemName, amount = 1) {
  const player = server.world.getPlayers().find((p) => p.name === playerName);
  if (!player) return;

  const inventoryComp = player.getComponent("minecraft:inventory");
  if (!inventoryComp) return;

  const container = inventoryComp.container;

  // 新しいアイテムを作成
  const item = new server.ItemStack(itemId, amount);
  item.setLore([itemName]);

  for (let slot = 0; slot < container.size; slot++) {
    if (!container.getItem(slot)) {
      container.setItem(slot, item);
      break;
    }
  }
}

server.system.runInterval(() => {
  for (const dimension of ["overworld", "nether", "the_end"]) {
    const entities = server.world.getDimension(dimension).getEntities();

    for (const entity of entities) {
      if (
        entity.typeId === "minecraft:command_block_minecart" &&
        entity.hasTag("nova:respawn_complete") == false
      ) {
        let x = entity.location.x;
        let y = entity.location.y + 1;
        let z = entity.location.z;
        entity.teleport({ x: 0, y: -100, z: 0 });
        const newNpc = server.world
          .getDimension(dimension)
          .spawnEntity("minecraft:command_block_minecart", { x, y, z });
        newNpc.addTag("nova:respawn_complete");
      }
    }
  }
});

function itemNBTclear(player, item) {
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

server.system.runInterval(() => {
  let NBTclearitemlist = [
    "axolotl_bucket",
    "beehive",
    "bee_nest",
    "cod_bucket",
    "salmon_bucket",
    "pufferfish_bucket",
    "tropical_fish_bucket",
    "tadpole_bucket",
  ];

  NBTclearitemlist.forEach((item) => {
    server.world.getPlayers().forEach((player) => {
      itemNBTclear(player, item);
    });
  });
});

server.system.runInterval(() => {
  for (const dimension of ["overworld", "nether", "the_end"]) {
    const entities = server.world.getDimension(dimension).getEntities();

    for (const entity of entities) {
      if (
        entity.typeId === "minecraft:npc" &&
        entity.hasTag("nova:respawn_complete") == false
      ) {
        const { x, y, z } = entity.location;
        entity.teleport({ x: 0, y: -100, z: 0 });

        const newNpc = server.world
          .getDimension(dimension)
          .spawnEntity("minecraft:npc", { x, y, z });
        newNpc.addTag("nova:respawn_complete");
      }
    }
  }
});

// function RemoveNoclearNBT(player) {
//   const form = new ui.ModalFormData();
//   form.body("NBTclearブロックから削除するidを選択");
//   form
//     .show(player)
//     .then((response) => {
//       if (response.canceled) {
//         setting(player);
//         return;
//       }
//       let NBTclearblocklist = JSON.parse(getdp("nova:resetblock"));
//       for (let i = 0; i < NBTclearblocklist.length; i++) {
//         if (response.formValues[0] == i) {
//           let NBTclearblockremoveid = NBTclearblocklist[i];
//           NBTclearblocklist.splice(response.formValues[0], 1);
//           let resultclearNBTblock = NBTclearblocklist;
//           let resultclearNBTblockJson = JSON.stringify(resultclearNBTblock);
//           setdp("nova:noitem", resultclearNBTblockJson);
//           server.world.sendMessage(
//             `[§2NovaDefender§r] §l${NBTclearblockremoveid}をNBTclearブロックに追加しました`
//           );
//         }
//       }
//     })
//     .catch((error) => {
//       player.sendMessage("エラー: " + error.message);
//     });
// }

// function SetNoclearNBT(player) {
//   const form = new ui.ModalFormData();
//   form.textField("§lNBTをclearするブロックIDを入力", "例 : beehive");
//   form
//     .show(player)
//     .then((response) => {
//       if (response.canceled) {
//         setting(player);
//         return;
//       }
//       let NBTclearblocklist = JSON.parse(getdp("nova:resetblock"));
//       NBTclearblocklist.push(String(`minecraft:${response.formValues[0]}`));
//       let resultclearNBTblockJson = JSON.stringify(NBTclearblocklist);
//       setdp("nova:noitem", resultclearNBTblockJson);
//       server.world.sendMessage(
//         `[§2NovaDefender§r] §l${NBTclearblockremoveid}をNBTclearブロックに追加しました`
//       );
//     })
//     .catch((error) => {
//       player.sendMessage("エラー: " + error.message);
//     });
// }

function setmaxspeed(player) {
  const form = new ui.ModalFormData();
  form.textField("§l最大スピードを入力", " ");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        setting(player);
        return;
      }
      setdp("nova:maxspeed", String(response.formValues[0]));
      player.sendMessage(
        `[§2NovaDefender§r] §l最大スピードを §r§e${String(
          response.formValues[0]
        )} §r§lに変更しました`
      );
    })
    .catch((error) => {
      player.sendMessage("エラー: " + error.message);
    });
}

server.system.runInterval(() => {
  if (getdp("nova:maxspeed") == undefined) {
    setdp("nova:maxspeed", 2);
  }
});

server.system.runInterval(() => {
  if (getdp("nova:resetblock") == undefined) {
    setdp(
      "nova:resetblock",
      JSON.stringify([
        "minecraft:beehive",
        "minecraft:bee_nest",
        "minecraft:moving_block",
      ])
    );
  }
});

function blockNBTreset(block) {
  let id = block.typeId;
  let undetectable_block = JSON.parse(getdp("nova:resetblock"));
  if (undetectable_block.indexOf(id) == -1) return;
  block.setPermutation(server.BlockPermutation.resolve("minecraft:air"));
  server.system.runTimeout(() => {
    block.setPermutation(server.BlockPermutation.resolve(id));
  }, 1);
}

server.world.afterEvents.playerPlaceBlock.subscribe((ev) => {
  blockNBTreset(ev.block);
});

/**
 * ミリ秒を秒に変換する関数
 * @param {number} milliseconds - ミリ秒
 * @returns {number} 秒
 */

function millisecondsToSeconds(milliseconds) {
  return milliseconds / 1000;
}

const playerCooldowns = new Map();
const cooldownTime = 1000;

function sendChat(playerName, message) {
  let maxchatL = 50;
  let player = getPlayerByName(playerName);
  const currentTime = Date.now();
  if (message.length > maxchatL) {
    player.sendMessage(
      `§7[Chat] チャットの文字数が多すぎます。(${message.length}chars)`
    );
    return;
  }
  if (
    playerCooldowns.has(playerName) &&
    currentTime < playerCooldowns.get(playerName) + cooldownTime
  ) {
    player.sendMessage(
      `§7[Chat] チャットの送信間隔が短いです。 (CT${millisecondsToSeconds(
        cooldownTime
      )}s)`
    );
    return;
  }

  // クールタイムが終了している場合、チャットを送信
  playerCooldowns.set(playerName, currentTime);
  server.world.sendMessage(`<${playerName}> ${message}`);
}

server.system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id == "nova:time_reset") {
    setdp(`nova:play_time ${getjpday()} ${ev.sourceEntity.name}`, 0);
    setdp(`nova:play_all_time ${ev.sourceEntity.name}`, 0);
    ev.sourceEntity.sendMessage(
      `§7[NovaDefender] プレイ時間のリセットが完了しました。`
    );
  }
});

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

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";setting") return;
  ev.cancel = true;
  sendChat(ev.sender.name, ev.message);
});

async function Noitemsetting(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  form.button("§l追加 / Add.");
  form.button("§l削除 / Delete.");
  form.button("§l戻る / return.");

  form
    .show(player)
    .then((response) => {
      player.setDynamicProperty("setting_open", false);
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
          server.world.sendMessage(
            `[§2NovaDefender§r] §l${Noitemremoveid}を禁止アイテムから削除しました`
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
  player.runCommandAsync(command);
}

server.system.runInterval(() => {
  if (getdp("nova:noitem") === undefined)
    setdp("nova:noitem", JSON.stringify(["minecraft:tnt"]));
});

server.system.runInterval(() => {
  let Noitem = JSON.parse(getdp("nova:noitem"));

  Noitem.forEach((item) => {
    let command = server.world.getPlayers()[0];
    command.runCommandAsync(
      `tag @a[hasitem={item=${item}}] add nova:nohasitem_${item}`
    );
    command.runCommandAsync(
      `tag @a[hasitem={item=${item}, quantity=..0}] remove nova:nohasitem_${item}`
    );
  });
});

server.system.runInterval(() => {
  let Noitem = JSON.parse(getdp("nova:noitem"));
  Noitem.forEach((item) => {
    let players = server.world.getPlayers({ tags: [`nova:nohasitem_${item}`] });
    players.forEach((player) => {
      command("clear @a " + item);
      server.world.sendMessage(
        `[§2NovaDefender§r] §4§l禁止アイテムの所持を検知しました。\n§r§lModule: NoItemCheck\n§r§lName: ${player.name}\n§r§lItem: ${item}`
      );
      command("execute as @a at @s run playsound random.orb @a ~ ~ ~ 1 2 1");
    });
  });
}, 5);

function Noitemsetting_form(player) {
  const form = new ui.ModalFormData();
  form.textField("§lアイテムidを入力してください", "例 : tnt");
  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }
      if (response.formValues[0] === "") {
        server.world.sendMessage("§7空白のためキャンセルされました");
        return;
      }
      let Noitem = JSON.parse(getdp("nova:noitem"));
      Noitem.push(String(`minecraft:${response.formValues[0]}`));
      setdp("nova:noitem", JSON.stringify(Noitem));
      server.world.sendMessage(getdp("nova:noitem"));
      player.sendMessage(
        "[§lNovaDefender§r] §l" +
          String(response.formValues[0]) +
          "を禁止アイテムに追加しました。"
      );
    })
    .catch((error) => {
      player.sendMessage(
        "[§2NovaDefender§r] §4§lerrormanager ｜ " + error.message
      );
    });
}

function getPlayerByName(targetName) {
  return server.world.getPlayers({ name: targetName })[0];
}

server.world.beforeEvents.playerLeave.subscribe((ev) => {
  let player = getPlayerByName(ev.playerName);
  if (getdp("nova:logoutc") == undefined) setdp("nova:logoutc", 0);
  setdp(
    `nova:logout ${getdp("nova:logoutc")}`,
    `${player.name} ${getjptime()}`
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

server.world.beforeEvents.chatSend.subscribe((ev) => {
  let op = server.world.getPlayers({ tags: ["novadefender:operator"] });
  op.forEach((op) => {
    op.setDynamicProperty("nova:operator", true);
  });
});

function getdp(id) {
  return server.world.getDynamicProperty(id);
}

function setdp(id, name) {
  server.world.setDynamicProperty(id, name);
}

server.system.run(() => {
  if (getdp("nova:login") == undefined) setdp("nova:login", [""]);
});

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  if (ev.initialSpawn) {
    const player = ev.player;
    player.sendMessage(
      "§7このワールドにはNovaDefender AntiCheat " + v + "が導入されています"
    );

    if (getdp(`nova:loginc`) == undefined) setdp(`nova:loginc`, 0);

    let loginc = getdp(`nova:loginc`);
    setdp(`nova:loginc`, loginc + 1);
    setdp(`nova:login ${loginc}`, `${player.name} ${getjptime()}`);
  }
});

function getlogout() {
  let item = [];
  for (let i = 0; i < getdp(`nova:logoutc`); i++) {
    item.push(getdp(`nova:logout ${i}`));
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

function logout(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  getlogout(player).forEach((item) => {
    form.button(`§rlogout ${item}`);
  });

  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      if (server.world.getPlayers()[response.selection] === undefined) {
        log(player);
        return;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

function login(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");
  getlogin(player).forEach((item) => {
    form.button(`§rlogin ${item}`);
  });

  form.button("戻る");
  form
    .show(player)
    .then((response) => {
      if (server.world.getPlayers()[response.selection] === undefined) {
        log(player);
        return;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

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
  if (!ev.damagingEntity.typeId == "player") return;

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

server.system.runInterval(() => {
  if (ms == true) {
    msc++;
  }
});

server.system.run(() => {
  console.log(`[NovaDefender Anti-Cheat ${v}] effective completion (${msc}ms)`);
  ms = false;
  msc = 0;
  server.world.sendMessage(
    "§7[NovaDefender " + v + "] ワールド保護を開始します"
  );
  if (!server.world.scoreboard.getObjective("nova:CPS")) {
    server.world.scoreboard.addObjective("nova:CPS");
  }
  if (!server.world.scoreboard.getObjective("nova:tick")) {
    server.world.scoreboard.addObjective("nova:tick");
  }
});

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  if (!ev.damagingEntity.typeId == "player") return;
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
      const { x, y, z } = player.location;
      player.teleport({ x, y, z }, { checkForBlocks: false });

      player.runCommandAsync("inputpermission set @s movement disabled");
      server.system.runTimeout(() => {
        player.runCommandAsync("inputpermission set @s movement enabled");
      }, 5);
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
});

server.world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message == ";help") {
    ev.cancel = true;

    ev.sender.sendMessage(
      "§lNovaDefender コマンド一覧 \n;help コマンド一覧を表示\n;setting コントロールパネルを表示"
    );
  }
});

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

async function log(player) {
  const form = new ui.ActionFormData();
  form.title("§2§lNovaDefender controlpanel");

  form.button("§lログイン履歴 / Login History");
  form.button("§lログアウト履歴 / Logout History");
  form.button("§l破壊ログ検索 / Break Logsearch");
  form.button("§l設置ログ検索 / Place Logsearch");

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
        default:
          nova_hub(player);
          break;
      }
    })
    .catch((error) =>
      player.sendMessage("An error occurred: " + error.message)
    );
}

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
  form.button("§lログ / log");

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
      player.sendMessage("[§lNovaDefender§r] §llogが見つかりました。 " + log);
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
  form.button("Noitem");
  form.button("maxcps");
  form.button("maxspeed");

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
          cps_setting(player);
          break;
        case 2:
          setmaxspeed(player);
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
    )}\nplatform: ${
      playerdata.clientSystemInfo.platformType
    }\nplaytime (${getjpday()}): ${getdayplay_time(
      players,
      getjpday()
    )}\nworldplaytime (all): ${getall_worldplay_time(players)}`
  );
  form.button("§l権限設定 / Permission settings"); //0
  form.button("§lアビリティ設定 / ability setting"); //1
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
          if (response.selection === 3) {
            let command = server.world.getPlayers()[0];
            command.runCommandAsync(
              `kick ${players.name} §lkicked By NovaDefender \n Type: kickcommand\nExecution Player: ${player.name}`
            );
            player.sendMessage(
              `[§2NovaDefender§r] ${players.name}をkickしました`
            );
          }

        case 4:
          if (response.selection === 4) {
            let commands = server.world.getPlayers()[0];
            commands.runCommandAsync(`tag ${players.name} add nova:ban`);
            player.sendMessage(
              `[§2NovaDefender§r] ${players.name}をbanしました`
            );
          }

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
  form.title("§2§lNovaDefender controlpanel");
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
    if (
      getdp("nova:creative_d") !== true ||
      getdp("nova:creative_d") === undefined
    )
      return;
    if (
      player.getDynamicProperty("nova:operator") == true ||
      player.getDynamicProperty("nova:operator") !== undefined
    ) {
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
    player.setDynamicProperty("nova:ban", false);
  });
});

server.system.runInterval(() => {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:ban") == undefined) return;
    if (player.getDynamicProperty("nova:ban") == true) {
      if (player.getDynamicProperty("nova:unban")) {
        player.setDynamicProperty("nova:ban", false);
      } else if (player.getDynamicProperty("nova:ban") == true) {
        player.runCommandAsync(
          `kick ${player.name} §l§4kicked By NovaDefender`
        );
      }
    } else {
      return;
    }
  });
}, 40);

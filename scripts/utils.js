import * as server from "@minecraft/server";

export function senderror(player, reason) {
  if (reason == "nopermission") {
    player.sendMessage(
      `[§a§lNovaDefender§r] §cerror: 404 permission undefined`
    );
  } else if (reason == "noplayer") {
    player.sendMessage(`[§a§lNovaDefender§r] §cerror: 404 player undefined`);
  } else if (reason == "noselector") {
    player.sendMessage(`[§a§lNovaDefender§r] §cerror: selector not available`);
  } else if (reason == "nobanself") {
    player.sendMessage(`[§a§lNovaDefender§r] §cerror: You can't ban yourself.`);
  } else if (reason == "nokickself") {
    player.sendMessage(
      `[§a§lNovaDefender§r] §cerror: You can't kick yourself.`
    );
  }
}

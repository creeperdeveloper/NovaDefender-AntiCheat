import * as server from "@minecraft/server";

export function worldnotfi(text) {
  server.world.sendMessage(`[§a§lNovaDefender§r] ${text}`);
}

export function opnotfi(text) {
  server.world.getPlayers().forEach((player) => {
    if (player.getDynamicProperty("nova:operator") == true) {
      player.sendMessage(`[§aNovaDefender§r] ${text}`);
    }
  });
}

export function getallplayer() {
  return server.world.getPlayers();
}

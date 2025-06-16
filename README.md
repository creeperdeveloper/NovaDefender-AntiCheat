# NovaDefender AntiCheat for Bedrock

### **Thank you for downloading!**

---

## About this Addon / このアドオンについて

This addon is an anti-cheat tool designed for Minecraft Bedrock Edition.

このアドオンはマインクラフト統合版向けに作られたアンチチートアドオンです。

---

## Main Features / 主な機能

- Configuration via UI  
- Detection of prohibited items in inventory  
- Removal of prohibited entities  
- Speed limit settings  
- Killaura detection  
- Detection of cbe / nbt modifications  
- Over-enchantment detection  
- Block break logs  
- Block place logs (liquid placement is not supported)  

-----------------------------------------------

- UI上でのアドオンの設定  
- 禁止アイテムの所持検知  
- 禁止エンティティの削除  
- 上限速度の設定  
- Killaura検知  
- cbe / nbtの検知  
- オーバエンチャントの検知  
- 破壊ログ  
- 設置ログ（液体は非対応）  

---

## Terms of Use / 利用規約

- Modification of the addon is prohibited.  
- Server installation (untested) is allowed.  
- Redistribution of the addon is prohibited.  
- No responsibility is taken for any damages caused by this addon.  
- Streaming and video content creation is permitted.  
- When posting videos related to NovaDefender, please include a link in the description if possible.  

- アドオンの改造は禁止です。  
- サーバー導入（未検証）は可能です。  
- アドオンの二次配布は禁止です。  
- このアドオンによって発生した損害については一切の責任を問いません。  
- 配信はOKです。  
- NovaDefenderに関連する動画を投稿する場合は、できれば概要欄にリンクを張ってほしいです。  

---

## License / ライセンス

GP3 License (Modified MIT with Attribution and Patent Grant)

Copyright (c) 2025 creeper_dev

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

2. When redistributing or publicly displaying the Software or any derivative works,  
you must include the following attribution information clearly and prominently:

- Author: creeper_dev  
- Reference: NovaDefender AntiCheat  
- URL: https://minecraft-mcworld.com/147025/

3. The Software is provided "as is", without warranty of any kind, express or implied,  
including but not limited to the warranties of merchantability, fitness for a  
particular purpose, and noninfringement.

4. You agree not to assert or enforce any patent claims against any party  
for using the Software or derivative works thereof.

---

## Notes / 注意事項

- This addon is in beta. Malfunctions may occur.  
- It is recommended to back up your world before use.  

- このアドオンはベータ版です。何かしらの誤作動がある可能性があります。  
- 誤作動がある場合があるので、ワールドバックアップを取ることを推奨します。  

---

## Usage / 使い方

Before installing in your world, enable Education Edition, Beta API, and future Creator Features.

After installation, run `function nova/start`. A setup form will appear; follow the instructions to gain operator permissions.  
Use `;help` to display the command list!

*Note:* NovaDefender operator permissions are separate from Minecraft operator permissions.  
*Note:* The default command prefix is `;`. Use `;op` to execute the op command.  
*Note:* Player names with spaces do not require quotation marks.

---

## Commands / コマンド

- `help`  
  Displays the list of commands.

- `data [player: String]`  
  Shows information of the specified player. If no player is specified, shows info of the command executor. Operator-only command.

- `op [player: String]`  
  Grants operator permissions to the specified player. Operator-only command.

- `deop [player: String]`  
  Revokes operator permissions from the specified player. If no player is specified, the executor is targeted. Operator-only command.

- `item`  
  Obtains the item to open the settings UI.

- `setting`  
  Opens the settings UI. Please close chat immediately after running. Operator-only command.

- *etc...*  
  More commands available. Use the addon's `help` command for details.

---

## Changelog / 変更履歴

v1.2.3 (including updates since v1.0.0)

- Some addon commands now support slash commands.  
- Player info screen allows game mode changes.  
- `command` command added to execute commands from NovaDefender.  
- Inventory rewrite features added: clear all and clear ender chest all.  
- Published on Crafters Colony.

---

If you find any typos, bugs, or have feature requests, please leave a comment!

*Note:* Ban functionality is under development. Please wait for future updates.

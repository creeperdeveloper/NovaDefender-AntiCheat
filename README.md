### Thank you for downloading!


# NovaDefender AntiCheat for Bedrock


## このアドオンについて / About this addon

このアドオンはマインクラフト統合版向けに作られたアンチチートアドオンです。

--------------------------------------------

This addon is an anti-cheat tool designed for Minecraft Bedrock Edition.

## 主な機能 / Main Features

- UI上でのアドオンの設定  
- 禁止アイテムの所持検知  
- 禁止エンティティの削除  
- 上限速度の設定  
- Killaura検知  
- cbe / nbtの検知  
- オーバエンチャントの検知  
- 破壊ログ  
- 設置ログ（液体は非対応）

--------------------------------------------

- Configuration via UI  
- Detection of prohibited items in inventory  
- Removal of prohibited entities  
- Speed limit settings  
- Killaura detection  
- Detection of cbe / nbt modifications  
- Over-enchantment detection  
- Block break logs  
- Block place logs (liquid placement is not supported)

## 利用規約 / Terms of Use

- アドオンの改造は禁止です。  
- サーバー導入（未検証）は可能です。  
- アドオンの二次配布は禁止です。  
- このアドオンによって発生した損害については一切の責任を問いません。  
- 配信はOKです。  
- NovaDefenderに関連する動画を投稿する場合はできれば概要欄にリンクを張ってほしいです。

--------------------------------------------

- Modification of the addon is prohibited.  
- Server installation (untested) is allowed.  
- Redistribution of the addon is prohibited.  
- No responsibility is taken for any damage caused by this addon.  
- Streaming and content creation are allowed.  
- If posting videos related to NovaDefender, please include a link in the description if possible.

## ライセンス / License

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

## 注意事項 / Precautions

- このアドオンはベータ版です。何かしらの誤作動がある可能性があります。  
- 誤作動がある場合があるので、ワールドバックアップを取ることを推奨します。

--------------------------------------------

- This addon is in beta and may have some malfunctions.  
- It is recommended to back up your world before use due to possible errors.



## 使い方 / How to use

ワールドに導入する前に、Education Edition、ベータAPI、今後のクリエイター機能を有効にしてください。

ワールドに導入したら、function nova/start を実行してください。セットアップフォームが表示され、画面に従うとオペレーター権限が付与されます。  
`;help` でコマンドリストを表示可能です！

- NovaDefenderのオペレーター権限とマインクラフトのオペレーター権限は別です。  
- 初期状態のprefixは `;` です。`op` コマンドを使いたい場合は `;op` と実行してください。  
- 空白のあるプレイヤー名を指定する際は、`""` は不要です。

--------------------------------------------

Before adding to your world, enable Education Edition, Beta API, and upcoming Creator features.

After installation, run `function nova/start`. A setup form will appear, and following it grants operator permissions.  
Use `;help` to display the command list!

- NovaDefender operator permissions are separate from Minecraft operator permissions.  
- The default command prefix is `;`. Use `;op` to run the op command.  
- Player names with spaces do not require quotes.


## コマンド / Command

- `help`  
  コマンドリストを表示します。

- `data [player: String]`  
  指定したプレイヤーの情報を表示します。指定しない場合は実行者の情報が表示されます。管理者専用。

- `op [player: String]`  
  指定したプレイヤーにオペレーター権限を付与します。管理者専用。

- `deop [player: String]`  
  指定したプレイヤーからオペレーター権限を奪います。指定なしなら実行者が対象。管理者専用。

- `item`  
  設定UIを開くアイテムを取得します。管理者専用。

- `setting`  
  設定UIを表示します。実行後チャットを閉じてください。管理者専用。
  
--------------------------------------------

- `help`  
  Displays the command list.

- `data [player: String]`  
  Shows information of the specified player. Shows executor’s info if none specified. Admin only.

- `op [player: String]`  
  Grants operator permissions to the specified player. Admin only.

- `deop [player: String]`  
  Removes operator permissions from the specified player. If none specified, affects executor. Admin only.

- `item`  
  Gets the item to open the settings UI. Admin only.

- `setting`  
  Opens the settings UI. Close chat after running. Admin only.

## 変更履歴 / ChangeLog

v1.2.3 (実際はv1.0.0から)

- 一部コマンドがスラッシュコマンド対応。  
- プレイヤー情報画面からゲームモード変更可能に。  
- `command` コマンドでNovaDefenderからコマンド実行可能に。  
- インベントリ書き換え機能に全クリア、エンダーチェスト全クリアを追加。  
- クラフターズコロニーに公開。

バグ報告や機能要望は歓迎です。  

--------------------------------------------

v1.2.3 (Actually since v1.0.0)

- Some commands now support slash commands.  
- Game mode can be changed from the player info screen.  
- Commands can be executed from NovaDefender via the `command` command.  
- Added inventory clear and ender chest clear functions.  
- Published on Crafters Colony.

Bug reports and feature requests are welcome.

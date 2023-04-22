# ブルブルアニメーションジェネレータ

入力した画像に対して、手書きアニメのような線がブルブルと震えるエフェクトを掛けて出力できる、ブラウザ向けツールです。

開発については [app の README](./packages/app/README.md) をご確認ください。

## 謝辞

本ツールのアイデア、及び画像加工に関するアルゴリズムは [wwwshwww](https://github.com/wwwshwww) さん作 [Tegaki Animation Generator](https://github.com/wwwshwww/tegaki_animation_generator) より、連絡の上お借りすることをご快諾いただいたものです。ここに感謝及び御礼の意を示します。

## 問い合わせ

本ツールの不具合報告等は、Issue を作成していただくか、white.luckers at gmail.com (at をアットマークに修正してください)までお願いします。

## ライセンス

- `/packages/app/public/static_images/` 以下の画像: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- `/packages/app/`
  - `public/opencv.js`: [Apache-2.0](https://github.com/opencv/opencv/blob/4.x/LICENSE)
  - `src/processor/worker/encoder/pnnQuant.mjs`: [MPL 2.0](https://github.com/mcychan/PnnQuant.js/blob/master/LICENSE)

上記以外の本リポジトリに含まれているファイルについては、ファイル内に特に記載がない場合、 [LICENSE](./LICENSE) にあるとおり MIT ライセンスの下で利用できます。

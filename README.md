
目標功能

查詢 是 一次觀看 plc 的 部分記憶體
所以 查詢的部分 輸入 group  一次回傳多個 記憶體

tagNameGroupMapDict 就記載所有 group 的地方

寫入 一次寫一個 記憶體




一個 幫忙 詢問 plc 的 套件

在 app.ts 可以設定 node 的 port 目前是 5001

在 plc-collector.ts 可以輸入 目標 plc 的 ip 跟 port

在 plc-collector.ts 可以增加 很多個 group 供查詢


查詢(post)
localhost:5000/product/read

body
{
	"group": "groupB"
}

修改(post)
localhost:5001/plc/write

body
{
	"tagName": "X1",
	"value": true
}

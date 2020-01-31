
var mc = require('./../mcprotocol');

export class PlcCollector {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    connection = new mc;

    connect() {
        this.connection.initiateConnection({
            port: 1026,
            host: '10.1.1.39',
            ascii: false
        }, (error) => { this.didConnect(error) })
    }

    private didConnect(error) {
        if (error) {
            console.log(error)
            setTimeout(() => {
                this.connect();
            }, 3000);
            return;
        }

        // 設定 tag 名稱 轉換表
        this.connection.setTranslationCB(tagName => {
            return this.tagName2RegisterAddress(tagName);
        });

        console.log('PLC did connect')

        // 讀取特定 群組
        // this.readGroup('groupA');
    }


    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // 名稱處理
    tagNameGroupMapDict = {
        groupA: {
            "Target CT": "D0001",
            "Target Parts": "D0002",
            "Last CT": "D0003",
            "Best CT": "D0004",
        },
        groupB: {
            "Average CT": "D0007",
            "Parts Out": "D0009",
            "CT Variance": "D0011",
            "X1": "X1",
            "X2": "X2",
            "X3": "X3",
            "X4": "X4",
        },

        // 官方的測試
        // https://github.com/plcpeople/mcprotocol
        formats: {
            TEST1: 'D0,5', 	            //v 5 words starting at D0 >> [0,0,0,0,22]
            TEST2: 'M6990,28', 			//v 28 bits at M6990 >> [false, ..., false]
            TEST3: 'CN199,2',			//x ILLEGAL as CN199 is 16-bit, CN200 is 32-bit, must request separately 錯誤的範例
            TEST4: 'R2000,2',			//x 2 words at R2000
            TEST5: 'X034',				//v Simple input >> false
            TEST6: 'D6000.1,20',	    //v 20 bits starting at D6000.1 >> [false, ..., false]
            TEST7: 'D6001.2',			//v Single bit at D6001 >> false
            TEST8: 'S4,2',				//x 2 bits at S4
            TEST9: 'RFLOAT5000,40'		//x 40 floating point numbers at R5000
        },
        formats2: {
            TEST1: 'D0,5', 	            //v 5 words starting at D0 >> [0,0,0,0,22]
            TEST2: 'M6990,28', 			//v 28 bits at M6990 >> [false, ..., false]
            TEST5: 'X034',				//v Simple input >> false
            TEST6: 'D6000.1,20',	    //v 20 bits starting at D6000.1 >> [false, ..., false]
            TEST7: 'D6001.2',			//v Single bit at D6001 >> false
        },
        irr: {
            M0: 'M0',
            M1: 'M1',
            D100: 'D100', //所有整數 可正負
            D101: 'D101',
            D100101: 'D100,2',
            X1: 'X1',
        },
        tt: {
            M3210: 'M3210', // M3210-3219
            D3210: 'D3210', // D3210-3229
            ALLM: 'M3210,10',
            ALLD: 'D3210,20',
        },
        yc: {
            D100: 'D100', // 整數
            // D101: 'D101', // 整數
            // D100101: 'D100,2', // 兩個整數
            // DFLOAT100: 'DFLOAT100', // 浮點數

            // DFLOAT102: 'DFLOAT102', // 浮點數

            // D104_2: 'D104.5',
            // B0001: 'B0001', // 這個沒有
            // X1: "X1",
            // Y1: "Y1",
            W100: 'W100,1',
 
        },     
    }

    // 把 每個 group 放一起
    tagNameMapDict = (() => {
        let result = {}
        Object.keys(this.tagNameGroupMapDict).map(groupName => {
            let group = this.tagNameGroupMapDict[groupName];
            result = Object.assign(result, group);
        })
        return result;
    })()

    // "CT Variance" > "D0011"
    private tagName2RegisterAddress(tagName: string) {
        return this.tagNameMapDict[tagName];
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    // 需要用計時器 來 重複啟動
    lastItems = {};
    lastGroup;
    async readGroup(name: string) {

        if (Object.keys(this.tagNameGroupMapDict).indexOf(name) < 0) {
            console.log("Group key not found");
            return {}
        }

        let data = await new Promise((resolve, reject) => {

            // 如果一直移除 重加 會出現 三次成功一次的情況
            if (this.lastGroup != name) {
                this.connection.removeItems(this.lastItems);
                this.lastItems = Object.keys(this.tagNameGroupMapDict[name])
    
                this.connection.addItems(this.lastItems);
                this.lastGroup = name;
            }
            
            this.connection.readAllItems((error, values) => {

                if (error) {
                    console.log("SOMETHING WENT WRONG READING VALUES!!!!");
                    reject(error);
                    return;
                }

                // 從 values 拿到資料
                // 看要怎樣 call api
                // console.log(values);
                resolve(values);
            });
        });

        return data;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    //0 正常 1 plc 錯誤 2 找不到key
    async write(tagName, value) {

        // 排除沒有再對照表
        if (Object.keys(this.tagNameMapDict).indexOf(tagName) < 0) {
            console.log("TagName not found");
            return { code: 2, msg: "TagName not found" };
        }

        let result = await new Promise((resolve, _) => {
            this.connection.writeItems(tagName, value, resolve);
        });

        console.log(result);
        if (result) {
            // result 有值代表錯誤
            return { code: 1, msg: result };
        }

        return { code: 0, msg: "success" };
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}
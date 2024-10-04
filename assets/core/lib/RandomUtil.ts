
/**
 * Predefined variables
 * Name = RandomUtil
 * DateTime = Thu Jan 13 2022 22:20:53 GMT+0800 (中国标准时间)
 * Author = dream93
 * FileBasename = RandomUtil.ts
 * FileBasenameNoExtension = RandomUtil
 * URL = db://assets/libs/util/RandomUtil.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export module RandomUtil {

    /**
     * 生成[0, max)的随机数
     * @param max 
     * @returns 
     */
    export function random(min: number, max?: number) {
        if (!max) {
            max = min;
            min = 0;
        }
        return min + Math.random() * (max - min);
    }

    /**
     * 生成[0, max) 不包括max的随机整数
     * @param max 
     * @returns 
     */
    export function randomInt(min: number, max?: number) {
        return Math.floor(random(min, max));
    }

/**
     * 生成[0, max(不包含))的 count 个随机整数
     * @param max 
     * @returns 
     */
    export function randomArr(min:number,max:number,count:number){
            var numList = [];
            var numMin = min;
            var numMax = max - 1;//不包括最大值
            var listLen = numMax - numMin + 1;
    
            var outPut = [];
    
            // 将所有数顺序装填到数字列表中
            for (var i = numMin; i < numMax + 1; i++) {
                numList.push(i);
            }
    
            var randNum;
            for (var j = 0; j < count; j++) {
                // 产生一个小于列表长度的随机数randNum
                randNum = Math.floor(Math.random() * listLen);
                // 将列表的第randNum项输出
                outPut.push(numList[randNum]);
                // 将列表的最后一项替换到刚被取出的数的位置
                numList[randNum] = numList[listLen - 1];
                // 列表长度减一,即列表最后一项不会再被取到;
                listLen--;
            }
    
            return outPut;
    }
}
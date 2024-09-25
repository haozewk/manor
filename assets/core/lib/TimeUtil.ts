export module TimeUtil {
    // 十二时辰按照地支，十二属相排列
    let tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    // 十二时辰对应
    let sdArr = ['夜半', '鸡鸣', '平旦', '日出', '食时', '隅中', '日平', '日昳', '晡时', '日入', '黄昏', '人定']
    // 一个时辰为八刻
    let skArr = ['一', '二', '三', '四', '五', '六', '七', '八']

    // 默认获取当前时辰，时刻

    export function calculateShichen(h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds()) {
        let _m = (m / 15).toString();
        let _h = "";
        let _hs = "";
        switch (h) {
            case 23:
            case 0:
                _h = tzArr[0];
                _hs = sdArr[0];
                break;
            case 1:
            case 2:
                _h = tzArr[1];
                _hs = sdArr[1];
                break;

            case 3:
            case 4:
                _h = tzArr[2];
                _hs = sdArr[2];
                break;

            case 5:
            case 6:
                _h = tzArr[3];
                _hs = sdArr[3];
                break;

            case 7:
            case 8:
                _h = tzArr[4];
                _hs = sdArr[4];
                break;

            case 9:
            case 10:
                _h = tzArr[5];
                _hs = sdArr[5];
                break;

            case 11:
            case 12:
                _h = tzArr[6];
                _hs = sdArr[6];
                break;

            case 13:
            case 14:
                _h = tzArr[7];
                _hs = sdArr[7];
                break;

            case 15:
            case 16:
                _h = tzArr[8];
                _hs = sdArr[8];
                break;

            case 17:
            case 18:
                _h = tzArr[9];
                _hs = sdArr[9];
                break;

            case 19:
            case 20:
                _h = tzArr[10];
                _hs = sdArr[10];
                break;

            case 21:
            case 22:
                _h = tzArr[11];
                _hs = sdArr[11];
                break;

        }
        let ke = "";
        if (h % 2 === 0) {
            ke = skArr[parseInt(_m) + 4]
        } else if (h % 2 === 1) {
            ke = skArr[parseInt(_m)]
        }
        return {
            h: _h+"时",
            hs: _hs,
            ke:ke+"刻"

        }
    }


}
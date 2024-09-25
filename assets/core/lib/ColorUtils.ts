import { Color } from "cc";

/**
 *
 * @file ColorUtils.ts
 * @author self
 * @description 颜色转换方案
 *
 */
export module ColorUtils {

    //RGB To Code
    export function RGBToCode($1, $2, $3) {
        return '#' + ('0' + (+$1).toString(16)).slice(-2) + ('0' + (+$2).toString(16)).slice(-2) + ('0' + (+$3).toString(16)).slice(-2);
    }
    //Code To RGB
    export function CodeToRGB(code) {
        let result = [];
        result.push(parseInt(code.substring(1, 3), 16));
        result.push(parseInt(code.substring(3, 5), 16));
        result.push(parseInt(code.substring(5), 16));
        return result;
    }

    //sRgb to hex
    export function rgb2hex(sRGB) {
        return sRGB.replace(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)$/, function ($0, $1, $2, $3) {
            return '#' + ('0' + (+$1).toString(16)).slice(-2) + ('0' + (+$2).toString(16)).slice(-2) + ('0' + (+$3).toString(16)).slice(-2);
        });
    }
    /**
    
     * 将颜色置灰 返回一个新对象
    
     * @param color
    
     */

    export function colorToGrayScale(color: Color) {

        if (!color) return;

        const gray = color.r * 0.3 + color.g * 0.59 + color.b * 0.11;

        return new Color(gray, gray, gray);

    }
    /**
  
  * 随机获取rgb
 
  */


    export function GetRandomRGB(min = 0, max = 255) {
        //颜色对象
        let r = Math.floor(min + Math.random() * (max - min));
        let g = Math.floor(min + Math.random() * (max - min));
        let b = Math.floor(min + Math.random() * (max - min));

        return { r, g, b }
    }

    export function GeneratePastelColor(n = 100) {
        let R = Math.floor((Math.random() * 127) + n);
        let G = Math.floor((Math.random() * 127) + n);
        let B = Math.floor((Math.random() * 127) + n);

        // let rgb = (R << 16) + (G << 8) + B;
        //  `#${rgb.toString(16)}`;
        return { r: R, g: G, b: B };
    }
    // export function GetRandomColor() {
    //     return '#' + (function (color) {
    //         return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
    //             && (color.length == 6) ? color : arguments.callee(color);
    //     })('');
    // }
}
import { Color, ImageAsset, Overflow, v2, Vec3, Widget } from 'cc';
/**
 * @author 
 * @description 模拟 飘字效果
 *
 */

import { BlockInputEvents, color, Label, Layers, Node, Sprite, SpriteFrame, Texture2D, tween, UIOpacity, UITransform, v3, view } from "cc";
import { rootNode } from "../core";

/**
 * 位置
 */
export enum Gravity {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}



// const imageObj = new Image();
// imageObj.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==";
// const imageAsset = new ImageAsset(imageObj);


export class ToastFloatText {

    static readonly LENGTH_SHORT = 2; // 短时间吐司
    static readonly LENGTH_LONG = 3.5; // 长时间吐司

    private static pNode: Node | null = null;
    private _bgNode: Node = null!;
    private _textNode: Node = null!;

    private _node: Node = null!;
    private _text = '';
    private _time = 0;
    private _textSize = 18;
    private _gravity = Gravity.TOP;
    private _color: Color;

    private constructor(node: Node | null) {
        if (null == node) {
            this._node = this.getPNode();
        } else {
            this._node = node;
        }

        this._textNode = new Node('Text');
        this._textNode.layer = Layers.Enum.UI_2D;
        const uiTransform = this._textNode.addComponent(UITransform);
        const label = this._textNode.addComponent(Label);
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.color = this._color;
        label.enableOutline = true;
        label.outlineColor = Color.WHITE;
        label.outlineWidth = 2;
        label.enableWrapText = false;
        label.isBold = true;
        this._textSize = 28;
        label.overflow = Overflow.NONE;
        label.fontSize = this._textSize;
        label.lineHeight = 40;
        this._textNode.active = false;

        this._textNode.parent = this._node;
    }

    /**
     * 生成吐司
     * @param node 目标节点  
     * @param text  文字
     * @param time  延迟时长
     * @param color  颜色
     * @param gravity  位置
     * 
     * @returns 
     */
    static makeText(node: Node | null, text: string, time: number, color: string, gravity: Gravity = Gravity.TOP) {
        let toast = new ToastFloatText(node);
        toast.setText(text);
        toast.setTime(time);
        toast.setColor(color);
        toast.setGravity(gravity);
        return toast;
    }

    /**
     * 显示吐司
     */
    show() {
        this.setOverFlow();
        this._textNode.active = true;
        const ui = this._textNode.getComponent(UITransform);
        let ty = this._textNode.position.y + ui.height / 2
        let pos = v3(this._textNode.position.x, ty, this._textNode.position.z);
        tween(this._textNode)
            .delay(this._time)
            .to(0.3, { position: pos })
            .call(() => {
                // console.log("----tip")
                this._textNode.destroy();
            })
            .start();
    }

    /**
     * 设置文字
     * @param text 文字
     * @returns 
     */
    setText(text: string): ToastFloatText {
        this._text = text;
        let label = this._textNode.getComponent(Label)!;
        label.string = this._text;
        return this;
    }

    /**
   * 设置颜色
   * @param color 颜色
   * @returns 
   */

    setColor(color: string): ToastFloatText {
        this._color = new Color().fromHEX(color);
        let label = this._textNode.getComponent(Label)!;
        label.color = this._color;;
        return this;
    }

    /**
     * 设置文字大小
     * @param textSize 文字大小
     * @returns 
     */
    setFontSize(textSize: number): ToastFloatText {
        this._textSize = textSize;
        let label = this._textNode.getComponent(Label)!;
        label.fontSize = this._textSize;
        return this;
    }

    /**
     * 设置时间
     * @param time 时间 
     * @returns 
     */
    setTime(time: number) {
        this._time = time;
        return this;
    }

    /**
     * 设置位置
     * @param gravity 位置
     * @returns 
     */
    setGravity(gravity: Gravity): ToastFloatText {
        this._gravity = gravity;
        return this;
    }

    private setPosition() {
        let uiTransform = this._node.getComponent(UITransform)!;
        let ui = this._textNode.getComponent(UITransform)!;

        if (Gravity.TOP === this._gravity) {
            // /如果描点在左上角
            if (uiTransform.anchorX == 0 && uiTransform.anchorY == 1) {
                let y = - uiTransform.height / 2 + ui.height / 2;
                let x = uiTransform.width / 2 ;
                this._textNode.position = v3(x, y, 0);
            }
        }

        if (Gravity.RIGHT === this._gravity) {

            let y = - ui.height / 2;
            let x = uiTransform.width/2;
            this._textNode.position = v3(x, y, 0);
        }

    }
    //设置文字换不换行或者文本宽度
    private setOverFlow() {
        let label = this._textNode.getComponent(Label)!;
        let fontLength = this._text.length * label.fontSize;
        let uiTransform = this._textNode.getComponent(UITransform)!;
        uiTransform.width = fontLength;
        label.overflow = Label.Overflow.NONE;
    
        this.setPosition();
    }

    private getPNode(): Node {
        if (null == ToastFloatText.pNode || !ToastFloatText.pNode.isValid) {
            ToastFloatText.pNode = new Node('Toast');
            let transform = ToastFloatText.pNode.addComponent(UITransform);
            ToastFloatText.pNode.layer = Layers.Enum.UI_2D;
            rootNode.addChild(ToastFloatText.pNode);
            ToastFloatText.pNode.zIndex = 100;
            let size = view.getVisibleSize();
            transform.contentSize = size;
            transform.width = size.width;
            transform.height = size.height;

        }
        return ToastFloatText.pNode;
    }

}
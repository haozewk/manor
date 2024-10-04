import { _decorator, Component, ImageAsset, Label, Node, NodeEventType, randomRangeInt, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ResUtil } from '../../core/lib/ResUtil';
import { EventManager } from '../../core/components/event/manager/EventManager';
const { ccclass, property } = _decorator;

@ccclass('prefab/Food')
export class Food extends Component {
    @property({ type: Sprite })
    progress: Sprite;

    @property({ type: Label })
    NumNode: Label;

    @property({ type: Node })
    TimeNode: Node;


    NeedTime = 5;
    NowTime = 0;

    maxCount = 0;
    nowCount = 0;
    price = 0;
    priceTarget: Node;

    start() {
        this.TimeNode.active = false;
        this.node.on(NodeEventType.TOUCH_END, () => {
            if (this.nowCount <= 0) {
                //制造
                console.log("制造");
                this.StartCreate();
            } else {
                console.log("卖出");
                EventManager.instance.emit("SendFood",{name:this.node.name,pos:this.node.worldPosition})
                
                //卖出 。。。
            }

        }, this);
    }

    update(deltaTime: number) {

    }

    SetNum(num) {
        this.NumNode.string = num.toString();
    }

    StartCreate() {
        this.TimeNode.active = true;
        this.schedule(this.CreateFood, 0.1);
    }

    StopCreate() {
        // this.TimeNode.active = false;
        this.progress.fillRange = 1;
        this.unschedule(this.CreateFood);
    }

    CreateFood() {
        if(this.nowCount>=this.maxCount)return;
        this.NowTime += 0.1;
        let r = (this.NeedTime - this.NowTime) / this.NeedTime;
        this.progress.fillRange = r;
        if (this.NowTime >= this.NeedTime) {
            this.NowTime = 0;
            //addCount
            if (this.nowCount < this.maxCount) {
                this.nowCount++;
                this.SetNum(this.nowCount);
                this.progress.fillRange = 1;
            }

            // this.StopCreate();
            //...

        }
    }
    Init(max, price, target) {
        this.maxCount = max;
        this.price = price;
        this.priceTarget = target;
        this.LoadFood(this.node.name);
        this.SetNum(0)
        this.progress.fillRange = 1;
        this.NeedTime = randomRangeInt(4,7);
    }

    LoadFood(name) {
        console.log(name)
        ResUtil.loadAsset({ path: 'res/sprites/' + name, bundleName: "scene", type: ImageAsset })
            .then((e: ImageAsset) => {
                console.log(e)
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = e;
                spriteFrame.texture = texture;
                let sprite = this.node.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
            })
            .catch(err => {
                console.log(err);
            })
    }


}



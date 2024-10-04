import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ResUtil } from '../../core/lib/ResUtil';
const { ccclass, property } = _decorator;

@ccclass('prefab/NeedFoodItem')
export class NeedFoodItem extends Component {
    @property({type:Sprite})
    NeedNode:Sprite;

    @property({type:Label})
    NumNode:Label

    _name = '';
    _num =0;
    start() {

    }
    
    SetNeed(name,num){
        this.SetNeedImage(name);
        this.SetNum(num);
        this._name =name;
        this._num = num;

    }
    update(deltaTime: number) {
        
    }

    
    SetNum(num = 1) {
        if (this.NumNode) {
            this.NumNode.string = num.toString();
        }
    }

    SetNeedImage(name) {
        if (this.NeedNode) {
            console.log('res/sprites/' + name + '.png')
            ResUtil.loadAsset({ path: 'res/sprites/' + name, bundleName: "scene", type: ImageAsset })
                .then((e: ImageAsset) => {
                    console.log(e)
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = e;
                    spriteFrame.texture = texture;
                    this.NeedNode.spriteFrame = spriteFrame;
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }
}



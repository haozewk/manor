import { _decorator, Component, director, ImageAsset, Node, size, sp, Sprite, SpriteFrame, Texture2D, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { ResUtil } from '../../core/lib/ResUtil';
const { ccclass, property } = _decorator;

@ccclass('prefab/Money')
export class Money extends Component {
    start() {
        
    }
    epos:Vec3;
    spos:Vec3;

    update(deltaTime: number) {
        
    }
    init(spos,epos){
           this.LoadFood();
           this.spos =spos;
           this.epos = epos;
    }

    LoadFood() {
        ResUtil.loadAsset({ path: 'res/tongban', bundleName: "scene", type: ImageAsset })
            .then((e: ImageAsset) => {
                console.log(e)
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = e;
                spriteFrame.texture = texture;
                let sprite = this.node.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                this.node.getComponent(UITransform).setContentSize(size(60,60));
                this.node.setScale(v3(0.1,0.1,0.1))

                tween(this.node).to(0.3, { worldPosition:this.epos ,scale:v3(1,1,1)}).call(e=>{
                    this.node.destroy();
                }).start();
            })
            .catch(err => {
                console.log(err);
            })
    }
}



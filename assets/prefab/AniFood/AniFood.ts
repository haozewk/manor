import { _decorator, Component, director, ImageAsset, Node, size, sp, Sprite, SpriteFrame, Texture2D, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { ResUtil } from '../../core/lib/ResUtil';
const { ccclass, property } = _decorator;

@ccclass('prefab/AniFood')
export class AniFood extends Component {
    start() {
        
    }
    epos:Vec3;
    spos:Vec3;

    update(deltaTime: number) {
        
    }
    init(name,spos,epos){
           this.LoadFood(name);
           this.spos =spos;
           this.epos = epos;
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
                this.node.getComponent(UITransform).setContentSize(size(60,60))
                tween(this.node).to(0.2, { worldPosition:this.epos }).call(e=>{
                    this.node.destroy();
                }).start();
            })
            .catch(err => {
                console.log(err);
            })
    }
}



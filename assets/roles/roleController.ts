
import { _decorator, Component, ImageAsset, Label, Node, randomRangeInt, sp, Sprite, SpriteFrame, Texture2D, UITransform, v3, Vec3, view } from 'cc';
import { ResUtil } from '../core/lib/ResUtil';
const { ccclass, property } = _decorator;

@ccclass('roleController')
export class roleController extends Component {
    @property({ type: Node })
    QIPAONODE: Node;
    @property({ type: Sprite })
    QIPAONODE_NEED: Sprite;
    @property({ type: Label })
    QIPAONODE_NUM: Label;

    step = 0; //0=move 1=idle 2=feature 3= wait  4==leave
    tpos: Vec3;
    left = -100;
    right = 240;
    pwidth = 178;
    speed = 250;
    _dir = 'left'
    islock = false;


    start() {
        //设置初始位置
        let random = randomRangeInt(0, 2);
        let num = parseInt(this.node.parent.name);
        let ui = this.node.getComponent(UITransform);
        let dir = 0;
        if (random == 0) {
            dir = this.left;
            this._dir = 'left';
            this.node.setWorldPosition(v3(dir - num * this.pwidth - ui.width / 2, this.node.worldPosition.y, 0));
            this.node.setScale(v3(0.6, 0.6, 1))

        }
        if (random == 1) {
            dir = this.right;
            this._dir = 'right';
            this.node.setWorldPosition(v3(dir + (5 - num) * this.pwidth + 100 + ui.width / 2, this.node.worldPosition.y, 0));
            this.node.setScale(v3(-0.6, 0.6, 1))
        }
        console.log(this._dir)
        this.step = 0;
        this.RunAni("move2");
        console.log(this.node.worldPosition);
        console.log(this.node.parent.worldPosition);

    }

    update(deltaTime: number) {
        if (0 == this.step) {


            let pos = this.node.worldPosition;
            if (this._dir == 'left') {
                if (this.node.worldPosition.x <= this.node.parent.worldPosition.x) {
                    this.node.setWorldPosition(v3(pos.x + (deltaTime * this.speed), pos.y, pos.z));
                } else {
                    this.step = 1;
                }

            } else {
                if (this.node.worldPosition.x >= this.node.parent.worldPosition.x) {
                    this.node.setWorldPosition(v3(pos.x - (deltaTime * this.speed), pos.y, pos.z));
                } else {
                    this.step = 1;
                    this.node.setScale(v3(0.6, 0.6, 1))
                }


            }


        }
        if (1 == this.step) {
            if (this.islock) return;
            this.islock = true;
            this.RunAni("idle");
        }
    }

    RunAni(name = 'idle') {
        let spine = this.node.getComponent(sp.Skeleton);
        if (name == spine.animation) return;
        if ('idle' == name && this.step == 1) {
            setTimeout(() => {
                this.step = 2;
                this.RunAni('feature')
            }, 500);
        }
        if ('feature' == name && this.step == 2) {
            this.step = 3
        }
        let aniEnum = spine.skeletonData.getAnimsEnum();
        console.log(aniEnum)
        let track = spine.setAnimation(0, name, true);
        if (track) {
            let foods = ["dongporou","hongshaoyu","xiaolongbao","xiaolongxia","mixian"];
            let random = randomRangeInt(0,foods.length);
            // 注册动画的结束回调
            spine.setCompleteListener((trackEntry) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if ('feature' == name && this.step == 3) {
                    this.ShowQIPAO(foods[random], 2);
                    this.RunAni("idle");
                }
            })
        }


    }

    Move(dt) {
        if (this.tpos == null) this.tpos = this.node.parent.getPosition();
    }


    SetNum(num = 1) {
        if (this.QIPAONODE_NUM) {
            this.QIPAONODE_NUM.string = num.toString();
        }
    }

    SetNeed(name) {
        if (this.QIPAONODE_NEED) {
            console.log('res/sprites/' + name + '.png')
            ResUtil.loadAsset({ path: 'res/sprites/' + name, bundleName: "scene", type: ImageAsset })
                .then((e: ImageAsset) => {
                    console.log(e)
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = e;
                    spriteFrame.texture = texture;
                    this.QIPAONODE_NEED.spriteFrame = spriteFrame;
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }

    ShowQIPAO(name, num) {
        this.SetNeed(name);
        this.SetNum(num);
        this.QIPAONODE.active = true;
    }
}



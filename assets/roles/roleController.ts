
import { _decorator, CCInteger, Component, ImageAsset, instantiate, Label, Node, Prefab, randomRangeInt, sp, Sprite, SpriteFrame, Texture2D, UITransform, v3, Vec3, view } from 'cc';
import { ResUtil } from '../core/lib/ResUtil';
import { NeedFoodItem } from '../prefab/NeedFoodItem/NeedFoodItem';
const { ccclass, property } = _decorator;

@ccclass('roleController')
export class roleController extends Component {
    @property({ type: Node })
    QIPAONODE: Node;

    step = 0; //0=move 1=idle 2=feature 3= wait  4==leave 5 ==happy
    tpos: Vec3;
    left = -100;
    right = 240;
    pwidth = 178;
    speed = 250;
    _dir = 'left';
    _dirNum = 0;
    islock = false;
    _scale = 0.5;
    leavePos: Vec3;

    needFoods = []

    @property({ type: CCInteger })
    waitTime = 10;


    start() {
        this.waitTime = randomRangeInt(10,20);// 设置随机等待时长
        //设置初始位置
        let random = randomRangeInt(0, 2);
        let num = parseInt(this.node.parent.name);
        let ui = this.node.getComponent(UITransform);
        let dir = 0;
        if (random == 0) {
            dir = this.left;
            this._dir = 'left';
            this.leavePos = v3(dir - num * this.pwidth - ui.width / 2, this.node.worldPosition.y, 0);
            this.node.setWorldPosition(this.leavePos);
            this.node.setScale(v3(this._scale, this._scale, 1))

        }
        if (random == 1) {
            dir = this.right;
            this._dir = 'right';
            this.leavePos = v3(dir + (5 - num) * this.pwidth + 100 + ui.width / 2, this.node.worldPosition.y, 0);
            this.node.setWorldPosition(this.leavePos);
            this.node.setScale(v3(-this._scale, this._scale, 1))
        }
        console.log(this._dir)
        this.step = 0;
        this.RunAni("move2");
        console.log(this.node.worldPosition);
        console.log(this.node.parent.worldPosition);

    }
    protected onDestroy(): void {
        console.log(this.node.name + "is destory")
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
                    this.node.setScale(v3(this._scale, this._scale, 1))
                }


            }


        }
        if (1 == this.step) {
            if (this.islock) return;
            this.islock = true;
            this.RunAni("idle");
        }

        if (4 == this.step) {
            let pos = this.node.worldPosition;
            if (this._dir == 'left') {
                if (this.leavePos.x < this.node.worldPosition.x) {
                    this.node.setWorldPosition(v3(pos.x - (deltaTime * this.speed), pos.y, pos.z));
                } else {
                    this.node.destroy();
                }
            }
            if (this._dir == 'right') {
                if (this.leavePos.x > this.node.worldPosition.x) {
                    this.node.setWorldPosition(v3(pos.x - (deltaTime * this.speed), pos.y, pos.z));
                } else {
                    this.node.destroy();
                }
            }
        }

        if(5==this.step){
            //加钱
            
        }
    }
    SetHappy() {
        this.step = 5;
        this.RunAni("happy1");
        
    }
    SetNeedFoods(arr){
        this.needFoods = arr;
    }
    RunAni(name = 'idle') {
        let spine = this.node.getComponent(sp.Skeleton);
        if (name == spine.animation) return;
        if ('idle' == name && this.step == 1) {
            // 初始跑过来后进入step2 
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
           
          
            // 注册动画的结束回调
            spine.setCompleteListener((trackEntry) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                //发送需求
                if ('feature' == name && this.step == 3) {
     
                    this.needFoods.forEach(y=>{
                        this.ShowQIPAO(y.name, y.num);
                    })
                    this.RunAni("idle");
                    //waittime秒后超时生气离开
                    this.scheduleOnce(() => {
                        if (this.step > 3) return;
                        this.RunAni('angry1');
                        this.QIPAONODE.active = false;

                    }, this.waitTime);
                }

                if ('angry1' == name) {
                    //反转
                    let _scale = this.node.scale;
                    this.node.setScale(v3(-_scale.x, _scale.y, 1));

                    this.RunAni("idle");
                    this.step = 4;
                }

                if ('happy1' == name) {
                    //反转
                    let _scale = this.node.scale;
                    this.node.setScale(v3(-_scale.x, _scale.y, 1));

                    this.RunAni("idle");
                    this.step = 4;
                }
            })
        }


    }

    Move(dt) {
        if (this.tpos == null) this.tpos = this.node.parent.getPosition();
    }



    ShowQIPAO(name, num) {
        this.QIPAONODE.active = true;
        let layout = this.QIPAONODE.getChildByName('Layout');
        ResUtil.loadAsset({path:"NeedFoodItem/NeedFoodItemPrefab",bundleName:"prefab",type:Prefab})
        .then((res:Prefab)=>{
               let node = instantiate(res);
               let c = node.getComponent(NeedFoodItem);
               c.SetNeed(name,num);
               layout.addChild(node);
        })
        .catch(err=>{console.log(err)});
    }
}



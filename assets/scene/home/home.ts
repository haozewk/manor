import { _decorator, Component, Node, NodeEventType, Label, sp, v3, assetManager, Prefab, instantiate, ImageAsset, SpriteFrame, Texture2D, Sprite, randomRangeInt, UITransform, size, Camera } from 'cc';
import { PopupManager } from '../../core/components/popup/manager/PopupManager';
import { TimeUtil } from '../../core/lib/TimeUtil';
import { ResUtil } from '../../core/lib/ResUtil';
import { AudioManager } from '../../core/components/audio/manager/AudioManager';
import { SqlUtil } from '../../core/lib/SqlUtil';
import { foods } from '../../scripts/config';
import { RandomUtil } from '../../core/lib/RandomUtil';
import { Food } from '../../prefab/Food/Food';
import { roleController } from '../../roles/roleController';
import { EventManager } from '../../core/components/event/manager/EventManager';
import { NeedFoodItem } from '../../prefab/NeedFoodItem/NeedFoodItem';
import { AniFood } from '../../prefab/AniFood/AniFood';
import { Money } from '../../prefab/Money/Money';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {
    @property({ type: Node })
    testBtn: Node;
    @property({ type: Node })
    RoleNode: Node;
    @property({ type: Node })
    RolesNode: Node;
    @property({ type: Label })
    timeNode: Label;

    @property({ type: Node })
    FOODNODE: Node;

    @property({ type: Node })
    Layout: Node;

    @property({ type: Node })
    ANIFOODNODE: Node;

    @property({ type: Label })
    Yuan: Label;  //元宝
    @property({ type: Label })
    Tong: Label; //金币

    //时间相关
    timeSkip = 120; //每秒加120秒 对饮 1s =2min;
    wordTimeLength = 86400;
    startTime = 28800;
    endTime = 64800;
    nowTime = 28800;
    nowDay = 1;

    // 金钱
    money = 0;

    dayKey = "gameDay";
    moneyKey = "gameMoney";

    FoodArr: Array<any> = [];

    onLoad() {
        this.SetEvent();
        this.StartTime();
        this.StartGame();

        if (!AudioManager.instance.isBgmPlaying()) AudioManager.instance.playBgm({ path: "Battle", bundleName: "audio" });
        //监听
        EventManager.instance.on('SendFood', (res) => {
            console.log(res)
            let a = 0;
            this.RolesNode.children.forEach(x => {
                if (x.children.length <= 0) return;
                //遍历角色
                let role = x.children[0].getComponent(roleController);
                if (role.needFoods.name == res.name && role.step < 4) {
                    let food = this.FOODNODE.children.find(z => z.name == res.name);
                    if (food) {
                        //设置食物的数量
                        let foodc = food.getComponent(Food);
                        if (foodc.nowCount > 0) {
                            foodc.nowCount--;
                        } else {
                            return;
                        }
                        foodc.SetNum(foodc.nowCount);

                        //设置角色需要的数量

                        let layout = role.QIPAONODE.getChildByName('Layout');
                        let b = layout.children[0]
                        let c = b.getComponent(NeedFoodItem);
                        // let h = role.getComponent(sp.Skeleton).skeletonData.skeletonJson.skeleton.height;
                        // console.log(role.getComponent(sp.Skeleton))
                        if (c._name == res.name) {
                            c.SetNeed(c._name, c._num - 1);
                            let ps = v3(role.node.worldPosition.x, role.node.worldPosition.y + 150, 0);
                            this.SendFood(c._name, res.pos, ps);
                            setTimeout(() => {
                            this.AddMoney(foodc.price,ps,this.Tong.node.worldPosition);
                                
                            }, 400);
                            if (c._num <= 0) {//
                                //给完食物
                                role.SetHappy();



                            }
                            return;
                        }
                        return;
                    }
                }
            })
        })
    }

    update(deltaTime: number) {

    }
    protected onDestroy(): void {
        EventManager.instance.off("SendFood");
    }


    SetEvent() {
        this.testBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.show({ bundleName: "prefab", path: "JieSuan/JieSuanPrefab" });
        }, this)
    }
    StartTime() {
        this.GetTime()
        this.schedule(this.GetTime, 1);
    }
    GetTime() {
        if (this.nowTime >= this.endTime) {
            this.nowTime = this.startTime;
            //新的一天逻辑
            this.nowDay++;
            SqlUtil.set(this.dayKey, this.nowDay);

            console.log('新的一天');
        }
        var h = parseInt((this.nowTime / 60 / 60).toString());
        var m = parseInt(((this.nowTime - h * 60 * 60) / 60).toString());
        // console.log(`h:${h} m:${m}`);
        let res = TimeUtil.calculateShichen(h, m);
        if (this.timeNode) {
            //     console.log(res)
            //    console.log(this.timeNode)
            this.timeNode.string = `${res.h}·${res.ke} · ${res.hs}`;
        }
        this.nowTime += this.timeSkip;
    }


    StopTime() {
        this.unschedule(this.GetTime)
    }
    StopGetRoles() {
        this.unschedule(this.GetRole);
    }
    StartGetRoles() {
        this.GetRole();
        this.schedule(this.GetRole, 4);
    }

    GetRole() {
        let role = ["xiaonvhai", "yuanwai", "xiaoshaoye", "guifu"];
        let random = randomRangeInt(0, role.length);
        let name = role[random];
        let child = this.RolesNode.children;
        ResUtil.loadAsset({ path: name, bundleName: "roles", type: Prefab })
            .then((e: Prefab) => {
                let node = instantiate(e);
                let rands = randomRangeInt(0, this.FoodArr.length);


                let foodObj = {
                    name: this.FoodArr[rands],
                    num: randomRangeInt(1, 4)
                }

                node.getComponent(roleController).SetNeedFoods(foodObj);

                for (let i = 0; i <= child.length; i++) {
                    if (child[i] && child[i].children) {
                        if (child[i].children.length <= 0) {
                            child[i].addChild(node);
                            break;
                        }
                    }

                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    GetData() {
        this.nowDay = SqlUtil.get(this.dayKey, 1);
        this.money = SqlUtil.get(this.moneyKey, 0);
    }

    StartGame() {
        this.SetFood();
        this.StartGetRoles();
    }

    StopGame() {
        this.StopGetRoles();
    }

    PauseGame() {

    }

    SetFood() {
        this.FoodArr = [];
        this.FOODNODE.removeAllChildren();
        let randoms = RandomUtil.randomArr(0, foods.length, 5);
        console.log(randoms);
        randoms.forEach(x => {
            ResUtil.loadAsset({ path: 'Food/FoodPrefab', bundleName: "prefab", type: Prefab })
                .then((res: Prefab) => {
                    let node = instantiate(res);
                    let foodC = node.getComponent(Food);
                    node.name = foods[x];
                    this.FoodArr.push(foods[x]);
                    foodC.Init(randomRangeInt(3, 7), randomRangeInt(8, 21), this.Tong);

                    this.FOODNODE.addChild(node);
                })
                .catch(err => {
                    console.log(err);
                })
        })
    }
    AddMoney(money = 0,spos,epos) {
        //1000铜币=1元宝
        let nowMoney = this.money + money;

        let yuan = parseInt((nowMoney / 1000).toString());
        let tong = nowMoney - (yuan * 1000);
        this.Yuan.string = yuan.toString();
        this.Tong.string = tong.toString();
         this.SendMoney(spos,epos)

    }

    SendFood(name, spos, epos) {
        ResUtil.loadAsset({ path: 'AniFood/AniFoodPrefab', bundleName: "prefab", type: Prefab })
            .then((res: Prefab) => {
                let node = instantiate(res);
                let foodC = node.getComponent(AniFood);
                foodC.init(name, spos, epos);
                // node.setPosition(spos);

                this.ANIFOODNODE.addChild(node);
                node.setWorldPosition(spos);
              
            })
            .catch(err => {
                console.log(err);
            })
    }
    SendMoney( spos, epos) {
        ResUtil.loadAsset({ path: 'Money/MoneyPrefab', bundleName: "prefab", type: Prefab })
            .then((res: Prefab) => {
                let node = instantiate(res);
                let foodC = node.getComponent(Money);
                foodC.init( spos, epos);
                // node.setPosition(spos);

                this.Layout.addChild(node);
                node.setWorldPosition(spos);
              
            })
            .catch(err => {
                console.log(err);
            })
    }




}



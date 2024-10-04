import { _decorator, Component, Node, NodeEventType, Label, sp, v3, assetManager, Prefab, instantiate, ImageAsset, SpriteFrame, Texture2D, Sprite, randomRangeInt } from 'cc';
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

    FoodArr:Array<any> = [];

    onLoad() {
        this.SetEvent();
        this.StartTime();
        this.StartGame();

        if (!AudioManager.instance.isBgmPlaying()) AudioManager.instance.playBgm({ path: "Battle", bundleName: "audio" });
        EventManager.instance.on('SendFood',(res)=>{
            console.log(res)
            let a = 0;
            this.RolesNode.children.forEach(x=>{
                if(x.children.length<=0)return;
                if(a==1)return;
               let role = x.children[0].getComponent(roleController);
               role.needFoods.forEach(y=>{

                  if(y.name==res.name){
                      let food =this.FOODNODE.children.find(z=>z.name==res.name);
                      if(food){
                          //设置食物的数量
                          let foodc = food.getComponent(Food);
                          foodc.nowCount--;
                          foodc.SetNum(foodc.nowCount);
                          a =1;

                          //设置角色需要的数量

                          let layout = role.QIPAONODE.getChildByName('Layout');
                          layout.children.forEach(b=>{
                              let c = b.getComponent(NeedFoodItem);
                              if(c._name==y.name){
                                 c.SetNeed(c._name,c._num-1);
                                 return;
                              }
                          })
                          return;
                      }
                  }
               })
            })
            this.FOODNODE.children.forEach(x)
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
            this.nowDay ++;
            SqlUtil.set(this.dayKey,this.nowDay);

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
    StopGetRoles(){
        this.unschedule(this.GetRole);
    }
    StartGetRoles() {
        this.schedule(this.GetRole,2);
    }

    GetRole() {
        let role = ["xiaonvhai","yuanwai","xiaoshaoye"];
        let random  = randomRangeInt(0,role.length);
        let name = role[random];
        let child = this.RolesNode.children;
        ResUtil.loadAsset({ path: name, bundleName:"roles", type: Prefab })
            .then((e: Prefab) => {
                console.log(e)
                let node = instantiate(e);
                let r = randomRangeInt(1,3);
                let rands = RandomUtil.randomArr(0,foods.length,r);
                let arr = [];
                rands.forEach(y=>{
                    let name = foods[y];
                    let num = randomRangeInt(1,4);
                    arr.push({name,num});
                })

                node.getComponent(roleController).SetNeedFoods(arr);

                for (let i = 0; i <= child.length; i++) {
                    if (child[i].children.length <= 0) {
                        child[i].addChild(node);
                        break;
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    GetData(){
        this.nowDay  = SqlUtil.get(this.dayKey,1);
        this.money = SqlUtil.get(this.moneyKey,0);
    }

    StartGame(){
        this.SetFood();
        this.StartGetRoles();
    }

    StopGame(){
      this.StopGetRoles();
    }

    PauseGame(){

    }
    
    SetFood(){
        this.FoodArr = [];
        this.FOODNODE.removeAllChildren();
        let randoms = RandomUtil.randomArr(0,foods.length,5);
        console.log(randoms);
        randoms.forEach(x=>{
              ResUtil.loadAsset({path:'Food/FoodPrefab',bundleName:"prefab",type:Prefab})
              .then((res:Prefab)=>{
                let node = instantiate(res);
                let foodC = node.getComponent(Food);
                node.name = foods[x];
                this.FoodArr.push(foods[x]);
                foodC.Init(randomRangeInt(3,7),randomRangeInt(8,21),this.Tong);
                
                this.FOODNODE.addChild(node);
              })
              .catch(err=>{
                console.log(err);
              })
        })
    }
    AddMoney(money=0){
        //1000铜币=1元宝
        let nowMoney = this.money + money;

        let yuan = parseInt((nowMoney / 1000).toString());
        let tong =nowMoney  - (yuan * 1000);
        this.Yuan.string = yuan.toString();
        this.Tong.string = tong.toString();


    }




}



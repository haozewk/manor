import { _decorator, Component, Node, NodeEventType, Label, sp, v3, assetManager, Prefab, instantiate } from 'cc';
import { PopupManager } from '../../core/components/popup/manager/PopupManager';
import { TimeUtil } from '../../core/lib/TimeUtil';
import { ResUtil } from '../../core/lib/ResUtil';
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


    onLoad() {
       this.SetEvent();
       this.StartTime();
       this.GetRole();
    }

    update(deltaTime: number) {
        
    }
 
    
    SetEvent() {
        this.testBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.show({bundleName:"prefab",path:"UserCenter/UserCenterPrefab"});
        }, this)
    }
    StartTime(){
        this.schedule(this.GetTime,10);
    }
    GetTime(){
       let res =  TimeUtil.calculateShichen();
       if(this.timeNode){
    //     console.log(res)
    //    console.log(this.timeNode)
        this.timeNode.string = `${res.h}·${res.ke} · ${res.hs}`;
       }
    }
    StopTime(){
       this.unschedule(this.GetTime)
    }

    GetRole(){
        ResUtil.loadAsset({path:'nvzhanggui',bundleName:"roles",type:Prefab})
        .then((e:Prefab)=>{
            console.log(e)
            let node = instantiate(e);
            
          this.RoleNode.addChild(node);
        })
        .catch(err=>{
            console.log(err);
        })

        ResUtil.loadAsset({path:'xiaonvhai',bundleName:"roles",type:Prefab})
        .then((e:Prefab)=>{
            console.log(e)
            let node = instantiate(e);
            node.setScale(v3(-0.7,0.7,1))
            
          this.RolesNode.addChild(node);
        })
        .catch(err=>{
            console.log(err);
        })
           
    }
}



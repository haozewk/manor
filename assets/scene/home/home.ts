import { _decorator, Component, Node, NodeEventType, Label, sp, v3, assetManager, Prefab, instantiate } from 'cc';
import { PopupManager } from '../../core/components/popup/manager/PopupManager';
import { TimeUtil } from '../../core/lib/TimeUtil';
import { ResUtil } from '../../core/lib/ResUtil';
import { AudioManager } from '../../core/components/audio/manager/AudioManager';
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
       this.GetRoles();

       if (!AudioManager.instance.isBgmPlaying()) AudioManager.instance.playBgm({ path: "Battle", bundleName: "audio" });
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
    
    GetRoles(){
        this.GetRole('xiaonvhai','roles');
        setTimeout(() => {
        this.GetRole('yuanwai','roles');
            
        }, 1000);
        setTimeout(() => {
            this.GetRole('xiaoshaoye','roles2');
                
            }, 3000);
    }

    GetRole(name,bundle){
        let child = this.RolesNode.children;
        ResUtil.loadAsset({path:name,bundleName:bundle,type:Prefab})
        .then((e:Prefab)=>{
            console.log(e)
            let node = instantiate(e);
          
            for(  let i = 0;i<=child.length;i++){
                 if(child[i].children.length<=0){
                     child[i].addChild(node);
                     break;
                 }
            }
        })
        .catch(err=>{
            console.log(err);
        })


 
           
    }
}



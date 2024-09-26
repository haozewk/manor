import { _decorator, Component, Node, NodeEventType } from 'cc';
import { PopupManager } from '../../core/components/popup/manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {
    @property({ type: Node })
    testBtn: Node;
    onLoad() {
       this.SetEvent();
    }

    update(deltaTime: number) {
        
    }

    
    SetEvent() {
        this.testBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.show({bundleName:"prefab",path:"UserCenter/UserCenterPrefab"});
        }, this)
    }
}



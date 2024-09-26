import { _decorator, Component, Label, Node, NodeEventType, size, UITransform, v3, view, Widget } from 'cc';
import { PopupManager } from '../../core/components/popup/manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('prefab/UserCenter')
export class UserCenter extends Component {
    @property({ type: Node })
    closeBtn: Node;

    @property({ type: Node })
    panelNode: Node;

    @property({ type: Label })
    title: Label;

    width = 1146;
    height = 607;
    onLoad() {
        this.SetView();
        this.SetEvent();
    }

    update(deltaTime: number) {

    }

    SetView() {
        let vSize = view.getVisibleSize();
        let dSize = view.getDesignResolutionSize();
        console.log(vSize);
        console.log(dSize);
        if (!this.panelNode) return;
        let panelUI = this.panelNode.getComponent(UITransform);
        let _height = panelUI.height;

        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        let srcScaleForShowAll = Math.min(
            vSize.width / dSize.width,
            vSize.height / dSize.height
        );
        let realWidth = panelUI.width * srcScaleForShowAll;
        let realHeight = panelUI.height * srcScaleForShowAll;


        // 2. 基于第一步的数据，再做节点宽高重置
        // let width = panelUI.width * (vSize.width / realWidth);
        // let height = panelUI.height * (vSize.height / realHeight);
        panelUI.setContentSize(size(realWidth,realHeight));
        console.log(realWidth,realHeight);
        
        //设置title的位置
        let tw = this.title.node.getComponent(Widget);
        let base = 5;
        let ratio = vSize.height / dSize.height;
        tw.top = base * ratio;
        this.title.node.setScale(v3(ratio,ratio));



    }

    SetEvent() {
        this.closeBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.remove("UserCenterPrefab");
        }, this)
    }
}



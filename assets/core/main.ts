import { _decorator, Component, director, Layers, Node } from 'cc';
import { Core } from './core';
import { RootData } from './lib/RootData'
const { ccclass, property } = _decorator;
let dataNode:Node = null;
@ccclass('InitFrame')
export class InitFrame extends Component {
    protected onLoad(): void {
         Core.init();
         this.SetDataNode() //设置数据常驻节点
        
    }
    start() {
    }

    update(deltaTime: number) {
        
    }
    SetDataNode(){
        if(dataNode!=null){
            console.log("数据节点已配置过");
            return;
        }
        dataNode = new Node("DataNode");
        dataNode.layer = Layers.Enum.UI_2D;
        dataNode.addComponent(RootData);
        director.getScene()?.addChild(dataNode);
        director.addPersistRootNode(dataNode)
       console.log("设置常驻节点DATANODE")
    }
}



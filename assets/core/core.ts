/**
 * @author 
 * @description 框架初始化
 */

import { Canvas, director, Layers, Node, sys, UITransform, v3, view } from "cc";
import { PopupManager } from "./components/popup/manager/PopupManager";

export let rootNode: Node = null!;

export class Core {


    static init() {
        if (null != rootNode) {
            console.warn('已经初始化了');
            return;
        }
        rootNode = new Node('Core');
        rootNode.layer = Layers.Enum.UI_2D;
        rootNode.addComponent(Canvas);
        // Canvas组件依赖UITransform，所以不用额外添加UITransform组件
        // 如果再次添加，会产生两个UITransform组件
        // 相关讨论 https://forum.cocos.org/t/topic/127107
        let transform = rootNode.getComponent(UITransform)!;
        director.getScene()?.addChild(rootNode);
        director.addPersistRootNode(rootNode);
        let size = view.getVisibleSize();

        transform.contentSize = size;
        console.log('size:+'+size)
        rootNode.position = v3(size.width / 2, size.height / 2, 0);

        // 自定义zIndex
        Object.defineProperty(Node.prototype, 'zIndex', {
            set(zIndex: number) {
                this._zIndex = zIndex;
                let self = this as Node;
                if (self.parent) {
                    // 排序
                    const children = self.parent.children;
                    for (let i = children.length - 1; i >= 0; i--) {
                        if (children[i] === self) {
                            continue;
                        }
                        if (zIndex >= children[i].zIndex) {
                            self.setSiblingIndex(children[i].getSiblingIndex() + 1);
                            break;
                        }
                        if (i === 0) {
                            self.setSiblingIndex(0);
                        }
                    }
                }
            },
            get(): number {
                return this._zIndex || 0;
            },
            configurable: true
        });
        console.log("框架初始化成功---success")

        // 初始化弹框管理器
        PopupManager.instance.init();
    }
}

(function () {
    window.Core = window.Core || {};
    if (!Core.login) {
        Core.login = function (res) {
            res.success && res.success({ code: 'test', pf: 'device' });
            res.complete && res.complete();
        }
    }

})();

/***
 *  对象池
 */

// 对象池管理器
import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
import { ResUtil } from '../../lib/ResUtil';
const { ccclass } = _decorator;

export class NodePoolManager {
    private static _instance: NodePoolManager = null;
    private _nodePoolMap: Map<string, NodePool> = null;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new NodePoolManager();
        return this._instance;
    }

    constructor() {
        this._nodePoolMap = new Map<string, NodePool>();
    }

    /*
    @func 通过对象池名字从容器中获取对象池
    @param name 对象池名字
    @return 对象池
    */
    private getNodePoolByName(name: string): NodePool {
        if (!this._nodePoolMap.has(name)) {
            let nodePool = new NodePool(name);
            this._nodePoolMap.set(name, nodePool);
        }
        let nodePool = this._nodePoolMap.get(name);
        return nodePool;
    }
    /*
       @func 通过对象池名字从对象池中获取节点
       @param name 对象池名字
       @param prefab 可选参数，对象预制体
       @return 对象池中节点 
       */
    public getNodeFromPool(name: string, prefab?: Prefab): NodePool | null {
        let nodePool = this.getNodePoolByName(name);
        const poolSize = nodePool.size();
        if (poolSize <= 0) {
            let node = instantiate(prefab);
            nodePool.put(node);
        }
        return nodePool;
    }

    /*
    @func 通过对象池名字从对象池中动态获取节点
    @param name 对象池名字
    @param prefab 可选参数，对象预制体
    @return 对象池中节点 
    */
    public async getNodeFromPoolDynamic(name: string, bundleName: string, path: string): Promise<Node> | null {

        let nodePool = this.getNodePoolByName(name);
        const poolSize = nodePool.size();
        if (poolSize <= 0) {

            let prefab = await ResUtil.loadAsset({ bundleName: bundleName, path: path, type: Prefab }).catch((e) => {
                console.error(e);
            }) as Prefab;

            if (!prefab) {
                throw new Error('动态加载的Prefab路径错误');
            } else {
                let node = instantiate(prefab);
                nodePool.put(node);

                return nodePool.get();
            }


        }
        return nodePool.get();


    }

    /*
    @func 将节点放入对象池中
    @param name 对象池名字
    @param node 节点
    */
    public putNodeToPool(name: string, node: Node) {
        let nodePool = this.getNodePoolByName(name);
        nodePool.put(node);
    }

    // 通过名字将对象池从容器中移除
    public clearNodePoolByName(name: string) {
        // 销毁对象池中对象
        let nodePool = this.getNodePoolByName(name);
        nodePool.clear();
        // 删除容器元素
        this._nodePoolMap.delete(name);
    }

    // 移除所有对象池
    public clearAll() {
        this._nodePoolMap.forEach((value: NodePool, key: string) => {
            value.clear();
        });
        this._nodePoolMap.clear();
    }

    static destoryInstance() {
        this._instance = null;
    }
}

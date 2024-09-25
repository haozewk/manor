import { _decorator, AssetManager, assetManager, Component, director, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('page/open')
export class open extends Component {
    @property({type:ProgressBar})
    pro:ProgressBar

    protected onLoad(): void {
        this.LoadSubPackages();
    }
    async LoadSubPackages() {
        this.pro.progress = 0.2;
        await this.LoadPackage("prefab");   //需要先加载这个 否则会报错
        this.pro.progress = 0.4;
        await this.LoadPackage("scene");
        this.pro.progress = 0.6;
        await this.LoadPackage("audio");
        this.pro.progress = 1;

        
        director.loadScene("home");
    }
    

    LoadPackage(name: string) {
        return new Promise((res, rej) => {
            assetManager.loadBundle(name, (err, bundle: AssetManager.Bundle) => {
                res();
            });
        })
    }
}



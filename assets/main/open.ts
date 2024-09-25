import { _decorator, AssetManager, assetManager, Component, director, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('page/open')
export class open extends Component {
    @property({ type: ProgressBar })
    pro: ProgressBar

    private max: number = 0;

    protected onLoad(): void {
        this.LoadSubPackages();
    }

    protected update(dt: number): void {
        // console.log(dt)
         if(this.pro.progress<this.max){
            this.pro.progress +=dt;
         }
         if(this.pro.progress>=1){
            director.loadScene("home");
         }
    }
    async LoadSubPackages() {
        this.max = 0.2;
        await this.LoadPackage("prefab");   //加载预制体
        this.max = 0.4;
        await this.LoadPackage("scene");  //加载场景包
        this.max = 0.6;
        await this.LoadPackage("font");   //加载字体包
        this.max = 0.8;
        await this.LoadPackage("audio"); //加载音频
        this.max = 1;
    }


    LoadPackage(name: string) {
        return new Promise((res, rej) => {
            assetManager.loadBundle(name, (err, bundle: AssetManager.Bundle) => {
                res();
            });
        })
    }


}



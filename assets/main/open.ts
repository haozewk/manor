import { _decorator, AssetManager, assetManager, Component, director, Label, Node, ProgressBar, size, UITransform, v3, view } from 'cc';
const { ccclass, property } = _decorator;
import {TimeUtil} from '../core/lib/TimeUtil';

@ccclass('page/open')
export class open extends Component {
    @property({ type: ProgressBar })
    pro: ProgressBar;

    @property({ type: Label })
    proTip: Label

    @property({ type: Label })
    proPecent: Label

    private max: number = 0;
    private ptxt:string ="";

    protected onLoad(): void {
          
        this.SetUI();
        this.LoadSubPackages();
    }

    protected update(dt: number): void {
        // console.log(dt)
         if(this.pro.progress<this.max){
            this.pro.progress +=dt;
            if(this.pro.progress>=1)this.pro.progress =1;
            this.proPecent.string = (this.pro.progress/1*100).toFixed(2)+"%"
         }
         if(this.pro.progress>=1){
            director.loadScene("home");
         }
    }
    SetUI(){
        let vSize = view.getVisibleSize();
        if(this.pro){
              this.pro.totalLength = vSize.width;
              this.pro.progress = 0;
              let bar = this.pro.node.getChildByName("Bar");
              if(bar){
                 bar.setPosition(v3(-vSize.width/2,0,0));
              }
             let proUi =  this.pro.node.getComponent(UITransform);
             proUi.setContentSize(size(vSize.width,proUi.height));

        }
    }
    async LoadSubPackages() {
        this.max = 0.2;
        this.proTip.string = "正在加载游戏资源...";
        await this.LoadPackage("prefab");   //加载预制体
        this.max = 0.4;
        this.proTip.string  = "正在加载场景...";
        await this.LoadPackage("scene");  //加载场景包
        this.max = 0.6;
        this.proTip.string  = "正在加载字体资源...";
        await this.LoadPackage("font");   //加载字体包
        this.max = 0.8;
        this.proTip.string  = "正在加载音频资源...";
        await this.LoadPackage("audio"); //加载音频
        console.log(TimeUtil.calculateShichen())
        this.proTip.string  = "加载完成请稍后...";
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



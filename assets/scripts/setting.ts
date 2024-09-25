import { _decorator, Component, Label, Node, NodeEventType, Slider, UITransform, view } from 'cc';
import { PopupManager } from '../core/components/popup/manager/PopupManager';
import { AudioManager } from '../core/components/audio/manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('utils/setting')
export class setting extends Component {
    @property({ type: Label })
    title: Label;
    @property({ type: Node })
    closeBtn: Node;
    @property({ type: Node })
    confirmBtn: Node;
    @property({ type: Node })
    bg: Node;


    @property({ type: Slider })
    bgmSlider: Slider;

    @property({ type: Label })
    bgmVol: Label;

    @property({ type: Slider })
    effectSlider: Slider;

    @property({ type: Label })
    effectVol: Label;


    protected onLoad(): void {
        
    }


    start() {
        this.node.getComponent(UITransform).contentSize = view.getVisibleSize();
        if (this.title) this.title.string = "设置";
        this.SetView();
        this.SetEvents();
        console.log(this.node.getComponent(UITransform).contentSize)
        console.log("aaaa")
    }

    update(deltaTime: number) {

    }
    SetView() {
        //背景
        let bgm = AudioManager.instance.getBgmVolume();
        this.bgmSlider.progress = bgm;
        this.bgmVol.string = (bgm * 100).toFixed(0) + '%';
        //音效
        let eff = AudioManager.instance.getEffectVolume();
        this.effectSlider.progress = eff;
        this.effectVol.string = (eff * 100).toFixed(0) + '%';
        console.log("音量：bgm/eff =" +bgm + "/" + eff)
    }
    SetEvents() {
        this.bgmSlider.node.on("slide", (slider: Slider) => {
            let val = (slider.progress * 100).toFixed(0);
            this.bgmVol.string = val + '%';
            AudioManager.instance.setBgmVolume(parseFloat(slider.progress.toFixed(2)));
        });

        this.effectSlider.node.on("slide", (slider: Slider) => {
            let val = (slider.progress * 100).toFixed(0);
            this.effectVol.string = val + '%';
            AudioManager.instance.setEffectVolume(parseFloat(slider.progress.toFixed(2)));

        });

        // 关闭事件
        this.bg?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.remove("game_set");
        }, this.bg)
        this.closeBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.remove("game_set")
        }, this.closeBtn)
        this.confirmBtn?.on(NodeEventType.TOUCH_END, () => {
            PopupManager.instance.remove("game_set")
        }, this.confirmBtn)
    }
}



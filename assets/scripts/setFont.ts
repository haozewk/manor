import { _decorator, Component, Label, Node, resources, TTFFont } from 'cc';
const { ccclass, property } = _decorator;
let FONT:TTFFont = null;

export function LoadFont(){
    return new Promise((res, rej) => {
        resources.load('font/FZKAI', TTFFont, (err, data) => {
            console.log("动态加载字体资源",err, data)
            if (err) {
                  rej(err);
            }
            if (data) {
                FONT = data;
                res();
            }
        });
    })
}


@ccclass('setFont')
export class setFont extends Component {

    onLoad() {
        this.SetFont();
        
    }
    protected start(): void {
       
    }

    update(deltaTime: number) {
       
    }
 


    SetFont() {
        let label = this.node.getComponent(Label);
        label.font = null;
        label.useSystemFont = false;
        label.font = FONT;
        FONT.addRef();
    }
    protected onDestroy(): void {
        FONT?.decRef();

    }
}



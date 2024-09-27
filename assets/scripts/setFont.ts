import { _decorator, Component, Label, Node, resources, TTFFont } from 'cc';
const { ccclass, property } = _decorator;
let FONT: TTFFont = null;

export function LoadFont() {
    return new Promise((res, rej) => {
        resources.load('font/FZKAI', TTFFont, (err, data) => {
            console.log("动态加载字体资源", err, data)
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

  
    isSet= false;
    update(deltaTime: number) {
          if(FONT !=null && !this.isSet){
             this.SetFont(this.node);
          }
    }



    SetFont(node: Node) {
        this.isSet = true;
        let label = node.getComponent(Label);
        if (label) {
            label.font = null;
            label.useSystemFont = false;
            label.font = FONT;
            FONT.addRef();
        }
        if (node.children) {
            node.children.forEach(c => {
                this.SetFont(c);
            })
        }
    }
    protected onDestroy(): void {
        FONT?.decRef();

    }
}



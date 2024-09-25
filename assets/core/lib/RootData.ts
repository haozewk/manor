import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data/RootData')
export class RootData extends Component {
   
    public payload:string = "ddd "
    public gameType:string = ""
    public current:any
}



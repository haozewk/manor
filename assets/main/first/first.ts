import { _decorator,  Component, director} from 'cc';
const { ccclass } = _decorator;
import { LoadFont } from '../../scripts/setFont';

@ccclass('page/first')
export class first extends Component {
  

    protected onLoad(): void {
        this.LoadSubPackages();
    }
    async LoadSubPackages() {
        await LoadFont(); 
        director.loadScene("open");
    }
}



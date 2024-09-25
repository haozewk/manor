import { _decorator, Component, EventTouch, log, misc, Node, tween, UIOpacity, UITransform, v2, v3, Vec2 } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export  class joystick extends  Component {

    Joystick: Node;
    radius: number;
    arrow: Node;
    arrowMaxLenth: number = 100;    // 若要修改指针长度可直接修改这里
    joystickOpcity = 80;
    joystickPos;

    

    onLoad() {
        // 考虑缩放后的节点
        let nodeUI = this.node.getComponent(UITransform);
        this.radius = (nodeUI.width * this.node.scale.x) / 2;
        this.Joystick = this.node.getChildByName("Joystick");
        this.arrow = this.node.getChildByName("arrow");
        this.initJoystick();
    }

    initJoystick() {
        let nodeUiOpacity = this.node.getComponent(UIOpacity);
        nodeUiOpacity.opacity= this.joystickOpcity;    // 初始值 -> 透明度
        this.joystickPos = this.node.position;      // 初始值 -> 位置
         if(this.arrow.getComponent(UITransform))this.arrow.getComponent(UITransform).width = 0;
        this.Joystick.setPosition(v3(0,0,0))
        // this.Joystick.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.Joystick.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.Joystick.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.Joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(Event :EventTouch) {
        let nodeUI = this.node.getComponent(UITransform);
        let nodeOpacity = this.node.getComponent(UIOpacity);
        if(!nodeOpacity)this.node.addComponent(UIOpacity);
        nodeOpacity.opacity = 255;
        let position = Event.getLocation();
        let positionInJoystick = nodeUI.convertToNodeSpaceAR(v3(position.x,position.y,0));
        this.node.setPosition(this.node.position.add(v3(positionInJoystick)));
    }

    
    onTouchMove(e:EventTouch) {
        this.JoystickMove(e)
        this.arrowDirection()
    }

    onTouchEnd(e:EventTouch) {
        this.JoystickReset()
    }

    onTouchCancel(e: EventTouch) {
        this.JoystickReset()
    }

    arrowDirection() {
        // 设置箭头大小
        this.setArrowLength()
        // 计算夹角
        this.setArrow(v2(this.Joystick.position.x,this.Joystick.position.y));
    }


    /**
     * 
     * @param JoystickPos 摇杆节点坐标
     * @returns 夹角度数
     */
    setArrow(JoystickPos:Vec2) {
        let dir = JoystickPos.subtract(v2(0, 0))
        let vec = v2(0, 1);    // 水平向右的对比向量
        let radian = dir.signAngle(vec);    // 求方向向量与对比向量间的弧度
        let targetAngel = misc.radiansToDegrees(radian);    // 将弧度转换为角度
        // let rotate = radian * 180 / Math.PI;    // 公式
        this.arrow.angle = -targetAngel - 90;    // ***此处rotate正负值以及减去的角度根据自己的图片去修改***
    }

    returnArrowAngle() {
        let radin = misc.degreesToRadians(-this.arrow.angle - 90);
        log(this.arrow.angle)
        let vec = v2(0, 1);
        let targetVec = vec.rotate(-radin);
        let arrowUI = this.arrow.getComponent(UITransform);
        if(!arrowUI)this.arrow.addComponent(UITransform);
        let data = {
            angle: this.arrow.angle,    // 角度
            vec: targetVec,
            speedScale: arrowUI.width / this.arrowMaxLenth,
            moveState: this.Joystick.position.x != 0 && this.Joystick.position.y != 0 ? true : false,
        }

        return data;
    }

    setArrowLength() {
        let arrowUI = this.arrow.getComponent(UITransform);
        if(!arrowUI)this.arrow.addComponent(UITransform);
        let arrowOpacity = this.arrow.getComponent(UIOpacity);
        if(!arrowOpacity)this.arrow.addComponent(UIOpacity);
            let arrowParamScale = this.Joystick.position.length() * this.node.scale.x / this.radius;
            arrowUI.width = this.arrowMaxLenth * arrowParamScale;    // 箭头长度
            arrowOpacity.opacity = 255 * arrowParamScale;     // 箭头透明度
    }

    JoystickReset() {
        let time: number = 0.05;
        let arrowReset = tween(this.arrow).to(time, {width: 0, opacity: 0})

        tween(this.Joystick)
            .call(() => {
                arrowReset.start()
            })
            .call(() => {
                tween(this.node)
                .to(time, {opacity: this.joystickOpcity, position: this.joystickPos})
                .start()
            })
            .to(time, {x: 0, y: 0})
            .start()
    }

    JoystickMove(e: EventTouch) {
        // 移动
        let delta = e.getDelta();
        let moveDistance =v3(delta.x / this.node.scale.x, delta.y / this.node.scale.x)
        this.Joystick.setPosition(this.Joystick.position.add(moveDistance))      // 子节点位移会随着父节点缩放而缩放
        // 转换坐标
        let touchPos = e.getLocation();     // 以当前屏幕左下角为坐标系原点所获得的的位置
        let touchPosInNode = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touchPos.x,touchPos.y,0))
        let distanceBetweenTouchPosToJoystick = touchPosInNode.length() * this.node.scale.x; // 与前边同理
        // 限制移动 < 半径
        if (distanceBetweenTouchPosToJoystick > this.radius) {
            let lengthScale = this.radius / distanceBetweenTouchPosToJoystick;
            this.Joystick.setPosition(v3(touchPosInNode.x * lengthScale,touchPosInNode.y * lengthScale,0));
            // cc.log(lengthScale)
        }
    }
}

declare global {
    interface CDOTA_BaseNPC {
        Mover(targetPosition: Vector, time: number, callback?: Function, f?: boolean, f2?: boolean, f3?: boolean): void;
        Bezier3Mover(CP: Vector[], time: number): void; //简易贝塞尔运动
        Bezier2Mover(CP: Vector[], time: number, callback?: Function, f?): void; //简易2阶贝塞尔运动
    }
}
//简易运动器(目标点,运动时间,每帧回调,f为true结束不修复位置,f2为撞墙后轻微反弹防卡墙,f3为无视地形)
CDOTA_BaseNPC.Mover = function (
    p1: Vector,
    time: number,
    callback?: Function,
    f?: boolean,
    f2?: boolean,
    f3?: boolean
) {
    const unit = this;
    const interval = 0.03; // 更新间隔 (秒)
    const p = unit.GetAbsOrigin();
    if (!p1) return;
    const forwardVector = p1.__sub(p).Normalized();
    let elapsedTime = 0;
    let tween_p = [p.x, p.y, p.z];
    const tween = Tween.New(time, tween_p, [p1.x, p1.y, p1.z], 'outQuad');
    Timers.CreateTimer(interval, () => {
        if (!unit || unit.IsNull()) return;
        const idealSpeed = unit.GetIdealSpeed();
        if (idealSpeed < 5) {
            unit.SetOrigin(this.GetOrigin().__add(forwardVector.__mul(-80)));
            return;
        }
        elapsedTime += interval;
        tween.update(interval);
        let new_position = Vector(tween_p[0], tween_p[1], tween_p[2]);
        if (this.GetAbsOrigin().__sub(new_position).Length2D() > 1000) return null;
        const position = (new_position + forwardVector * 60) as Vector;

        if (!f3 && (!GridNav.IsPassable(new_position) || !GridNav.IsPassable(position))) {
            const position1 = (new_position - forwardVector * 60) as Vector;
            if (GridNav.IsPassable(position1)) {
                unit.SetAbsOrigin(position1);
            }
            return null;
        } else {
            callback && callback(new_position);
            unit.SetAbsOrigin(new_position);
        }
        if (elapsedTime >= time) {
            if (f2) {
                if (GridNav.IsPassable(new_position)) {
                    unit.SetOrigin(this.GetOrigin().__add(forwardVector.__mul(-80)));
                }
            }
            if (!f) {
                FindClearSpaceForUnit(this, this.GetOrigin(), true);
            }
            return null;
        }
        return interval;
    });
};
//3阶贝塞尔运动
CDOTA_BaseNPC.Bezier3Mover = function (CP: Vector[], time) {
    const interval = 0.03; // 更新间隔 (秒)
    let elapsedTime = 0;
    Timers.CreateTimer(interval, () => {
        elapsedTime += interval;
        let new_position = Bezier3(CP, elapsedTime / time);
        if (elapsedTime >= time || this.GetAbsOrigin().__sub(new_position).Length2D() > 1000) {
            FindClearSpaceForUnit(this, CP[3], true);
            return null;
        } else {
            this.SetAbsOrigin(new_position);
        }
        return interval;
    });
};
//2阶贝塞尔运动
CDOTA_BaseNPC.Bezier2Mover = function (CP: Vector[], time, callback?: Function, f: boolean = true) {
    const interval = 0.03; // 更新间隔 (秒)
    let elapsedTime = 0;
    Timers.CreateTimer(interval, () => {
        elapsedTime += interval;
        //判定P[2]是否是一个向量
        let cps = [CP[0], CP[1], CP[2]];
        if (!cps[2].Normalized) {
            //@ts-ignore
            if (cps[2] && !cps[2].IsNull()) {
                //@ts-ignore
                cps[2] = cps[2].GetAbsOrigin();
            } else {
                cps[2] = this.GetOrigin();
            }
        }
        let new_position = Bezier2(cps, elapsedTime / time);
        callback && callback(this, new_position);
        if (this.GetAbsOrigin().__sub(new_position).Length2D() > 1200) {
            return;
        }
        if (elapsedTime >= time) {
            if (f) {
                FindClearSpaceForUnit(this, Bezier2(cps, 1), true);
            }
            return null;
        } else {
            this.SetAbsOrigin(new_position);
        }
        return interval;
    });
};
export {};

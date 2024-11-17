import { BaseAbility, registerAbility } from '../../utils/dota_ts_adapter';

@registerAbility()
class test_1 extends BaseAbility {
    private readonly particleCount: number = 6; // 粒子数量
    private readonly radius: number = 360; // 环绕半径
    private readonly flyDistance: number = 1000; // 飞行距离
    private readonly rotationSpeed: number = 150; // 环绕速度（度/秒）
    private readonly flySpeed: number = 1200; // 飞行速度
    private readonly searchRadius: number = 1200; // 搜索敌方单位的半径
    private readonly cooldownTime: number = 4; // 粒子飞行冷却时间（可调整）

    OnSpellStart(): void {
        const caster = this.GetCaster();
        if (!caster) {
            print('Error: Caster is nil');
            return;
        }

        const pfxName = 'particles/units/heroes/hero_beastmaster/beastmaster_wildaxe.vpcf';
        const particles: ParticleID[] = [];
        const angles: number[] = []; // 每个粒子的初始角度
        const positions: Vector[] = []; // 粒子的当前位置
        const activeState: number[] = []; // 粒子的状态数组：0=环绕，1=飞向敌人，2=飞回施法者
        const timers: number[] = []; // 粒子的冷却时间
        const targets: (Vector | null)[] = []; // 记录粒子目标位置

        // 初始化粒子和状态
        for (let i = 0; i < this.particleCount; i++) {
            const pfx = ParticleManager.CreateParticle(pfxName, ParticleAttachment.CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(pfx, 0, caster.GetAbsOrigin());
            particles.push(pfx);

            const angle = (i / this.particleCount) * 360; // 每个粒子的初始角度均匀分布
            angles.push(angle);
            positions.push(caster.GetAbsOrigin()); // 初始化位置为施法者原点
            activeState.push(0); // 状态：0=环绕，1=飞向敌人，2=飞回施法者
            timers.push(i * 1); // 每个粒子启动时的延迟时间（以秒为单位）
            targets.push(null); // 初始化目标位置为空
        }

        let elapsedTime = 0; // 时间累计
        const interval = 1 / 60; // 提高更新频率为 60FPS

        // 定时器更新逻辑
        Timers.CreateTimer(interval, () => {
            elapsedTime += interval;
            const origin = caster.GetAbsOrigin(); // 实时获取单位当前位置
            const enemy = this.findNearbyEnemy(caster); // 获取最近的敌人

            // 更新粒子位置
            for (let i = 0; i < particles.length; i++) {
                if (activeState[i] === 1 || activeState[i] === 2) {
                    // 飞行状态
                    const currentPos = positions[i];
                    let target = targets[i] || origin; // 使用目标位置（敌人）或者施法者位置作为目标

                    if (enemy && activeState[i] === 1) {
                        target = enemy.GetAbsOrigin();
                        // 如果有敌人，粒子飞向敌人
                        const direction = target.__sub(currentPos).Normalized();
                        const speed = this.flySpeed * interval;
                        const nextPos = currentPos.__add(direction.__mul(speed));

                        // 检查是否到达目标
                        if (currentPos.__sub(target).Length2D() <= speed) {
                            positions[i] = target; // 设置为目标位置
                            activeState[i] = 2; // 切换到返回状态
                            targets[i] = origin; // 设置返回目标为施法者位置
                        } else {
                            positions[i] = nextPos; // 更新位置
                        }
                    } else if (!enemy && activeState[i] === 1) {
                        // 没有敌人，保持在飞行状态并继续围绕施法者旋转
                        activeState[i] = 0; // 切换回环绕状态
                        targets[i] = null; // 清空目标
                    } else if (activeState[i] === 2) {
                        // 返回施法者
                        const direction = target.__sub(currentPos).Normalized();
                        const speed = this.flySpeed * interval;
                        const nextPos = currentPos.__add(direction.__mul(speed));

                        // 检查是否到达施法者位置
                        if (currentPos.__sub(target).Length2D() <= speed) {
                            positions[i] = target; // 设置为施法者位置
                            activeState[i] = 0; // 完成飞行，回到环绕状态
                            targets[i] = null; // 清空目标
                        } else {
                            positions[i] = nextPos; // 更新位置
                        }
                    }

                    ParticleManager.SetParticleControl(particles[i], 0, positions[i]);
                } else if (activeState[i] === 0) {
                    // 环绕状态
                    const angle = (angles[i] + this.rotationSpeed * interval) % 360; // 更新角度
                    angles[i] = angle;
                    const radian = (Math.PI * angle) / 180;
                    const x = origin.x + Math.cos(radian) * this.radius;
                    const y = origin.y + Math.sin(radian) * this.radius;
                    const z = origin.z;
                    positions[i] = Vector(x, y, z);

                    ParticleManager.SetParticleControl(particles[i], 0, positions[i]);
                }
            }

            // 控制每隔一段时间启动下一个粒子飞行
            for (let i = 0; i < particles.length; i++) {
                if (timers[i] > 0) {
                    timers[i] -= interval; // 倒计时
                } else if (activeState[i] === 0) {
                    activeState[i] = 1; // 切换到飞向敌人状态
                    timers[i] = this.cooldownTime; // 设置冷却时间为变量
                }
            }

            return interval; // 下一帧继续
        });
    }

    /**
     * 寻找附近的敌方单位
     * @param caster 施法者单位
     * @returns 最近的敌方单位或 null
     */
    private findNearbyEnemy(caster: CDOTA_BaseNPC): CDOTA_BaseNPC | null {
        const enemies = FindUnitsInRadius(
            caster.GetTeam(), // 自己的队伍
            caster.GetAbsOrigin(), // 施法者位置
            undefined, // 不缓存单位
            this.searchRadius, // 搜索半径
            UnitTargetTeam.ENEMY, // 目标敌方单位
            UnitTargetType.ALL, // 任意类型的单位
            UnitTargetFlags.NONE, // 没有特殊标记
            FindOrder.ANY, // 任意顺序
            false // 是否允许缓存
        );

        if (enemies.length > 0) {
            return enemies[0]; // 返回最近的敌方单位
        }

        return null; // 如果没有敌人，返回 null
    }
}

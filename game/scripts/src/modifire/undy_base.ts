import { BaseModifier, registerModifier } from '../utils/dota_ts_adapter';

// declare interface ApplyDamageOptions {
//     victim: CDOTA_BaseNPC;
//     attacker: CDOTA_BaseNPC;
//     damage: number;
//     damage_type: DAMAGE_TYPES;
//     damage_flags?: DOTADamageFlag_t;
//     ability?: CDOTABaseAbility;
// }
@registerModifier()
class undy_base extends BaseModifier {
    OnCreated(params: object): void {
        if (!IsServer()) return;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK, ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS];
    }

    OnAttack(event: ModifierAttackEvent): void {
        if (event.attacker != this.GetParent()) return;
        const damageTable = {
            victim: event.target,
            attacker: this.GetParent(),
            damage: 50,
            damage_type: 100,
            damage_flags: DamageFlag.NONE,
            ability: null,
        };
        ApplyDamage(damageTable);
    }
}

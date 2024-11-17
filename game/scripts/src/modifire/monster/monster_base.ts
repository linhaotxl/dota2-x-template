import { BaseModifier, registerModifier } from '../../utils/dota_ts_adapter';
import * as diffcult from '../../json/game_config.json';

@registerModifier()
class monster_base extends BaseModifier {
    base_value;
    OnCreated(params: object): void {
        if (!IsServer()) return;
        const unit = this.GetCaster();
        const level = unit.GetLevel();
        const value = diffcult['DIFFICULTY_FACTOR_ED_0'].value;
        const param = diffcult['DIFFICULTY_FACTOR_ED_0'].extra_param;
        const base_value = level * value * param;
        this.base_value = base_value;
        unit.SetBaseMaxHealth(unit.GetHealth() * 5);
        unit.ModifyHealth(unit.GetMaxHealth() * base_value, null, false, 0);
        unit.SetBaseDamageMin(base_value / 2);
        unit.SetBaseDamageMax(base_value / 2);
        unit.SetPhysicalArmorBaseValue(base_value / 20);
    }
    GetModifierHealthBonus(): number {
        return this.base_value;
    }
    IsHidden(): boolean {
        return true;
    }
}

import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../utils/dota_ts_adapter';

@registerAbility()
class item_1 extends BaseAbility {
    GetIntrinsicModifierName(): string {
        return 'item_1_modifire';
    }
}

@registerModifier()
class item_1_modifire extends BaseModifier {
    IsHidden(): boolean {
        return true;
    }
}

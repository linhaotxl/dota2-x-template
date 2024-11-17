export function isHeroCanCast(): boolean {
    const heroEntityIndex = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
    $.Msg(heroEntityIndex);
    //判定玩家英雄是否存活
    $.Msg(!Entities.IsAlive(heroEntityIndex));
    if (!Entities.IsAlive(heroEntityIndex)) {
        GameEvents.SendEventClientSide('dota_hud_error_message', {
            reason: 0,
            message: $.Localize('#token_D834_6F2938A8'),
            sequenceNumber: 1,
        });
        return false;
    }
    return true;
}

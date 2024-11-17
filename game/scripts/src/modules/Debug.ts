import { reloadable } from '../utils/tstl-utils';

@reloadable
export class Debug {
    DebugEnabled = false;
    // 在线测试白名单
    OnlineDebugWhiteList = [
        86815341, // Xavier
    ];

    constructor() {
        // 工具模式下开启调试
        this.DebugEnabled = IsInToolsMode();
    }
}

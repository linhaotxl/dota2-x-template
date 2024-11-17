import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { render, useNetTableKey } from 'react-panorama-x';
import './native_pre';

GameUI.RootPanel = $.GetContextPanel()?.GetParent()?.GetParent()?.GetParent() as Panel;

declare global {
    interface CDOTA_PanoramaScript_GameUI {
        RootPanel: Panel;
    }
}
const Main: FC = () => {
    return <Panel className="root" hittest={false}></Panel>;
};

render(<Main />, $.GetContextPanel());

//GridNav.ts
//该文件用于扩展GridNav类,不允许内部有enhance以外的依赖

declare global {
    interface GridNav {
        IsPassable;
        IsPassableStrict; //严格判定点是否可通行,消耗更多资源
        AddFilter;
        filters: Function[];
        map: Map<string, boolean>;
        SetCustomBlock(v: Vector, b?: boolean);
        SetCustomBlockX9(v: Vector, b?: boolean);
        GetCustomBlock;
    }
}

GridNav.filters = GridNav.filters || [];
GridNav.map = GridNav.map || new Map<string, boolean>();

//判定点是否可通行
GridNav.IsPassable = function (v: Vector) {
    for (const element of GridNav.filters) {
        if (!element(v)) {
            return false;
        }
    }
    if (!GridNav.IsTraversable(v)) {
        return false;
    }
    if (GridNav.GetCustomBlock(v)) {
        return false;
    }
    return true;
};

//严格判定点是否可通行
GridNav.IsPassableStrict = function (v: Vector) {
    if (!GridNav.IsPassable(v)) {
        return false;
    }
    //遍历向量周围的4个点,判定是否可通行
    for (let i = 0; i < 4; i++) {
        const element = RotatePosition(Vector(0, 0, 0), QAngle(0, 90 * i, 0), Vector(32, 0, 0));
        if (!GridNav.IsPassable(element + v)) {
            return false;
        }
    }
    return true;
};

//添加一个过滤器,添加判定可通行条件
GridNav.AddFilter = function (filter: (v: Vector) => boolean) {
    GridNav.filters.push(filter);
};

//设置某个格子阻碍
GridNav.SetCustomBlock = function (v: Vector, b: boolean = true) {
    GridNav.map.set(Math.round(v.x / 128) + '_' + Math.round(v.y / 128), b);
};

//设置某个格子及周围8个格子全部阻碍
GridNav.SetCustomBlockX9 = function (v: Vector, b: boolean = true) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            GridNav.SetCustomBlock(v.__add(Vector(i * 128, j * 128, 0)), b);
        }
    }
};

//获取某个格子是否阻碍
GridNav.GetCustomBlock = function (v: Vector) {
    return GridNav.map.get(Math.round(v.x / 128) + '_' + Math.round(v.y / 128));
};

export {};

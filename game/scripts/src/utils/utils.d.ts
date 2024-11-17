declare global {
    function FindVecByName(this: void, name: string): Vector;
    function Bezier3(this: void, p: Vector[], t: number): Vector;
    function Bezier2(this: void, p: Vector[], t: number): Vector;
    function GetUnix(this: void): number;
    function split(this: void, str: string, sep: string): string[];
}
export {};

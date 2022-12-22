export interface UseRect {
    (dispatchChange: DispatchChange, options?: Options): Result;
}
export interface Rect {
    bottom: number;
    height: number;
    scrollHeight: number;
    left: number;
    right: number;
    top: number;
    width: number;
    scrollWidth: number;
    x: number;
    y: number;
}
export interface DispatchChange {
    (rect: Rect): void;
}
export interface Options {
    resize?: boolean;
}
export declare type Result = [SetElement, Revalidate];
export interface SetElement {
    (element: Element | null): void;
}
export interface Revalidate {
    (options?: RevalidateOptions): void;
}
export interface RevalidateOptions {
    force?: boolean;
}
export declare function useRect(dispatchChange: DispatchChange, { resize }?: Options): Result;

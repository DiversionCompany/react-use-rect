export interface UseWindowOn<T extends keyof WindowEventMap> {
    (eventType: T, callback: (event: WindowEventMap[T]) => void): void;
}
export declare function useWindowOn<T extends keyof WindowEventMap>(eventType: T, callback: (event: WindowEventMap[T]) => void): void;

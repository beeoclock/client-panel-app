export interface ICancelable<T> {
    cancel$(item: T): unknown;
    cancelAsync(item: T): Promise<unknown>;
}

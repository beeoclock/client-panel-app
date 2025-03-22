export interface ICreatable<T> {
    create$(item: T): unknown;
    createAsync(item: T): Promise<unknown>;
}

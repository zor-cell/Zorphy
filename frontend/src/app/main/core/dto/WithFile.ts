export type WithFile<T> = {
    data: T;
    file: File | null;
};
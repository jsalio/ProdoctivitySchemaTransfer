/**
 * Interface defining a generic request builder for constructing objects of type T.
 */
export interface IRequest<T> {
    /**
     * Builds and returns an object of type T.
     * @returns The constructed object of type T.
     */
    build: () => T;
}
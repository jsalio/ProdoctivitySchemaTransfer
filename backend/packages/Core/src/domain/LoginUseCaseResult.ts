/**
 * Represents the result of a successful login operation.
 * Contains the authentication token and store information for the logged-in user.
 */
export type LoginUseCaseResult = {
    /** 
     * The store or organization identifier that the user is associated with.
     * This is used to scope the user's access within a multi-tenant system.
     */
    store: string;
    
    /** 
     * Authentication token (JWT) that should be included in subsequent API requests
     * to authenticate the user's session.
     */
    token: string;
};

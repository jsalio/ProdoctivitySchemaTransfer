import { ValidationError } from "../ValidationError";
import { Credentials } from '../Credentials';

/**
 * Validates login credentials for authentication.
 * This class is responsible for ensuring that all required login fields
 * are provided and meet the basic validation criteria.
 */
export class LoginValidator {

    /**
     * Creates a new instance of LoginValidator.
     * @param credentials - The credentials object containing login information to be validated.
     */
    constructor(private readonly credentials: Credentials) { }

    /**
     * Validates the provided credentials.
     * @returns An array of ValidationError objects if validation fails, or an empty array if validation passes.
     * @remarks
     * The following validations are performed:
     * - Username must be provided and non-empty
     * - Password must be provided and non-empty
     * - Server information (server, apiKey, apiSecret) must be provided and non-empty
     * - Either organization or database must be provided (at least one of them)
     */
    Validate(): ValidationError<Credentials>[] {
        const errors: ValidationError<Credentials>[] = [];

        if (!this.credentials.username || this.credentials.username.trim() === '') {
            errors.push({ field: 'username', message: 'Username is required' });
        }

        if (!this.credentials.password || this.credentials.username.trim() === '') {
            errors.push({ field: 'password', message: 'Password is required' });
        }

        if (!this.credentials.serverInformation.server || this.credentials.serverInformation.server.trim() === '') {
            errors.push({ field: 'serverInformation', message: 'Server is required' });
        }

        if (!this.credentials.serverInformation.apiKey || this.credentials.serverInformation.apiKey.trim() === '') {
            errors.push({ field: 'serverInformation', message: 'ApiKey is required' });
        }

        if (!this.credentials.serverInformation.apiSecret || this.credentials.serverInformation.apiSecret.trim() === '') {
            errors.push({ field: 'serverInformation', message: 'ApiSecret is required' });
        }


        if (!this.credentials.serverInformation.organization || this.credentials.serverInformation.organization.trim() === '') {
            if (!this.credentials.serverInformation.dataBase || this.credentials.serverInformation.dataBase.trim() === '') {
                errors.push({ field: 'serverInformation', message: 'DataBase is required' });
            }
        }

        if (!this.credentials.serverInformation.dataBase || this.credentials.serverInformation.dataBase.trim() === '') {
            if (!this.credentials.serverInformation.organization || this.credentials.serverInformation.organization.trim() === '') {
                errors.push({ field: 'serverInformation', message: 'Organization is required' });
            }
        }
        return errors;
    }
}
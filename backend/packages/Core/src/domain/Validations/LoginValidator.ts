import { ValidationError } from "../ValidationError";
import { Credentials } from '../Credentials'
export class LoginValidator {

    constructor(private readonly credentials: Credentials) { }

    Validate() {
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
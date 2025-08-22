import { AdditionalInfo } from './AdditionalInfo'
export type Credentials = {
    username: string;
    password: string;
    serverInformation: AdditionalInfo;
    store?: string,
    token?: string
}



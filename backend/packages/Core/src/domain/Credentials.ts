import { AdditionalInfo } from "./AdditionalInformation";

export type Credentials = {
    username: string;
    password: string;
    serverInformation: AdditionalInfo;
    store?:string,
    token?:string
};

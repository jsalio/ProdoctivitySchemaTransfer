import { StoreType } from "./StoreType";


export interface BaseRequestBody {
    store?: StoreType;
    [key: string]: unknown;
}

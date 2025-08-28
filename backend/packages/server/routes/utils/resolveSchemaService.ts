import { DependenceInjectionContainer } from "packages/Core/src";
import { SchemaService } from "../../services/Schema";
import { SERVICE_KEYS } from "./SERVICE_KEYS";

// Utility functions
export const resolveSchemaService = (
    di: DependenceInjectionContainer,
    store?: string
): SchemaService => {
    const serviceKey = store === "Cloud"
        ? SERVICE_KEYS.Cloud
        : SERVICE_KEYS.Fluency;
    return di.resolve<SchemaService>(serviceKey);
};

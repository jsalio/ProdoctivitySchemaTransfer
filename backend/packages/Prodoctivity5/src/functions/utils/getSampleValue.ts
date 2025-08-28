import { DataType } from "../../types/DataType";


export function getSampleValue(dataType: DataType) {
    switch (dataType) {
        case DataType.Alphanumeric:
            return "Sample Value";
        case DataType.Numeric:
            return 1;
        case DataType.Decimal:
            return 1.1;
        case DataType.Boolean:
            return true;
        case DataType.Date:
            return new Date();
        case DataType.DateTime:
            return new Date();
        
    }
}

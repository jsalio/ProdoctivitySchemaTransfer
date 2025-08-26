enum DataType {
    None,
    Alphanumeric,
    Numeric,
    Decimal,
    Boolean,
    Date,
    DateTime
}

enum ProductivityTargetDataType {
    None,
    Alphanumeric,
    IntegerNumber,
    DecimalNumber,
    Boolean,
    Date,
    DateTime
}

const MiddleWareToProdoctivityDictionary: Map<DataType, ProductivityTargetDataType> = new Map([
    [DataType.None, ProductivityTargetDataType.None],
    [DataType.Alphanumeric, ProductivityTargetDataType.Alphanumeric],
    [DataType.Numeric, ProductivityTargetDataType.IntegerNumber],
    [DataType.Decimal, ProductivityTargetDataType.DecimalNumber],
    [DataType.Boolean, ProductivityTargetDataType.Boolean],
    [DataType.Date, ProductivityTargetDataType.Date],
    [DataType.DateTime, ProductivityTargetDataType.DateTime]
]);

const GetDataTypeByString = (dataType: string): DataType => {
    const upperDataType = dataType.toUpperCase();
    switch (upperDataType) {
        case "NONE":
            return DataType.None;
        case "ALPHANUMERIC":
            return DataType.Alphanumeric;
        case "NUMERIC":
            return DataType.Numeric;
        case "DECIMAL":
            return DataType.Decimal;
        case "BOOLEAN":
            return DataType.Boolean;
        case "DATE":
            return DataType.Date;
        case "DATETIME":
            return DataType.DateTime;
        default:
            return DataType.None;
    }
}
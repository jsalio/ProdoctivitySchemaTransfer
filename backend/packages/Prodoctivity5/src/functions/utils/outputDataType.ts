export enum ProductivityTargetDataType {
    DateTime,
    Alphanumeric,
    Date,
    Boolean,
    DecimalNumber,
    IntegerNumber,
    List,
    Image
}

enum ControlType {
    DateTimePicker,
    TextBox,
    Checkbox,
    Dropdown,
    ButtonImageFile
}

enum DataElementFinalizer {
    None
}

enum DataElementListSeparator {
    None
}

enum DataElementOrderType {
    Ascending
}

enum DataElementPenultimateSeparator {
    And
}

interface OutputFormat {
    DataType: ProductivityTargetDataType;
    Format: string;
}

interface DataElementOutput {
    DataElementFinalizer: DataElementFinalizer;
    DataElementListSeparator: DataElementListSeparator;
    DataElementOrderType: DataElementOrderType;
    DataElementPenultimateSeparator: DataElementPenultimateSeparator;
    OutputFormat: OutputFormat;
}

function buildOutputByDataType(dataType: ProductivityTargetDataType, sourceMaxLength: number): DataElementOutput {
    const controlTypes: Map<ProductivityTargetDataType, ControlType> = new Map([
        [ProductivityTargetDataType.DateTime, ControlType.DateTimePicker],
        [ProductivityTargetDataType.Alphanumeric, ControlType.TextBox],
        [ProductivityTargetDataType.Date, ControlType.DateTimePicker],
        [ProductivityTargetDataType.Boolean, ControlType.Checkbox],
        [ProductivityTargetDataType.DecimalNumber, ControlType.TextBox],
        [ProductivityTargetDataType.IntegerNumber, ControlType.TextBox],
        [ProductivityTargetDataType.List, ControlType.Dropdown],
        [ProductivityTargetDataType.Image, ControlType.ButtonImageFile]
    ]);

    return {
        DataElementFinalizer: DataElementFinalizer.None,
        DataElementListSeparator: DataElementListSeparator.None,
        DataElementOrderType: DataElementOrderType.Ascending,
        DataElementPenultimateSeparator: DataElementPenultimateSeparator.And,
        OutputFormat: {
            DataType: dataType,
            Format: ""
        }
    };
}
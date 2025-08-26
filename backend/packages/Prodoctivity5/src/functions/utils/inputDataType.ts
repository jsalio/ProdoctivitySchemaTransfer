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

enum ControlLayout {
    Horizontal,
    Vertical
}

enum ControlSize {
    Normal,
    Small,
    Large
}

enum DateMinMaxType {
    Custom,
    None
}

interface DataElementInput {
    ControlLayout: ControlLayout;
    ControlSize: ControlSize;
    ControlType: ControlType;
    CustomMask: string | null;
    DateMinMaxType: DateMinMaxType;
    KeepAllMaskCharacters: boolean;
    MaxLength: number;
}

function buildInputByDataType(dataType: ProductivityTargetDataType, sourceMaxLength: number): DataElementInput {
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
        ControlLayout: ControlLayout.Horizontal,
        ControlSize: ControlSize.Normal,
        ControlType: controlTypes.get(dataType)!,
        CustomMask: null,
        DateMinMaxType: DateMinMaxType.Custom,
        KeepAllMaskCharacters: false,
        MaxLength: dataType === ProductivityTargetDataType.Alphanumeric ? parseInt(sourceMaxLength.toString()) : 0
    };
}
import { DataType } from '../../types/DataType';
import { ProductivityTargetDataType } from '../../types/ProductivityTargetDataType';

export const MiddleWareToProdoctivityDictionary: Map<DataType, ProductivityTargetDataType> =
  new Map([
    [DataType.None, ProductivityTargetDataType.None],
    [DataType.Alphanumeric, ProductivityTargetDataType.Alphanumeric],
    [DataType.Numeric, ProductivityTargetDataType.IntegerNumber],
    [DataType.Decimal, ProductivityTargetDataType.DecimalNumber],
    [DataType.Boolean, ProductivityTargetDataType.Boolean],
    [DataType.Date, ProductivityTargetDataType.Date],
    [DataType.DateTime, ProductivityTargetDataType.DateTime],
    [DataType.Currency, ProductivityTargetDataType.Currency],
    [DataType.Logical, ProductivityTargetDataType.Boolean],
  ]);

export const GetDataTypeByString = (dataType: string): DataType => {
  const upperDataType = dataType.toUpperCase();
  // console.log('dataType:', upperDataType)
  switch (upperDataType) {
    case 'NONE':
      return DataType.None;
    case 'ALPHANUMERIC':
      return DataType.Alphanumeric;
    case 'NUMERIC':
      return DataType.Numeric;
    case 'DECIMAL':
      return DataType.Decimal;
    case 'TIME':
      return DataType.DateTime;
    case 'BOOLEAN':
      return DataType.Boolean;
    case 'DATE':
      return DataType.Date;
    case 'DATETIME':
      return DataType.DateTime;
    case 'CURRENCY':
      return DataType.Decimal;
    case 'LOGICAL':
      return DataType.Boolean;
    default:
      return DataType.None;
  }
};

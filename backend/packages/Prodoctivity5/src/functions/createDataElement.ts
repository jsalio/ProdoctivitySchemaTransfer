import { Credentials, DataElement, Result } from '@schematransfer/core';
import { KeywordOptions } from '../types/KeywordOptions';
import { getDataElements } from './getDataElements';
import { GetDataTypeByString, MiddleWareToProdoctivityDictionary } from './utils/dataType';
import { getSampleValue } from './utils/getSampleValue';
import { RequestManager } from '@schematransfer/requestmanager';

const DEFAULT_OPTIONS: Required<KeywordOptions> = {
  TopicName: 'General',
  CultureLanguageName: 'Spanish - Dominican Republic',
  unique: false,
  defaultValue: {},
  IsReferenceField: false,
  NotVisibleOnDocument: false,
  ReadOnly: false,
  Autocomplete: false,
};

export const createKeyword = async (
  credential: Credentials,
  createKeywordRequest: {
    name: string;
    documentTypeId: string;
    dataType: string;
    required: boolean;
  },
  options: KeywordOptions = {},
): Promise<Result<DataElement, Error>> => {
  //console.log('request on middleware:', JSON.stringify(createKeywordRequest, null, 2))
  if (!createKeywordRequest.name?.trim()) {
    return {
      ok: false,
      error: new Error('Keyword name cannot be empty'),
    };
  }

  const manager = new RequestManager({
    retries: 3,
    retryDelay: 1000,
    timeout: 600000,
  });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;

  const headers: Record<string, string> = {};
  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const generateName = createKeywordRequest.name.trim(); //+generateShortGuid(); //use for debug

  const requestBody = {
    name: generateName,
    required: createKeywordRequest.required,
    question: createKeywordRequest.name.trim(),
    instructions: createKeywordRequest.name.trim(),
    Definition: createKeywordRequest.name.trim(),
    alternativeQuestion: createKeywordRequest.name.trim(),
    dataType: MiddleWareToProdoctivityDictionary.get(
      GetDataTypeByString(createKeywordRequest.dataType),
    )!,
    sampleValue: getSampleValue(GetDataTypeByString(createKeywordRequest.dataType)),
    ...mergedOptions,
  };

  if (requestBody.dataType === 0) {
    return {
      ok: false,
      error: new Error('Data type cannot be None'),
    };
  }

  console.clear();
  // console.log('request on Core:', JSON.stringify(requestBody, null, 2))
  const result = await manager
    .build(credential.serverInformation.server, 'POST')
    .addHeaders(headers)
    .addBody(requestBody)
    .executeAsync<any>(`site/api/v0.1/dictionary/data-elements`);

  if (!result.ok) {
    return result;
  }
  const listOfDataElements = await getDataElements(credential);

  if (!listOfDataElements.ok) {
    return {
      ok: false,
      error: new Error('Can determinate if data element is created'),
    };
  }
  const dataElement = listOfDataElements.value
    .values()
    .find((x: DataElement) => x.name === generateName);

  if (!dataElement) {
    return {
      ok: false,
      error: new Error('Data element not found'),
    };
  }

  return {
    ok: true,
    value: {
      id: dataElement.id,
      name: dataElement.name,
      dataType: dataElement.dataType,
      required: dataElement.required,
    },
  };
};

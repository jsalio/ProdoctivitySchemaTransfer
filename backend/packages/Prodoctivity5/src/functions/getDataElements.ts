import { Credentials, DataElement, Result } from '@schematransfer/core';
import { FluencyDataElement } from '../types/FluencyDataElement';
import { RequestManager } from '@schematransfer/requestmanager';

export const getDataElements = async (
  credential: Credentials,
): Promise<Result<Array<DataElement>, Error>> => {
  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const result = await manager
    .build(credential.serverInformation.server, 'GET')
    .addHeaders(headers)
    .executeAsync<FluencyDataElement[]>('site/api/v0.1/dictionary/data-elements');

  if (!result.ok) {
    return result as Result<Array<DataElement>, Error>;
  }

  const body: FluencyDataElement[] = result.value;
  const dataElements = body.map((x) => ({
    id: x.id.toString(),
    name: x.name,
    dataType: x.dataType,
    required: x.required.toString(),
  }));
  return {
    ok: true,
    value: dataElements,
  };
};

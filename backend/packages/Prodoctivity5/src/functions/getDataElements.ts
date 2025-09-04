import { Credentials, DataElement, Result } from '@schematransfer/core';
import { FluencyDataElement } from '../types/FluencyDataElement';

export const getDataElements = async (
  credential: Credentials,
): Promise<Result<Array<DataElement>, Error>> => {
  try {
    const headers = new Headers();
    headers.append('x-api-key', credential.serverInformation.apiKey);
    const basicAuthText = `${credential.username + '@prodoctivity capture'}:${credential.password}`;
    headers.append('Authorization', `Basic ${btoa(basicAuthText)}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };
    const response = await fetch(
      `${credential.serverInformation.server}/site/api/v0.1/dictionary/data-elements`,
      requestOptions,
    );
    if (response.status < 199 && response.status > 299) {
      return {
        ok: false,
        error: new Error('No response received.'),
      };
    }
    const body: FluencyDataElement[] = await response.json();

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
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Re-throw para que el llamador maneje el error
  }
};

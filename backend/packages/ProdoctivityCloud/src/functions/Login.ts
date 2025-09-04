import { CoreResult, Credentials, Result } from '@schematransfer/core';

/**
 *
 * @param credential
 * @returns
 */
export const LoginToProdoctivity = async (
  credential: Credentials,
): Promise<Result<string, Error>> => {
  try {
    const request = {
      username: credential.username,
      password: credential.password,
      organizationId: credential.serverInformation.organization,
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request),
      redirect: 'follow',
    };

    const response = await fetch(
      `${credential.serverInformation.server}/api/login`,
      requestOptions,
    );
    if (!response.ok) {
      return {
        ok: false,
        error: new Error(`Login failed with status ${response.status}: ${response.statusText}`),
      };
    }

    const body = await response.json();
    if (response.status === 200 && body.token) {
      return {
        ok: true,
        value: body.token,
      };
    }

    return {
      ok: false,
      error: new Error('No token received in response'),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Error de llamada.'),
    };
  }
};

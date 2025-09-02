/**
 * Result type for operations that may fail.
 * @template T - The type of the value returned on success.
 * @template E - The type of the error returned on failure (default: Error).
 */

import { AppCodeError } from "../domain/AppCodeError";

export type Result<T, E = Error> = { ok: true; value: T; } |
{ ok: false; error: E; };

export type CoreResult<T,Code=AppCodeError, E=Error>=
{ok:true,value:T}|{ok:false,code:Code, error:E}

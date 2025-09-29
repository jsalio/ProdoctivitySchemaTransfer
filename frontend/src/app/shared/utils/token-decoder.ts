/**
 * Decodifica un JWT token sin verificar la firma
 * @param token - El JWT token como string
 * @returns El payload decodificado o null si el token es inválido
 */
// eslint-disable-next-line
function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
}

/**
 * Valida si un JWT token está expirado
 * @param token - El JWT token como string
 * @returns true si el token está expirado, false si está válido, null si el token es inválido
 */
export function isTokenExpired(token: string): boolean | null {
  if (!token || typeof token !== 'string') {
    return true; // Token inválido
  }

  if (token === '') {
    return true;
  }

  const payload = decodeJWT(token);

  if (!payload) {
    return true; // No se pudo decodificar el token
  }

  // Verificar si el token tiene el campo 'exp' (expiration time)
  if (!payload.exp) {
    console.warn('El token no contiene información de expiración');
    return true;
  }

  // El 'exp' está en segundos, Date.now() está en milisegundos
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;

  return currentTime >= expirationTime;
}

/**
 * Obtiene información detallada sobre el token
 * @param token - El JWT token como string
 * @returns Objeto con información del token o null si es inválido
 */
// eslint-disable-next-line
export function getTokenInfo(token: string): {
  isExpired: boolean;
  expiresAt: Date;
  timeUntilExpiry: number; // en milisegundos
  // eslint-disable-next-line
  payload: any;
} | null {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return null;
  }

  const expirationTime = payload.exp * 1000; // Convertir a milisegundos
  const currentTime = Date.now();
  const isExpired = currentTime >= expirationTime;

  return {
    isExpired,
    expiresAt: new Date(expirationTime),
    timeUntilExpiry: expirationTime - currentTime,
    payload,
  };
}

/**
 * Valida si el token expirará pronto (dentro de un tiempo específico)
 * @param token - El JWT token como string
 * @param minutesThreshold - Minutos antes de la expiración para considerar "pronto a expirar"
 * @returns true si el token expirará pronto
 */
export function isTokenExpiringSoon(token: string, minutesThreshold = 5): boolean | null {
  const tokenInfo = getTokenInfo(token);

  if (!tokenInfo) {
    return null;
  }

  const thresholdMs = minutesThreshold * 60 * 1000;
  return tokenInfo.timeUntilExpiry <= thresholdMs && !tokenInfo.isExpired;
}

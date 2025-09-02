// auth/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISOS_KEY = 'permisos';

// Para múltiples permisos específicos
export const RequirePermisos = (...permisos: string[]) => SetMetadata(PERMISOS_KEY, permisos);

// Para permisos basados en recurso y acción
export const RequirePermission = (resource: string, action: string) => 
  SetMetadata(PERMISOS_KEY, [`${resource}.${action}`]);
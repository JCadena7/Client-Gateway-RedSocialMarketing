import {CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { PERMISOS_KEY } from '../decorators/permissions.decorator';
import { AUTH_SERVICE } from "../../config/services";
  
  @Injectable()
  export class RbacGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly rbacService: ClientProxy, private readonly reflector: Reflector) {}
  
    private permisoNameToId = new Map<string, number>();
    private lastSync = 0;
  
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const required =
        this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
          ctx.getHandler(),
          ctx.getClass(),
        ]) || [];
  
      // Si no requiere permisos, permitir
      if (required.length === 0) return true;
  
      const req = ctx.switchToHttp().getRequest() as any;
      const user = req.user;
      if (!user?.rolId) {
        throw new ForbiddenException('No se encontró rol del usuario en la request');
      }
  
      await this.ensurePermisosCatalog();
  
      // Traducir nombres de permisos -> ids
      const requiredIds = required.map((name) => {
        const id = this.permisoNameToId.get(name);
        if (!id) {
          throw new ForbiddenException(`Permiso desconocido: ${name}`);
        }
        return id;
      });
  
      // Traer permisos del rol
      const permisoIds: number[] = await firstValueFrom(
        this.rbacService
          .send<number[]>('rolePermiso.listByRole', { rolId: Number(user.rolId) })
          .pipe(timeout(1500)),
      );
  
      const hasAll = requiredIds.every((id) => permisoIds.includes(id));
      if (!hasAll) {
        throw new ForbiddenException('Permisos insuficientes');
      }
      return true;
    }
  
    private async ensurePermisosCatalog() {
      const now = Date.now();
      if (this.permisoNameToId.size > 0 && now - this.lastSync < 60_000) return; // cache 60s
      const permisos = await firstValueFrom(
        this.rbacService
          .send<Array<{ id: number; nombre: string }>>('permiso.list', {})
          .pipe(timeout(1500)),
      );
      this.permisoNameToId.clear();
      for (const p of permisos) this.permisoNameToId.set(p.nombre, p.id);
      this.lastSync = now;
    }
  }
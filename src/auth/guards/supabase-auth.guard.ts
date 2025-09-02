import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";
import { USER_SERVICE } from "../../config/services";
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase;

  constructor(@Inject(USER_SERVICE) private readonly usersService: ClientProxy) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || '') as string;
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Intentar obtener rol desde metadata de Supabase (probablemente vacío)
      const appMeta = (user as any).app_metadata || {};
      const userMeta = (user as any).user_metadata || {};

      let rolId: number | null = null;
      let roleName = 'authenticated';

      // Como no tienes roles en Supabase, ir directo al microservicio
      if (user.email) {
        // console.log('🔍 Starting user lookup for email:', user.email.toLowerCase());
        try {
          const res: any = await firstValueFrom(
            this.usersService.send('findAllUsers', { 
              email: user.email.toLowerCase(), 
              limit: 1 
            })
          );

          // console.log('📡 Raw response:', JSON.stringify(res, null, 2));

          let dbUser = Array.isArray(res) && res.length > 0 ? res[0] : null;
          
          // console.log('👤 Extracted dbUser:', JSON.stringify(dbUser, null, 2));
          // console.log('👤 dbUser type:', typeof dbUser);
          // console.log('👤 dbUser.rolId:', dbUser?.rolId, '(type:', typeof dbUser?.rolId, ')');
          // console.log('👤 dbUser.roleName:', dbUser?.roleName);
          // console.log('👤 dbUser.rol:', dbUser?.rol);
          
          if (dbUser && dbUser.rolId != null) {
            rolId = Number(dbUser.rolId);
            roleName = dbUser.roleName || dbUser.rol?.nombre || 'authenticated';
            // console.log('✅ Role assigned - rolId:', rolId, ', roleName:', roleName);
          } else {
            // console.log('❌ No role found - dbUser exists:', !!dbUser, ', rolId exists:', dbUser?.rolId != null);
          }
        } catch (e) {
          console.warn('User role lookup failed:', e.message);
          console.error('💥 User role lookup failed:');
          console.error('💥 Error type:', e.constructor.name);
          console.error('💥 Error message:', e.message);
          console.error('💥 Full error:', e);
          // Continuar con rol por defecto
        }
      } else {
        console.log('❌ No user found for email:', user.email);
      }

      console.log('🎯 Final values - rolId:', rolId, ', roleName:', roleName);

      req.user = {
        sub: user.id,
        email: user.email,
        role: roleName,
        rolId: rolId,
        raw: user,
      };

      // console.log('User: ', req.user);

      return true;
    } catch (e) {
      console.error('Authentication failed:', e.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    }

    // Usar el cliente oficial de Supabase es más confiable
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || '') as string;
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) throw new UnauthorizedException('Missing Bearer token');

    try {
      // Usar el método oficial de Supabase para verificar el token
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error) {
        console.log("Error de Supabase:", error.message);
        throw new UnauthorizedException('Invalid token');
      }
      
      if (!user) {
        throw new UnauthorizedException('No user found');
      }

      req.user = {
        sub: user.id,
        email: user.email,
        role: user.role || 'authenticated',
        rolId: user.role_id || null,
        raw: user,
      };

      console.log('User:', req.user);

      return true;
    } catch (e) {
      console.log("Error de verificación:", e);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
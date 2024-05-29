import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    const jwtService = new JwtService();
    const decodedToken = jwtService.decode(token);
    const roles = Reflect.getMetadata('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    if (decodedToken && roles.includes(decodedToken.role)) {
      return true;
    }
    throw new UnauthorizedException('Unauthorized');
  }
}

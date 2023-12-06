import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../configs/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Assuming user roles are stored in the request object after authentication
    const userRoles: UserRole[] = request.headers.roles || [];

    // Check if the user has the required role to access the route
    if (!userRoles.includes(UserRole.ADMIN)) {
      response
        .status(403)
        .json({ message: 'Access forbidden. Insufficient privileges.' });
      return false;
    }

    // User has the required role, proceed to the next middleware or route handler
    return true;
  }
}

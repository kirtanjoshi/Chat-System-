/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/auth/decorators/custom.decorators";
import { Role } from "src/auth/emun/custom.enum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true; // If no roles are required, allow access
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user; 

         const userRoles = user?.roles || user?.role;

         return matchRoles(userRoles, requiredRoles);

      
    }
}

function matchRoles(userRoles: Role[], requiredRoles: Role[]) {
    return requiredRoles.some((role: Role) => userRoles?.includes(role));
}
// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { JwtAuthGuard } from "./jwt-auth.guard";
// import { Observable } from "rxjs";
// import { map } from "rxjs";

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


// @Injectable()
// export class AdminGuard extends JwtAuthGuard implements CanActivate{
//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{

//     const parentResult = super.canActivate(context);

//     if (typeof parentResult === 'boolean') {
//       return parentResult && this.isAdmin(context);
//     }

//     if (parentResult instanceof Promise) {
//       return parentResult.then((result) => result && this.isAdmin(context));
//     }

//     return parentResult.pipe(
//       map((result) => result && this.isAdmin(context))
//     );
//   }

//   private isAdmin(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     return request.user?.role === 'admin';
        
//     }
// }

@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!user || user.role !== 'admin'){
            throw new ForbiddenException('Acesso permitido apenas para Administradores')
        }

        return true;
    }
}
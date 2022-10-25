import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any>{
    console.log('Antes ...');
    const now = Date.now();

    return next
            .handle()
            .pipe(
              tap(() => {
                console.log(`Depois... ${Date.now() - now}ms `)
              })
            )
  }
}
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class MainDatasetsPublicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!request.isAuthenticated()) {
      let stringFilter = (request.query.filter ? request.query.filter : "{}");
      let jsonFilter = JSON.parse(stringFilter);
      if ( "where" in jsonFilter ) {
        jsonFilter.where.isPublished = true;
      } else {
        jsonFilter.where = { isPublished : true };
      }
      request.query.filter = JSON.stringify(jsonFilter);
    }
    return next.handle();
  }
}

@Injectable()
export class SubDatasetsPublicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!request.isAuthenticated()) {
      let stringFields = (request.query.fields ? request.query.fields : "{}");
      let jsonFields = JSON.parse(stringFields);
      jsonFields = { ...jsonFields, isPublished: true };
      request.query.fields = JSON.stringify(jsonFields);
    }
    return next.handle();
  }
}
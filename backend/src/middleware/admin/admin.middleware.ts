import { Injectable, NestMiddleware } from '@nestjs/common';
import Errors from 'src/errors.enum';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (!req.headers?.user?.is_admin)
      return res.status(401).json({
        status: false,
        ...Errors.ACCESS_DENIED,
      });

    next();
  }
}

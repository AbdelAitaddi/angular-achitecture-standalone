import { ErrorHandler, Injectable } from '@angular/core';

import { NotAuthorizedError, NotFoundError, ServiceUnavailableError } from '../helpers';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private chunkFailedMessage = /Loading chunk [\w]+ failed/;

  handleError(error: Error) {
    if (error instanceof ServiceUnavailableError) {
      console.error('Service is unavailable');
    } else if (error instanceof NotAuthorizedError) {
      console.error('Action is not authorized');
    } else if (error instanceof NotFoundError) {
      console.error('endpoint not found');
    } else if (this.chunkFailedMessage.test(error.message)) {
      console.info('New release is available, pleas update now');
    } else {
      console.error('Unknown error', error);
    }
  }
}

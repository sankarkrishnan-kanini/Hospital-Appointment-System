"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
class CustomExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status;
        let message;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res?.message || res;
            if (Array.isArray(message))
                message = message[0];
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception?.message || 'Internal server error';
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
exports.CustomExceptionFilter = CustomExceptionFilter;
//# sourceMappingURL=CustomExceptionFilter.js.map
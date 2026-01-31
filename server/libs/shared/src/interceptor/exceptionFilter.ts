import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

interface ErrorResponseBody {
    message: any;
    code?: number;
    [key: string]: any;
}

@Catch(HttpException)
export class InterceptorExceptionFilter implements ExceptionFilter {
    private isErrorResponseBody(obj: any): obj is ErrorResponseBody {
        return obj && typeof obj === 'object' && 'message' in obj;
    }
    
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        let responseMessage: any;
        let responseCode = status;
        
        // 处理不同类型的响应
        if (typeof exceptionResponse === 'string') {
            responseMessage = exceptionResponse;
        } else if (this.isErrorResponseBody(exceptionResponse)) {
            responseMessage = exceptionResponse.message;
            responseCode = exceptionResponse.code || status;
        } else {
            responseMessage = exception.message;
        }
        
        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            message: responseMessage,
            code: responseCode,
            success: false
        });
    }
}
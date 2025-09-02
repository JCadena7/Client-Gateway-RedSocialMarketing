import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorResponse {
  status: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

interface StructuredRpcError {
  status: number;
  message: string;
  error?: string;
}

@Catch(RpcException)
export class RpcExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    
    const rpcError = exception.getError();
    const errorResponse = this.buildErrorResponse(rpcError, request.url);
    
    // Log del error con más contexto
    this.logger.error(
      `RPC Exception: ${errorResponse.message}`,
      {
        status: errorResponse.status,
        error: rpcError,
        path: request.url,
        method: request.method,
      }
    );

    response.status(errorResponse.status).json(errorResponse);
    return throwError(() => exception);
  }

  private buildErrorResponse(rpcError: any, path?: string): RpcErrorResponse {
    const timestamp = new Date().toISOString();
    
    // Caso 1: Error de respuesta vacía
    if (this.isEmptyResponseError(rpcError)) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.extractEmptyResponseMessage(rpcError.toString()),
        error: 'Empty Response',
        timestamp,
        path,
      };
    }

    // Caso 2: Error estructurado con status y message
    if (this.isStructuredError(rpcError)) {
      const structuredError = rpcError as StructuredRpcError;
      return {
        status: this.validateHttpStatus(structuredError.status),
        message: structuredError.message,
        error: structuredError.error,
        timestamp,
        path,
      };
    }

    // Caso 3: Error como string
    if (typeof rpcError === 'string') {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: rpcError,
        error: 'RPC Error',
        timestamp,
        path,
      };
    }

    // Caso 4: Error genérico
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occurred',
      error: 'Server Error',
      timestamp,
      path,
    };
  }

  private isEmptyResponseError(rpcError: any): boolean {
    return typeof rpcError === 'object' && 
           rpcError?.toString?.()?.includes('Empty response');
  }

  private extractEmptyResponseMessage(errorString: string): string {
    const parenIndex = errorString.indexOf('(');
    return parenIndex > 0 
      ? errorString.substring(0, parenIndex - 1).trim()
      : errorString;
  }

  private isStructuredError(rpcError: any): rpcError is StructuredRpcError {
    return typeof rpcError === 'object' &&
           rpcError !== null &&
           'status' in rpcError &&
           'message' in rpcError &&
           typeof rpcError.message === 'string';
  }

  private validateHttpStatus(status: any): number {
    const numericStatus = Number(status);
    
    // Verificar que sea un número válido y un código HTTP válido
    if (isNaN(numericStatus) || numericStatus < 100 || numericStatus > 599) {
      return HttpStatus.BAD_REQUEST;
    }
    
    return numericStatus;
  }
}
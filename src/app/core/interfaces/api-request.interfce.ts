export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequest {
  collectionId: string;
  requestId: string;
  method: HttpMethod;
  name: string;
  url?: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  body?: any;
  auth?: {
    type: 'bearer' | 'basic' | 'none';
    token?: string;
  };
}

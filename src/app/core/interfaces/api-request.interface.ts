export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequest {
  collectionId?: string;
  requestId: string;
  method: HttpMethod;
  name: string;
  url?: string;
  params?: Record<string, string> | null; 
  headers?: Record<string, string> | null;
  body?: any;
  auth?: {
    type: 'bearer' | 'basic' | 'none';
    token?: string;
  };
  isModified?: boolean;
}

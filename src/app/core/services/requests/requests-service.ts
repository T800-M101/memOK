import { Injectable, signal } from '@angular/core';
import { catchError, lastValueFrom, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiCollection } from '../../interfaces/api-collection.interface';
import { environment } from '../../../../environments/environment';
import { ApiRequest } from '../../interfaces/api-request.interface';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private readonly _collections = signal<ApiCollection[]>([]);
  readonly collections = this._collections.asReadonly();

  constructor(private readonly http: HttpClient) {
    this.loadCollections();
  }

  private loadCollections(): void {
    this.http
      .get<ApiCollection[]>(`${environment.apiUrl}/collections`)
      .pipe(
        catchError((err) => {
          console.error('Error loading collections:', err);

          return of([]);
        }),
      )
      .subscribe((collections) => {
        this._collections.set(collections);
      });
  }

  addCollection(collection: ApiCollection) {
    this._collections.update((cols) => [...cols, collection]);
    this.syncToServer();
  }

  removeCollection(collectionId: string): void {
    this._collections.update((cols) => cols.filter((c) => c.collectionId !== collectionId));
    this.syncToServer();
  }

  updateCollection(updatedCollection: ApiCollection): void {
    this._collections.update((cols) =>
      cols.map((col) =>
        col.collectionId === updatedCollection.collectionId ? updatedCollection : col,
      ),
    );
    this.syncToServer();
  }

  getCollectionById(collectionId: string): ApiCollection | undefined {
    return this._collections().find((col) => col.collectionId === collectionId);
  }

  addRequestToCollection(collectionId: string, request: ApiRequest) {
    this._collections.update((cols) =>
      cols.map((col) => {
        if (col.collectionId === collectionId) {
          return {
            ...col,
            requests: [...col.requests, request],
          };
        }
        return col;
      }),
    );
  }

  updateRequestInCollection(collectionId: string, updatedRequest: ApiRequest) {
    this._collections.update((cols) =>
      cols.map((col) => {
        if (col.collectionId === collectionId) {
          return {
            ...col,
            requests: col.requests.map((req) =>
              req.requestId === updatedRequest.requestId ? updatedRequest : req,
            ),
          };
        }
        return col;
      }),
    );
  }

  toggleCollection(collectionId: string): void {
    this._collections.update((cols) =>
      cols.map((collection) =>
        collection.collectionId === collectionId
          ? {
              ...collection,
              isExpanded: !collection.isExpanded,
            }
          : collection,
      ),
    );
  }

  setCollections(collections: ApiCollection[]): void {
    this._collections.set(collections);
  }

  clearCollections(): void {
    this._collections.set([]);
    this.syncToServer();
  }

  private syncToServer() {
    const data = this._collections();
    console.log(`${environment.apiUrl}/collections`);

    this.http
      .post(`${environment.apiUrl}/collections`, data)
      .pipe(
        catchError((err) => {
          console.error('Error synchronizing with the server:', err);
          return of(null);
        }),
      )
      .subscribe();
  }

  getRequestById(requestId: string): ApiRequest | undefined {
    for (const col of this._collections()) {
      const req = col.requests.find((r) => r.requestId === requestId);
      if (req) return req;
    }
    return undefined;
  }

  async sendRequest(payload: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  }): Promise<any> {
    if (!payload.url) {
      throw new Error('Request URL is required');
    }

    try {
      const backendBase = environment.apiUrl.replace(/\/api$/, '');
      const proxyUrl = `${backendBase}/proxy?url=${encodeURIComponent(payload.url)}`;

      const proxyPayload = {
        method: payload.method,
        headers: payload.headers || {},
        body: payload.body || null,
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response = await lastValueFrom(this.http.post(proxyUrl, proxyPayload, { headers }));

      return response;
    } catch (error) {
      console.error('Error en sendRequest:', error);
      throw error;
    }
  }
}

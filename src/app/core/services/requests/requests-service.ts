import { Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ApiCollection } from '../../interfaces/api-collection.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private readonly _collections = signal<ApiCollection[]>([]);
  readonly collections = this._collections.asReadonly();

  constructor(private readonly http: HttpClient){
    this.loadCollections();
  }

    private loadCollections(): void {
    this.http
      .get<ApiCollection[]>(
        `${environment.apiUrl}/collections`,
      )
      .pipe(
        catchError((err) => {
          console.error(
            'Error loading collections:',
            err,
          );

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

  updateCollection(collectionId: string, updates: Partial<ApiCollection>): void {
    this._collections.update((cols) =>
      cols.map((collection) =>
        collection.collectionId === collectionId
          ? {
              ...collection,
              ...updates,
            }
          : collection,
      ),
    );

    this.syncToServer();
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
}

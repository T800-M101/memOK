import { inject, Injectable, signal } from '@angular/core';
import { ApiCollection } from '../interfaces/api-collection.interface';
import { catchError, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  http = inject(HttpClient);
  collections = signal<ApiCollection[]>([]);

  addCollection(collection: ApiCollection) {
    this.collections.update((cols) => [...cols, collection]);
    this.syncToServer();
  }

  private syncToServer() {
    const data = this.collections();
    console.log(`${environment.apiUrl}/collections`)

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

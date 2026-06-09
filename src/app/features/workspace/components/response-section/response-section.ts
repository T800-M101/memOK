import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RequestsService } from '../../../../core/services/requests/requests-service';

@Component({
  selector: 'app-response-section',
  imports: [MatButtonModule, NgxJsonViewerModule],
  templateUrl: './response-section.html',
  styleUrl: './response-section.css',
})
export class ResponseSection {
  private requestsService = inject(RequestsService);
  readonly response = this.requestsService.response;
  
   getBodySize(): string {
    const resp = this.response();
    if (!resp?.body) return '0 B';

    const bodyStr = JSON.stringify(resp.body);
    const size = new Blob([bodyStr]).size;

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

}

import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestBar } from './components/request-bar/request-bar';
import { ConfigTabs } from './components/config-tab/config-tabs';
import { ResponseSection } from './components/response-section/response-section';

@Component({
  selector: 'app-worksapce',
  imports: [MatTabsModule, MatIconModule, RequestBar, ConfigTabs, ResponseSection],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class Workspace {
  activeRequests = [
    { name: 'GET Users', method: 'GET', url: '' },
    { name: 'POST Login', method: 'POST', url: '' },
    { name: 'POST Login', method: 'POST', url: '' },
   
  ];

  selectedTabIndex = 0;

  closeTab(index: number) {
    if (this.activeRequests.length > 1) {
      this.activeRequests.splice(index, 1);
    }
  }
}

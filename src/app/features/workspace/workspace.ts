import { MatIconModule } from '@angular/material/icon';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestBar } from './components/request-bar/request-bar';
import { ConfigTabs } from './components/config-tab/config-tabs';
import { ResponseSection } from './components/response-section/response-section';
import { TabsService } from '../../core/services/tabs/tabs.service';

@Component({
  selector: 'app-worksapce',
  imports: [MatTabsModule, MatIconModule, RequestBar, ConfigTabs, ResponseSection],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class Workspace {
  private tabsService = inject(TabsService);
  activeRequests = this.tabsService.tabs;
   selectedTabIndex = this.tabsService.selectedTabIndex;

   setActiveTab(index: number) {
     this.tabsService.setActiveTab(index);
   }
   
  closeTab(index: number) {
    this.tabsService.closeTab(index);
  }

}

import { MatIconModule } from '@angular/material/icon';
import { Component, computed, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestBar } from './components/request-bar/request-bar';
import { ConfigTabs } from './components/config-tab/config-tabs';
import { ResponseSection } from './components/response-section/response-section';
import { TabsService } from '../../core/services/tabs/tabs.service';
import { ApiRequest } from '../../core/interfaces/api-request.interfce';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../core/services/requests/requests-service';

@Component({
  selector: 'app-worksapce',
  imports: [MatTabsModule, MatIconModule, RequestBar, ConfigTabs, ResponseSection, FormsModule],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class Workspace {
  private requestsService = inject(RequestsService);
  private tabsService = inject(TabsService);
  activeRequests = this.tabsService.tabs;
  selectedTabIndex = this.tabsService.selectedTabIndex;

  isSaveModalOpen = signal(false);
  requestName = signal('');
  selectedCollectionId = signal<string>('');
  newCollectionTitle = signal('');
  collections = this.requestsService.collections;
  targetTabId = signal<string | null>(null);
  tabs = this.tabsService.tabs;


    isSaveDisabled = computed(() => {
    const hasRequestName = this.requestName()?.trim().length > 0;

    if (this.collections().length > 0) {
      // There are collections: you need a name and (selected collection or new collection with name)
      const hasCollectionSelected = this.selectedCollectionId() !== '';
      const hasNewCollectionName = this.selectedCollectionId() === 'new'
        ? this.newCollectionTitle()?.trim().length > 0
        : true;
      return !hasRequestName || !hasCollectionSelected || !hasNewCollectionName;
    } else {
      // There are no collections: you need the request name and the new collection name
      const hasNewCollection = this.newCollectionTitle()?.trim().length > 0;
      return !hasRequestName || !hasNewCollection;
    }
  });

  setActiveTab(index: number) {
    if (index === this.activeRequests().length) {
      return;
    }

    this.tabsService.setActiveTab(index);
  }

  closeTab(index: number) {
    this.isSaveModalOpen.set(true);
    //this.tabsService.closeTab(index);
  }

  createNewTab(event: Event) {
    event.stopPropagation();

    const newRequest: ApiRequest = {
      requestId: crypto.randomUUID(),
      name: 'New Request',
      method: 'GET',
      url: '',
      params: {},
      headers: {},
      body: null,
      auth: {
        type: 'none',
      },
    };

    this.tabsService.openTab(newRequest);
    setTimeout(() => {
      const newIndex = this.activeRequests.length - 1;
      this.setActiveTab(newIndex);
    });
  }

   closeModal(): void {
    this.isSaveModalOpen.set(false);
    this.requestName.set('');
    this.newCollectionTitle.set('');
    this.selectedCollectionId.set('');
  }

   confirmSave() {
    const tabId = this.targetTabId();
    // const tab = this.getTab(tabId!);
    // if (!tab) return;

    let collectionId = this.selectedCollectionId();
    if (collectionId === 'new') {
      collectionId = crypto.randomUUID();
      this.requestsService.addCollection({
        collectionId,
        title: this.newCollectionTitle() || 'New Collection',
        icon: 'fas fa-folder',
        requests: [],
        isExpanded: true,
      });
    }

    //this.requestsService.saveOrUpdateRequest(tabId!, this.requestName(), collectionId);
    this.closeModal();
  }
}

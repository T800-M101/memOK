import { computed, Injectable, signal } from '@angular/core';
import { ApiRequest } from '../../interfaces/api-request.interface';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private readonly _tabs = signal<ApiRequest[]>([]);

  readonly tabs = this._tabs.asReadonly();

  private readonly _selectedTabIndex = signal<number>(0);

  readonly selectedTabIndex = this._selectedTabIndex.asReadonly();

  readonly activeRequest = computed(() => {
    return this._tabs()[this._selectedTabIndex()];
  });

  openTab(request: ApiRequest) {
    const exists = this._tabs().find((r) => r.requestId === request.requestId);

    if (exists) {
      const index = this._tabs().findIndex((r) => r.requestId === request.requestId);

      this._selectedTabIndex.set(index);

      return;
    }

    this._tabs.update((tabs) => [...tabs, request]);

    this._selectedTabIndex.set(this._tabs().length - 1);
  }

  closeTab(index: number) {
    this._tabs.update((tabs) => tabs.filter((_, i) => i !== index));

    const totalTabs = this._tabs().length;

    if (this._selectedTabIndex() >= totalTabs) {
      this._selectedTabIndex.set(Math.max(0, totalTabs - 1));
    }
  }

  setActiveTab(index: number) {
    this._selectedTabIndex.set(index);
  }

  updateTabName(tabId: string, newName: string) {
    this._tabs.update((tabs) =>
      tabs.map((tab) => (tab.requestId === tabId ? { ...tab, name: newName } : tab)),
    );
  }

  clearTabs() {
    this._tabs.set([]);
    this._selectedTabIndex.set(0);
  }

  findTabIndex(requestId: string): number {
    return this._tabs().findIndex((t) => t.requestId === requestId);
  }

  markAsModified(tabId: string) {
    this._tabs.update((tabs) =>
      tabs.map((t) => (t.requestId === tabId ? { ...t, isModified: true } : t)),
    );
  }

  updateTabStatus(tabId: string, status: { isModified: boolean }) {
    this._tabs.update((tabs) => tabs.map((t) => (t.requestId === tabId ? { ...t, ...status } : t)));
  }
}

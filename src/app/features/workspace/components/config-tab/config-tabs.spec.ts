import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigTabs } from './config-tabs';


describe('ConfigTabs', () => {
  let component: ConfigTabs;
  let fixture: ComponentFixture<ConfigTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

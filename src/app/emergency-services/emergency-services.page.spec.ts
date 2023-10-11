import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmergencyServicesPage } from './emergency-services.page';

describe('EmergencyServicesPage', () => {
  let component: EmergencyServicesPage;
  let fixture: ComponentFixture<EmergencyServicesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmergencyServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

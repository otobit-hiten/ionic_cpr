import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportantTipsPage } from './important-tips.page';

describe('ImportantTipsPage', () => {
  let component: ImportantTipsPage;
  let fixture: ComponentFixture<ImportantTipsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImportantTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

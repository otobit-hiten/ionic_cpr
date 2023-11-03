import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThankPage } from './thank.page';

describe('ThankPage', () => {
  let component: ThankPage;
  let fixture: ComponentFixture<ThankPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

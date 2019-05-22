import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificPopupComponent } from './specific-popup.component';

describe('SpecificPopupComponent', () => {
  let component: SpecificPopupComponent;
  let fixture: ComponentFixture<SpecificPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

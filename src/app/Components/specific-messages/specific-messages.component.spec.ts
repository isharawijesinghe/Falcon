import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificMessagesComponent } from './specific-messages.component';

describe('SpecificMessagesComponent', () => {
  let component: SpecificMessagesComponent;
  let fixture: ComponentFixture<SpecificMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

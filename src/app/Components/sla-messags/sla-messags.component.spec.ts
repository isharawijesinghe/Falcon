import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaMessagsComponent } from './sla-messags.component';

describe('SlaMessagsComponent', () => {
  let component: SlaMessagsComponent;
  let fixture: ComponentFixture<SlaMessagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaMessagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaMessagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

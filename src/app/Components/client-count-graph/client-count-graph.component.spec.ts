import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCountGraphComponent } from './client-count-graph.component';

describe('ClientCountGraphComponent', () => {
  let component: ClientCountGraphComponent;
  let fixture: ComponentFixture<ClientCountGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCountGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCountGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

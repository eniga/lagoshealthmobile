import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultersPage } from './defaulters.page';

describe('DefaultersPage', () => {
  let component: DefaultersPage;
  let fixture: ComponentFixture<DefaultersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

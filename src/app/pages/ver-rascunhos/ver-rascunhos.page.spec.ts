import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerRascunhosPage } from './ver-rascunhos.page';

describe('VerRascunhosPage', () => {
  let component: VerRascunhosPage;
  let fixture: ComponentFixture<VerRascunhosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRascunhosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

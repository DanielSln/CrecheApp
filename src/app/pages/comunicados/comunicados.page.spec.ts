import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComunicadosPage } from './comunicados.page';

describe('ComunicadosPage', () => {
  let component: ComunicadosPage;
  let fixture: ComponentFixture<ComunicadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

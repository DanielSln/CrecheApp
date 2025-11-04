import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscreverComunicadoPage } from './escrever-comunicado.page';

describe('EscreverComunicadoPage', () => {
  let component: EscreverComunicadoPage;
  let fixture: ComponentFixture<EscreverComunicadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscreverComunicadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

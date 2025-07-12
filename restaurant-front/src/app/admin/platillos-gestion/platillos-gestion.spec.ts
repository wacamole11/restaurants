import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatillosGestion } from './platillos-gestion';

describe('PlatillosGestion', () => {
  let component: PlatillosGestion;
  let fixture: ComponentFixture<PlatillosGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatillosGestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatillosGestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

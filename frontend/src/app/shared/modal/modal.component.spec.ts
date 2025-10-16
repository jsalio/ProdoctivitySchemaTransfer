import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed'));
    expect(modalElement).toBeFalsy();
  });

  it('should be visible when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed'));
    expect(modalElement).toBeTruthy();
  });

  it('should emit modalClose event when close button is clicked', () => {
    spyOn(component.modalClose, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('button'));
    closeButton.triggerEventHandler('click', null);

    expect(component.modalClose.emit).toHaveBeenCalled();
  });

  it('should apply medium width class when size is medium', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('size', 'medium');
    fixture.detectChanges();

    const modalContent = fixture.debugElement.query(By.css('.bg-white'));
    expect(modalContent.classes['max-w-3xl']).toBe(true);
  });

  it('should apply custom width style when size is custom', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('size', 'custom');
    fixture.componentRef.setInput('customWidth', '600px');
    fixture.detectChanges();

    const modalContent = fixture.debugElement.query(By.css('.bg-white'));
    expect(modalContent.styles['width']).toBe('600px');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WarnComponent } from './warn.component';

describe('WarnComponent', () => {
  let component: WarnComponent;
  let fixture: ComponentFixture<WarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the warning icon', () => {
    const svgElement = fixture.debugElement.query(By.css('svg'));
    expect(svgElement).toBeTruthy();
    
    // Check if the SVG has the correct classes
    expect(svgElement.nativeElement.getAttribute('class')).toContain('size-5');
    expect(svgElement.nativeElement.getAttribute('class')).toContain('w-4');
    expect(svgElement.nativeElement.getAttribute('class')).toContain('h-4');
    expect(svgElement.nativeElement.getAttribute('class')).toContain('text-orange-500');
    expect(svgElement.nativeElement.getAttribute('class')).toContain('mr-2');
  });

  it('should have the correct viewBox', () => {
    const svgElement = fixture.debugElement.query(By.css('svg'));
    expect(svgElement.nativeElement.getAttribute('viewBox')).toBe('0 0 20 20');
  });

  it('should contain a path element with the correct fill-rule', () => {
    const pathElement = fixture.debugElement.query(By.css('path'));
    expect(pathElement).toBeTruthy();
    expect(pathElement.nativeElement.getAttribute('fill-rule')).toBe('evenodd');
    expect(pathElement.nativeElement.getAttribute('clip-rule')).toBe('evenodd');
  });
});

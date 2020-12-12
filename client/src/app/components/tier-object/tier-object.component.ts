import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TierObject } from '../../models/tier-object.model';
import { Renderer } from '@angular/compiler-cli/ngcc/src/rendering/renderer';
import { fromEvent, Observable } from 'rxjs';
import {
  auditTime,
  debounceTime,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { DragTierObjectService } from '../../services/drag-tier-object.service';

@Component({
  selector: 'app-tier-object',
  styleUrls: ['./tier-object.component.scss'],
  template: `
    <div #tierObjectWrapper class="tier-object">
      <span>{{ tierObject.name }}</span>
    </div>
  `,
})
export class TierObjectComponent implements AfterViewInit {
  @ViewChild('tierObjectWrapper') elementRef!: ElementRef;
  @Input() tierObject!: TierObject;

  private mouseUp$!: Observable<any>;

  constructor(
    private renderer: Renderer2,
    private dragTierObjectService: DragTierObjectService
  ) {}

  ngAfterViewInit() {
    this.mouseUp$ = fromEvent(this.elementRef.nativeElement, 'mouseup').pipe(
      tap(() => {
        this.dragTierObjectService.notifyDragEnd(
          this.tierObject,
          this.elementRef.nativeElement.offsetLeft -
            this.elementRef.nativeElement.offsetWidth / 2,
          this.elementRef.nativeElement.offsetTop +
            this.elementRef.nativeElement.offsetWidth / 2
        );
      })
    );

    fromEvent(this.elementRef.nativeElement, 'mousedown')
      .pipe(
        tap(() => this.dragTierObjectService.notifyDragStart()),
        switchMap(() => fromEvent(document, 'mousemove')),
        tap((e: any) => {
          this.renderer.addClass(
            this.elementRef.nativeElement,
            'tier-object--dragged'
          );
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'position',
            'absolute'
          );
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'left',
            `${e.x - this.elementRef.nativeElement.offsetWidth / 2}px`
          );
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'top',
            `${e.y - this.elementRef.nativeElement.offsetWidth / 2}px`
          );
        }),
        takeUntil(this.mouseUp$)
      )
      .subscribe();
  }
}

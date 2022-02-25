import { ComponentFactoryResolver, Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[busyIf]'
})
export class BusyIfDirective implements OnChanges {
  @Input() busyIf: boolean;

  constructor(
        private _viewContainer: ViewContainerRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private ngxSpinnerService: NgxSpinnerService,
  ) {
    this.loadComponent();
  }

  private static index = 0;
  private spinnerName = '';

  isBusy = false;
  refreshState(): void {
    if (this.isBusy === undefined || this.spinnerName === '') {
      return;
    }

    setTimeout(() => {
      if (this.isBusy) {
        this.ngxSpinnerService.show(this.spinnerName);
      } else {
        this.ngxSpinnerService.hide(this.spinnerName);
      }
    }, 1000);
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(NgxSpinnerComponent);
    const componentRef = this._viewContainer.createComponent(componentFactory);
    this.spinnerName = 'busyIfSpinner-' + (BusyIfDirective.index++) + '-' + Math.floor(Math.random() * 1000000);
    const component = (<NgxSpinnerComponent>componentRef.instance);
    component.name = this.spinnerName;
    component.fullScreen = false;

    component.type = 'ball-clip-rotate';
    component.size = 'medium';
    component.color = '#5ba7ea';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busyIf']) {
      this.isBusy = changes['busyIf'].currentValue;
      this.refreshState();
    }
  }
}

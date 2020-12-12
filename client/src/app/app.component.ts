import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';

  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  public openCreateTierObjectDialog(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content);
  }

  public closeDialog() {
    this.modalRef?.close();
  }
}

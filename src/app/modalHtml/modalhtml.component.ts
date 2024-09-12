import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modalhtml.component.html',
  styleUrls: ['./modalhtml.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponentHtml {
  @Input() visible = false;
  @Input() title = '';
  @Input() class = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() executeFunction  = new EventEmitter<void>();

  toggleModal() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  handleBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.toggleModal();
    }
  }

  execute() {
    this.executeFunction.emit();
    this.toggleModal();
  }
}

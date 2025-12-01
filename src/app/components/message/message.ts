import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.html',
  styleUrls: ['./message.scss'],
})
export class MessageComponent implements OnInit {
  @Input() title = 'Error';

  message = '';
  hidden = true;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.message$.subscribe((text) => {
      this.hidden = false;
      this.message = text;
    });
  }
}

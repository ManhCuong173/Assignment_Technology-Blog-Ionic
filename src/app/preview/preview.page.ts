import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit
{

  constructor(private __authService: AuthService) { }

  previewContent: any
  ngOnInit()
  {
    this.previewContent = this.__authService.showEditorContent();
  }

}

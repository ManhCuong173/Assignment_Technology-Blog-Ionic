import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{

  previewContent: any
  constructor(private sanitizer: DomSanitizer) { }

  showEditorContent()
  {
    if (this.previewContent == '') return '';
    else return this.sanitizer.bypassSecurityTrustHtml(this.previewContent)
  }
}

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'tzzu-tzzu-creator',
  templateUrl: './tzzu-creator.component.html',
  styleUrls: ['./tzzu-creator.component.scss']
})
export class TzzuCreatorComponent {
  public tzzuForm = this.fb.group({
    T: ['', Validators.required],
    Zi: ['', Validators.required],
    Ze: ['', [Validators.required, Validators.min(0)]],
    includeLabels: [true],
    fontSize: [42, [Validators.required, Validators.min(0)]]
  });

  public U: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.U.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: string): void {
    const index = this.U.indexOf(fruit);

    if (index >= 0) {
      this.U.splice(index, 1);
    }
  }

  constructor(private fb: FormBuilder) {}

  public onSubmit() {
    const { T, Zi, Ze, includeLabels, fontSize } = this.tzzuForm.value;
    const U = this.U.map(u => `- ${u}`).join('\n');
    const width = 29.7;
    const height = 21;

    const doc = new jsPDF('landscape', 'cm', 'a4');

    const yeet = (title: string, str: string, addPage: boolean = true) => {
      if (includeLabels) {
        doc.setFontSize(fontSize * 3.5);
        doc.setFontStyle('bold');
        const { h: h1 } = doc.getTextDimensions(title);
        doc.text(title, 1, height / 2 + h1 / 6);
      }

      doc.setFontSize(fontSize);
      doc.setFontStyle('normal');
      const { h: h2 } = doc.getTextDimensions(str);
      const rows = doc.splitTextToSize(str, width - 6);
      doc.text(rows, 6, height / 2 - (rows.length * (h2 / 2)));

      if (addPage) {
        doc.addPage();
      }
    };

    yeet('T', T);
    yeet('Z', Zi);
    yeet('Z', `${Ze}'`);
    yeet('U', U, false);

    doc.save('tzzu.pdf')
  }
}

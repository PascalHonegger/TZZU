import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { page1, page2 } from './files';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'tzzu-lesson-creator',
  templateUrl: './lesson-creator.component.html',
  styleUrls: ['./lesson-creator.component.scss']
})
export class LessonCreatorComponent {
  public tzzuForm = this.fb.group({
    T: ['', Validators.required],
    O: ['', Validators.required],
    D: [null, Validators.required],
    U: ['', [Validators.required, Validators.pattern(/\d\d\:\d\d/)]],
    Zi: ['', Validators.required],
    Ze: ['', [Validators.required, Validators.min(0)]],
    Te: ['', Validators.required],
    A: this.fb.array([])
  });

  private lessonStepGroup() {
    return this.fb.group({
      Z: ['', [Validators.required, Validators.min(0)]],
      S: ['', Validators.required],
      B: ['', Validators.required]
    })
  }

  public addNewStep(index: number) {
    this.A.insert(index + 1, this.lessonStepGroup());
  }

  public removeStep(index: number) {
    this.A.removeAt(index);
  }

  public U: string[] = [];

  public get remainingTime(): number {
    const steps: any[] = this.A.value;
    const stepTime = steps
      .map(s => parseInt(s.Z))
      .filter(v => !isNaN(v))
      .reduce((sum, x) => sum + x, 0);
    let totalTime = parseInt(this.tzzuForm.value.Ze);
    if (isNaN(totalTime)) {
      totalTime = 0;
    }

    return totalTime - stepTime;
  }

  public get remainingTimeStyle(): string {
    const time = this.remainingTime;
    if (time > 0) {
      return 'more-steps-needed';
    }

    if (time < 0) {
      return 'less-steps-needed';
    }

    return 'no-steps-needed';
  }

  public get A() {
    return this.tzzuForm.get('A') as FormArray;
  }

  public drop(event: CdkDragDrop<{Z: string | number, S: string, B: string}>) {
    const val = this.A.value;
    moveItemInArray(val, event.previousIndex, event.currentIndex);
    this.A.patchValue(val);
  }

  public add(event: MatChipInputEvent): void {
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
    const { T, Zi, Ze, A, O, D, U, Te } = this.tzzuForm.value;
    const M = this.U.join(', ');
    const width = 14.8;
    const height = 21;
    const fontSize = 12;

    const doc = new jsPDF(undefined, 'cm', 'a5');

    doc.addImage(page1, 'JPEG', 0, 0, width, height);
    doc.setFontSize(fontSize);

    // Thema
    doc.text(doc.splitTextToSize(T, 11.2), 2.2, 4.1);

    // Ausbildungsort, Datum, Zeit
    doc.text(doc.splitTextToSize(O, 4), 5.6, 5.5);
    doc.text(D, 5.6, 6.4);
    doc.text(U, 8.1, 6.4);

    // Dauer
    doc.text(`${Ze}'`, 11.5, 5.8);

    // Zielsetzung
    doc.setFontSize(fontSize - 5);
    doc.text(doc.splitTextToSize(Zi, 11), 2.8, 7.2);
    doc.setFontSize(fontSize);

    // Teilnehmer
    doc.text(Te, 2.9, 8.6);

    // Ausrüstung, Material
    doc.setFontSize(fontSize - 5);
    doc.text(doc.splitTextToSize(M, 2.3), 11.4, 8.6);
    doc.setFontSize(fontSize);

    // Arbeitsschritte

    const rows = [];

    for (const { Z, S, B } of A) {
      const firstColumn: string[] = [`${Z}'`];
      const secondColumn: string[] = doc.splitTextToSize(S, 6.5);
      const thirdColumn: string[] = doc.splitTextToSize(B, 3.5);

      const longest = Math.max(firstColumn.length, secondColumn.length, thirdColumn.length);
      for (let i = 0; i < longest; i++) {
        rows.push({ first: firstColumn[i], second: secondColumn[i], third: thirdColumn[i] });
      }
      // Empty row after every data entry
      rows.push({ first: null, second: null, third: null});
    }

    const firstPageRows = 5;
    const startHeightFirstPage = 15.75;
    const startHeightSecondPage = 2.75;
    const { h: lineHeight } = doc.getTextDimensions('A');

    for (let i = 0; i < rows.length; i++) {
      const { first, second, third } = rows[i];
      const isFirstPage = i <= firstPageRows;
      let pos = isFirstPage ? startHeightFirstPage : startHeightSecondPage;
      pos += isFirstPage ? i * lineHeight : (i - firstPageRows) * lineHeight;
      if (first) {
        doc.text(first, 1, pos);
      }
      if (second) {
        doc.text(second, 3, pos);
      }
      if (third) {
        doc.text(third, 10, pos);
      }

      if (i === firstPageRows) {
        doc.addPage();
        doc.addImage(page2, 'JPEG', 0, 0, width, height);
      }
    }

    doc.save('lektionsplan.pdf')
  }
}

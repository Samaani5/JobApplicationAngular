import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './math-captcha.component.html',
  styleUrl: './math-captcha.component.css'
})
export class MathCaptchaComponent {
  num1: number = 0;
  num2: number = 0;
  captchaAnswer: number = 0;
  userAnswer: number | null = null;
  @Output() captchaValid = new EventEmitter<boolean>();

  constructor() {
    this.generateMathCaptcha();
  }

  generateMathCaptcha() {
    this.num1 = Math.floor(Math.random() * 10) + 1;
    this.num2 = Math.floor(Math.random() * 10) + 1;
    this.captchaAnswer = this.num1 + this.num2;
  }

  validateCaptcha() {
    if (this.userAnswer === this.captchaAnswer) {
      this.captchaValid.emit(true);
    } else {
      this.captchaValid.emit(false); 
      this.userAnswer = null;
      this.generateMathCaptcha();
    }
  }
}

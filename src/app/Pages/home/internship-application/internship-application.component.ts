import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternDetail, InternQuestionAnswer } from '../../../Models/Intern/intern-detail';
import { InternService } from '../../../Services/Intern/intern.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
declare var Swal: any;

@Component({
  selector: 'app-internship-application',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './internship-application.component.html',
  styleUrl: './internship-application.component.css'
})
export class InternshipApplicationComponent implements OnInit {
  personalForm!: FormGroup;
  followUpForm!: FormGroup;
  showFollowUp = false;
  submitted = true;
  currentQuestion: string = '';
  questionText: string = '';
  questionIndex = 0;
  formattedQuestion: string = '';
  maxQuestions = 5;
  internData = new InternDetail;
  currentYear = new Date().getFullYear();
  passingYears: number[] = [];
  questionAnswerList: { question: string; answer: string }[] = [];
  evaluationResult: string = '';
  showEvaluation: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private internservice: InternService) { }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      qualification: ['', Validators.required],
      passingYear: ['', Validators.required],
      department: ['', Validators.required],
      availability: ['', Validators.required],
      durationValue: ['', Validators.required],
      durationUnit: ['', Validators.required],
    });
    this.followUpForm = this.fb.group({
      answer: ['', [Validators.required, this.minWordsValidator(10)]]
    });
    this.passingYears = Array.from({ length: 10 }, (_, i) => this.currentYear - i);
  }

  get f1() {
    return this.personalForm.controls;
  }

  get f2() {
    return this.followUpForm.controls;
  }

  onSubmitPersonalForm(): void {
    if (this.personalForm.invalid) return;
    const formValues = this.personalForm.value;
    const internData: InternDetail = {
      internId: 0,
      name: formValues.fullName,
      emailID: formValues.email,
      mobileNo: formValues.mobile,
      qualification: `${formValues.qualification} (${formValues.passingYear})`,
      department: formValues.department,
      internshipAvailability: formValues.availability,
      internshipDuration: `${formValues.durationValue} ${formValues.durationUnit}`,
    };
    this.internservice.SaveUserInfo(internData).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Your Details submitted successfully.', 'success').then(() => {
            this.showFollowUp = true;
            this.submitted = false;
            this.getNextQuestion("Act as an internship interviewer.Ask me one of the following questions at a time: \n\n * Act like intership evaluater evaluate these questions asked to a candidate and candidates has replied\n\n—-Questions and reply list —\n\nBased on candidates reply evaluate the candidate on the following criteria: \n\nAttitude & Motivation\nClarity of Thought\nSkill Match for Internship\nCreativity / Problem Solving\nCommunication\nProvide a scorecard in this format: \n\n | Parameter | Score(out of 5) | Comments |\n | -----------------------------| ----------------------| --------------|\n | Attitude & Motivation | | |\n | Clarity of Thought | | |\n | Skill Match | | |\n | Creativity / Problem Solving | | |\n | Communication | | |\n | Total(out of 25) | | |\n\nThen conclude with one of the following verdicts: \n✅ Suitable\n❌ Not Suitable\n🔄 Could Consider with Improvements\n\nFinally, provide a Recommendation Summary stating: \n\nWhat kind of role I might fit into best.\nWhat mentorship or support would help me grow further.");
            this.GetInternData(formValues.mobile);
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error, 'error');
      }
    );
  }

  getNextQuestion(prompt: string = ''): void {
    if (this.questionIndex >= this.maxQuestions) {
      this.showFollowUp = false;
      this.submitted = false;
      const evaluationPrompt = this.buildEvaluationPrompt();
      this.evaluateCandidate(evaluationPrompt);
      return;
    }

    this.internservice.generate(prompt).subscribe(
      (response: any) => {
        // Check for success status (if status exists)
        if (response && response.status === 200) {
          try {
            let fullResponse = '';
            if (typeof response.body.response === 'string') {
              // If the response is a string, assume newline-delimited JSON
              const lines = response.body.response.split('\n').filter(Boolean);
              for (const line of lines) {
                try {
                  const parsed = JSON.parse(line);
                  if (parsed?.response) {
                    fullResponse += parsed.response;
                  }
                } catch (e) {
                  console.warn('Skipping invalid JSON line:', line);
                }
              }
            } else if (response?.response) {
              // If response is an object and has 'response' field
              fullResponse = response.response;
            }

            this.currentQuestion = fullResponse.trim();

            // Match for the actual question
            const quotedQuestionMatch = fullResponse.match(/"([^"]+\?)"/s);
            const fallbackQuestionMatch = fullResponse.match(/^.*\?.*$/m);

            const parts = {
              question: quotedQuestionMatch?.[1]?.trim()
                || fallbackQuestionMatch?.[0]?.trim()
                || fullResponse.trim()
            };

            // Clean the question text
            parts.question = parts.question.replace(/^\*+|\*+$/g, '').trim();
            parts.question = parts.question.replace(/^Question\s*\d+:\*\*\s*/i, '').trim();
            parts.question = parts.question.replace(/^Question:\*\*\s*/i, '').trim();
            parts.question = parts.question.replace(/^\d+\.\s*/, '').trim();

            // Format and display the question
            this.formattedQuestion = `<p><strong> ${parts.question}</strong></p>`;
            this.questionText = parts.question;
            this.questionIndex++;
          } catch (err) {
            console.error('Error parsing streamed response:', err);
            this.currentQuestion = 'Failed to load question';
            this.formattedQuestion = `<p>${this.currentQuestion}</p>`;
          }
        } else {
          console.error('Invalid response status or structure:', response);
          this.currentQuestion = 'Failed to load question';
          this.formattedQuestion = `<p>${this.currentQuestion}</p>`;
        }

        this.followUpForm.reset();
      },
      (error) => {
        console.error('Question fetch failed:', error);
        this.currentQuestion = 'Failed to load question';
        this.formattedQuestion = `<p>${this.currentQuestion}</p>`;
      }
    );
  }



  onSubmitFollowUpForm(): void {
    if (this.followUpForm.invalid) return;
    const userAnswer = this.followUpForm.value.answer;
    const QAData: InternQuestionAnswer = {
      internId: this.internData.internId,
      question: this.questionText,
      answer: userAnswer,
    };
    this.internservice.SaveQA(QAData).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.questionAnswerList.push({
            question: this.questionText,
            answer: userAnswer,
          });
          Swal.fire('Success!', 'Answer submitted successfully.', 'success').then(() => {
            this.showFollowUp = true;
            this.getNextQuestion("Act as an internship interviewer.Ask me one of the following questions at a time: \n\n * Act like intership evaluater evaluate these questions asked to a candidate and candidates has replied\n\n—-Questions and reply list —\n\nBased on candidates reply evaluate the candidate on the following criteria: \n\nAttitude & Motivation\nClarity of Thought\nSkill Match for Internship\nCreativity / Problem Solving\nCommunication\nProvide a scorecard in this format: \n\n | Parameter | Score(out of 5) | Comments |\n | -----------------------------| ----------------------| --------------|\n | Attitude & Motivation | | |\n | Clarity of Thought | | |\n | Skill Match | | |\n | Creativity / Problem Solving | | |\n | Communication | | |\n | Total(out of 25) | | |\n\nThen conclude with one of the following verdicts: \n✅ Suitable\n❌ Not Suitable\n🔄 Could Consider with Improvements\n\nFinally, provide a Recommendation Summary stating: \n\nWhat kind of role I might fit into best.\nWhat mentorship or support would help me grow further.");
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  GetInternData(mobileNo: string) {
    this.internservice.getInternDetail(mobileNo).subscribe(
      (result: any) => {
        if (result != null) {
          this.internData = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  buildEvaluationPrompt(): string {
    let prompt = `You're acting as a professional and approachable internship interviewer and evaluator for a company. A candidate has provided responses to several standard internship interview questions.\n\n` +
      `Your task is to review and evaluate each answer for correctness and relevance.\n\n` +
      `If an answer is incorrect or irrelevant to the question, mark the response as failed and assign a score of 0 for that question.\n\n` +
      `For relevant answers, evaluate them based on the specified criteria and assign appropriate scores.\n\n` +
      `Then, complete the evaluation using the following scorecard format:\n\n`;

    // Add dynamic Q&A list
    this.questionAnswerList.forEach((qa) => {
      prompt += `Question: ${qa.question}\nAnswer: ${qa.answer}\n`;
    });

    // Continue with fixed format
    prompt += `\nParameter                   | Score (out of 5) | Comments\n` +
      `----------------------------|------------------|---------\n` +
      `Attitude & Motivation       |                  | \n` +
      `Clarity of Thought          |                  | \n` +
      `Skill Match for Internship  |                  | \n` +
      `Creativity / Problem Solving|                  | \n` +
      `Communication               |                  | \n` +
      `Total (out of 25)           |                  | \n` +
      `After the scorecard, conclude with one of the following final verdicts:\n\n` +
      `✅ Suitable\n\n` +
      `❌ Not Suitable\n\n` +
      `🔄 Could Consider with Improvements\n\n` +
      `Finally, provide a Recommendation Summary stating:\n\n` +
      `What kind of role the candidate might be best suited for.\n\n` +
      `What type of mentorship or support would help the candidate grow further.`;

    return prompt;
  }
  evaluateCandidate(prompt: string = ''): void {
    this.http.post<any>('https://api.dil.in/api/generate', {
      model: 'llama3.2',
      prompt: prompt,
    }, { responseType: 'text' as 'json' }).subscribe({
      next: (response: any) => {
        try {
          let fullResponse = '';
          if (typeof response === 'string') {
            const lines = response.split('\n').filter(Boolean);
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line);
                if (parsed?.response) {
                  fullResponse += parsed.response;
                }
              } catch (e) {
                console.warn('Skipping invalid JSON line:', line);
              }
            }
          } else {
            fullResponse = response?.response || '';
          }
          this.evaluationResult = fullResponse.trim();
          this.showEvaluation = true;

        } catch (err) {
          console.error('Error parsing evaluation response:', err);
        }
      },
      error: (err) => {
        console.error('Evaluation failed:', err);
      }
    });
  }
  minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const wordCount = control.value.trim().split(/\s+/).length;
      return wordCount < minWords ? { minWords: true } : null;
    };
  }
  generatePdf(): void {
    const html = `
    <div style="padding: 4px; font-family: Arial;font-size: 14px; line-height: 1.4;">
      <h5>Personal Details</h5>
      <div class="row">
      <div class="col-md-6"><p><strong>Name:</strong> ${this.personalForm.value.fullName}</p></div>
      <div class="col-md-6"><p><strong>Email:</strong> ${this.personalForm.value.email}</p></div>
      <div class="col-md-6"><p><strong>Mobile:</strong> ${this.personalForm.value.mobile}</p></div>
      <div class="col-md-6"><p><strong>Qualification:</strong> ${this.personalForm.value.qualification} (${this.personalForm.value.passingYear})</p></div>
      <div class="col-md-6"><p><strong>Department:</strong> ${this.personalForm.value.department}</p></div>
      <div class="col-md-6"><p><strong>Availability:</strong> ${this.personalForm.value.availability}</p></div>
      <div class="col-md-6"><p><strong>Internship Duration:</strong> ${this.personalForm.value.durationValue} ${this.personalForm.value.durationUnit}</p></div>
      </div>
      <hr style="margin: 5px 0;"/>
      <h5 class="mb-3 text-success">Evaluation Summary</h5>
      <div style="white-space: pre-wrap; word-break: break-word; font-family: Arial, sans-serif; line-height: 1.4; width: 100%; max-width: 550mm;">
        ${this.evaluationResult}
      </div>
    </div>
  `;
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 10,
        filename: this.personalForm.value.fullName + '-internship-evaluation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      html2pdf.default().from(container).set(opt).save().then(() => {
        document.body.removeChild(container);
      }).catch((err: any) => {
        console.error('Error generating PDF:', err);
        document.body.removeChild(container);
      });
    });
  }
}

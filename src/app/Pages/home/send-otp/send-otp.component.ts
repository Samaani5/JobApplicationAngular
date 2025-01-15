import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SendOTPRequest } from '../../../Models/SendOTP/send-otprequest';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { MathCaptchaComponent } from '../math-captcha/math-captcha.component';
declare var Swal: any;
@Component({
  selector: 'app-send-otp',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule, MathCaptchaComponent],
  templateUrl: './send-otp.component.html',
  styleUrl: './send-otp.component.css'
})
export class SendOTPComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  captchaIsValid = false;
  designationId = 0;
  groupName = '';
  zoneId = 0;
  groupId = 0;
  projectId = 0;
  SendOtpmodel = new SendOTPRequest;
  

  constructor(private fb: FormBuilder, private router: Router, private jobservice: JobApplyService) {
    this.designationId = Number(JSON.parse(sessionStorage.getItem('designationId') || '0'));
    this.zoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.groupId = Number(JSON.parse(sessionStorage.getItem('groupId') || '0'));
    this.projectId = Number(JSON.parse(sessionStorage.getItem('projectId') || '0'));
    let groupName = sessionStorage.getItem('groupName');
    this.groupName = groupName ? JSON.parse(groupName) : '';
    if (this.designationId == 0 && this.groupName == '' && this.zoneId == 0) {
      this.router.navigate(['/JobApply']);
    }
    this.signupForm = this.fb.group({
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }
  

  get whatsappNumber() {
    return this.signupForm?.get('whatsappNumber');
  }

  onSubmit(): void {
    // debugger;
    if (this.signupForm.valid && this.captchaIsValid) {
      this.SendOtpmodel = {
        mobileNo: this.signupForm.value.whatsappNumber,
        zonId: this.zoneId,
        designationId: this.designationId,
        groupDivisionId: this.groupId,
        projectId: this.projectId,
        otp:''
      };
      this.jobservice.SendWhatsappOTP(this.SendOtpmodel).subscribe(
        (result: any) => {
          if (result.status == 200) {
            sessionStorage.setItem('MobileNo', JSON.stringify(this.SendOtpmodel.mobileNo));
            Swal.fire({
              title: "OTP Sent Successfully",
              text: "Please save this OTP for future reference, as you'll need it to edit your profile.",
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => {
              this.router.navigate(['/verifyotp']);
            });
          }
        },
        (error: any) => {
          Swal.fire({
            text: error.message,
            icon: "error"
          });
        });
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
    }
  }
  onCaptchaValidation(valid: boolean) {
    this.captchaIsValid = valid;
  }
}

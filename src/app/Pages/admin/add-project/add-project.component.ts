import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AddProject } from '../../../Models/Masters/add-group-division';
import { ActivatedRoute, Router } from '@angular/router';
declare var Swal: any;
@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  ProjectForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addProject = new AddProject;
  GroupDivisionList: any;
  projectId: number = 0;
  allProjectList: any[] = [];
  projectSuggestions: any[] = [];
  filteredProject: any[] = [];
  searchTerms = new Subject<string>(); 
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetProjectById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }

    this.ProjectForm = this.fb.group({
      projectId: [0],
      projectName: ['', Validators.required],
      groupDivisionId: [0, Validators.required],
      active: [1],

    });
    this.GetGroupdivisions();


  }
  ngOnInit(): void {
    this.GetAllProjects();

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.filteredProjects(term))
      )
      .subscribe((filtered) => {
        this.filteredProject = filtered;
      });
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.ProjectForm.patchValue(existingData);
    }
  }
  GetAllProjects() {
    this.jobapplyservice.GetAllProjects().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allProjectList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.projectSuggestions = this.filteredProjects(inputValue);
  }
  filteredProjects(term: string): any[] {
    if (!term) {
      return [];
    }
    return this.allProjectList.filter((project) =>
      project.projectName.toLowerCase().includes(term.toLowerCase())
    );
  }

  //selectProject(project: any) {
  //  this.ProjectForm.patchValue({ name: project.projectName });
  //  this.projectSuggestions = [];
  //}
  getEditData() {
    return null;
  }
  GetGroupdivisions() {
    this.jobapplyservice.GetGroupdivisions().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.GroupDivisionList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetProjectById(projectId: number) {
    this.addProject = {
      projectId: projectId,
      groupDivisionId: 0,
      projectName: '',
      active: 1
    }
    this.jobapplyservice.GetProjectById(this.addProject).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addProject.projectId = existingData.projectId;
          this.addProject.groupDivisionId = existingData.groupDivisionId;
          this.addProject.projectName = existingData.projectName;
          this.addProject.active = existingData.active;
          this.isEditMode = true;
          this.ProjectForm.patchValue(this.addProject);
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.ProjectForm.invalid) {
      return;
    }
    const formData = this.ProjectForm.value;
    this.jobapplyservice.AddProject(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Project saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/project-list']);
              else
                window.location.reload();
            }
          });
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
}

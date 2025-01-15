export class Vacancy {
  'vacancyId': number;
  'positionId': number;
  'jobName': string;
  'projectName': string;
  'qualification': string;
  'jobDescription': string;
  'keySkills': string;
  'experienceFrom': number;
  'experienceTo': number;
}
export class VacancyLocations {
  'id': number;
  'vacancyId': number;
  'locationId': number;
  'positionId': number;
  'location': string;
}
export class JobPostingResponse {
  'vacancies': Vacancy[];
  'vacancyLocations': VacancyLocations[];
}
export class JobPosting {
  'vacancyId': number;
  'positionId': number;
  'jobName': string;
  'projectName': string;
  'projectId': number;
  'qualification': string;
  'jobDescription': string;
  'keySkills': string;
  'experienceFrom': number;
  'experienceTo': number;
  'selectedLocation': number;
  'vacancyLocations': VacancyLocations[];
}
export class PostedJobs {
  'vacancyId': number;
  'positionId': number;
  'jobName': string;
  'projectName': string;
  'qualification': string;
  'jobDescription': string;
  'keySkills': string;
  'experienceFrom': number;
  'experienceTo': number;
  'designationName': string;
  'todate': string;
  'status': string;
  'name': string;
  'groupName': string;
}
export class PostedJobListReq {
  'groupDivisionId': number;
  'status': string;
  'designationName': string;
  'vacancyId': number;
}
export class JobPostingDetailResponse {
  'vacancies': PostedJobs[];
  'vacancyLocations': VacancyLocations[];
}
export class GroupDivisionList {
  'divisionId': number;
  'name': string;
  'active': number;
}
export class LocationList {
  'locationId': number;
  'location': string;
  'name': string;
  'active': number;
}
export class DesignationList {
  'designationId': number;
  'designationName': string;
  'designationCode': string;
  'name': string;
  'active': number;
}
export class ProjectList {
  'projectId': number;
  'projectName': string;
  'name': string;
  'active': number;
}
export class SubDivisionList {
  'id': number;
  'revenueTown': string;
  'name': string;
  'active': number;
  'zoneId': number;
}

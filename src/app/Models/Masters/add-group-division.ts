export class AddGroupDivision {
  'groupDivisionId': number;
  'name': string;
  'active': number;
}
export class AddProject {
  "projectId": number;
  "groupDivisionId": number;
  "projectName": string;
  "active": number;
}
export class AddDesignation {
  "designationId": number;
  "groupDivisionId": number;
  "designationName": string;
  "designationCode": string;
  "active": number;
}
export class AddZone {
  "zoneId": number;
  "groupDivisionId": number;
  "name": string;
  "active": number;
  "emailAddress": string;
}
export class AddSubDivision {
  "zoneId": number;
  "revenueId": number;
  "revenueTown": string;
  "townType": string;
  "active": number;
  "emailAddress": string;
  "name": string;
  "id": number;
  "groupDivisionId": number;
}
export class PayrollDataRequest {
  'companyId': number;
  'groupDiviion': string;
  'branchId': number;
  'departmentId': string;
  'dptId': number;
}

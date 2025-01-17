export class ApplicationlistRequest {
  'applicantId': number;
  'name': string;
  'gender': string;
  'dateOfBirth': Date;
  'age': string;
  'emailAddress': string;
  'mobileNo': string;
  'fatherMobileNo': string;
  'revenueTown': string;
  'designationName': string;
  'createdBy': string;
  'statusName': string;
  'adharNo': string;
  'bankAccountNo': string;
  'ifscCode': string;
  'panNo': string;
  'bankId': number;
  'zoneName': string;
  'fatherName': string;
  'uanNo': string;
  'esiNo': string;
  'mrid': string;
  'permanentAddress': string;
  'pinCode': string;
  'cAddress': string;
  'cPinCode': string;
  'adharpath': string;
  'pancardpath': string;
  'qualificationpath': string;
  'bankDocumentpath': string;
  'passportPhotopath': string;
  'resumeFilepath': string;
  'maritalStatus': string;
  'bankName': string;
  'designationId': number;
  'zoneId': number;
  'revenueId': number;
  'groupDivisionId': number;

}
export class Applicationlist {
  'type': string="";
  'groupDivisionId': number=0;
  'statusId': number=0;
  'zoneId': number=0;
  'subdivisionId': number=0;
  'designationId': number=0;
  'fromDate': string="";
  'toDate': string="";
  'applicantId': number=0;
  'adharNo': string="";
  'bankAccountNo': string="";
  'ifscCode': string="";
  'panNo': string="";
  'bankId': number = 0;
  'companyId': number = 0;
  'remark': string = "";
  'status': string = "";
  'loginEmail': string = "";
  'keySkills': string = "";
  'projectId': number = 0;
  'expFrom': number = 0;
  'expTo': number = 0;
  'groupName': string = "";
  'branchId': number = 0;
  'departMentId': number = 0;
  'revenueId': number = 0;
  'payRollDestId': number = 0;
  'employmentType': string = "";
}
export class EmployeeDetail {
  'applicantId': number;
  'name': string;
  'groupDivisionId': number;
}


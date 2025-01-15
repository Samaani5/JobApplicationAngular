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
}


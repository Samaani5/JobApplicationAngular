export class JobApplicationFormRequest {
  'mrid': string;
  'FacebookId': string;
  'gender': string;
  'pinCode': string;
  'uanNo': string;
  'mobileNo': string;
  'maritalStatus': string;
  'permanentAddress': string;
  'fatherName': string;
  'panFile': File;
  'districtId': string;
  'resumeFile': File;
  'cStateId': string;
  'cPinCode': string;
  'LinkdinId': string;
  'name': string;
  'qualificationFile': File;
  'stateId': string;
  'cDistrictId': string;
  'InstagramId': string;
  'bankAccountNo': string;
  'adharFile': File;
  'TwiterId': string;
  'bankId': string;
  'revenueId': string;
  'adharNo': string;
  'emailAddress': string;
  'bankStatementFile': File;
  'dateOfBirth': string;
  'cAddress': string;
  'ifscCode': string;
  'passportPhoto': File;
  'panNo': string;
  'esiNo': string;
  'fatherMobileNo': string;
  'flag': string;
}

export class EmpBasic {
  "name": string;
  "fatherName": string;
  "dateOfBirth": string;
  "gender": string;
  "maritalStatus": string;
  "emailAddress": string;
  "mobileNo": string;
  "permanentAddress": string;
  "pinCode": string;
  "stateId": number;
  "districtId": number;
  "correspondenceAddress": string;
  "cPinCode": string;
  "cStateId": number;
  "cDistrictId": number;
  "fatherMobileNo": string;
  "revenueId": number;
}

export class EmpBank {
  'mrid': string;  
  'bankAccountNo': string;  
  'bankId': number;  
  'adharNo': string;
  'ifscCode': string;
  'panNo': string;
  'esiNo': string;
  'uanNo': string;
  'mobileNo': string;
}
export class EmpFiles {
  'panFile': File;
  'resumeFile': File;
  'qualificationFile': File;
  'adharFile': File;
  'bankStatementFile': File;
  'passportPhoto': File;
  'mobileNo': string;
}
export class JobApplicationFormRequestIO {
  'revenueId': string;
  'gender': string;
  'PinCode': string;
  'mobileNo': string;
  'maritalStatus': string;
  'permanentAddress': string;
  'pinCode': string;
  'stateId': number
  'districtId': number
  'correspondenceAddress': string;
  'cPinCode': string;
  'cStateId': number
  'cDistrictId': number
  'linkdinId': string;
  'name': string;
  'mName': string;
  'lName': string;
  'fatherName': string;
  'fatherMobileNo': string;
  'nationality': string;
  'vehicleType': string;
  'drivingLicenseNo': string;
  'KeySkills': string;
  'emailAddress': string;
  'dateOfBirth': string;
  'passportNo': string;
  'dateOfIssue': string;
  'validUpto': string;
  'issuedBy': string;
  'passAddress': string;
  'pCityName': string;
  'emigrationChecReq': string;
  'facebookId': string;
  'instagramId': string;
  'twiterId': string;
  'resumeFilePath': string;
  'passportPhotoFilePath': string;
  'healthDetails': HealthDetail;
  'experienceDetails': Experience[];
  'languageDetails': Language[];
  'qualificationDetails': GetQualification[];
  'skillDetails': Skill[];
}

export class Experience {
  'empExperienceId': number;
  'companyName': string;
  'startDate': string;
  'endDate': string;
  'hodName': string;
  'hodMobile': string;
  'hodEmail': string;
  'position': string;
  'hodMobileNo': string;
}
export class Resume {
  'resumeFile': File;
  'mobileNo': string;
}

export class Language {
  'empLanguage_Id': number;
  'languageName': string;
  'understand': boolean;
  'read': boolean;
  'write': boolean;
  'speek': boolean;
}

export class Qualification {
  'qulDtl_Id': number;
  'MobileNo': string;
  'orderNo': number;
  'degreeName': string;
  'specialization': string;
  'passingYear': string;
  'imageFile': File;
}
export class GetQualification {
  'qulDtl_Id': number;
  'MobileNo': string;
  'orderNo': number;
  'degreeName': string;
  'specialization': string;
  'passingYear': string;
  'imageFile': string;
}
export class RemoveQualDetail {
  'mobileNo': string;
  'orderNo': number;
}
export class Skill{
  'id': number;
  'skillName': string;
  'softwareVerson': string;
  'lastUsed': number;
  'experienceYear': number;
  'experienceMonth': number;
}
export class BasicDetail {
  'applicantId': number;
  'revenueId': number;
  'fName': string;
  'mName': string;
  'lName': string;
  'fatherName': string;
  'fatherMobileNo': string;
  'nationality': string;
  'vehicleType': string;
  'drivingLicenseNo': string;
  'dateOfBirth': string;
  'gender': string;
  'maritalStatus': string;
  'emailAddress': string;
  'mobileNo': string;
  'Photofile': File;
  'passportPhotoFilePath': string;
}
export class SkillDetail {
  'mobileNo': string;
  'skillDtl': Skill[];
}
export class AddressDetail {
  'mobileNo': string;
  'permanentAddress': string;
  'pinCode': string;
  'stateId': number
  'districtId': number
  'correspondenceAddress': string;
  'cPinCode': string;
  'cStateId': number
  'cDistrictId': number
}
export class HealthDetail {
  'empHealth_Id'?: number;
  'mobileNo': string;
  'vision'?: string;
  'bloodPressure'?: string;
  'diabetes'?: string;
  'heartAilments'?: string;
  'anyOtherIllnes'?: string;
  'lastMajorIllness'?: string;
  'majoreIllnessDate'?: string;
  'bloodGroop'?: string;
}
export class PassportDetail {
  'mobileNo': string;
  'passportNo': string;
  'dateOfIssue': string;
  'validUpto': string;
  'issuedBy': string;
  'passAddress': string;
  'pCityName': string;
  'emigrationChecReq': string;
}
export class LanguageDetail {
  'mobileNo': string;
  'lanDtl': Language[];
}
export class ExperienceDetail {
  'mobileNo': string;
  'expDtl': Experience[];
}
export class SocialDetail {
  'mobileNo': string;
  'FacebookId': string;
  'LinkdinId': string;
  'InstagramId': string;
  'TwiterId': string;
  'Resumefile': File;
}

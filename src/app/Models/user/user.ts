export class User {
  "userId"?: number;
  "name": string;
  "emailAddress": string;
  "roleId": number;
  "status": number;
  "createdBy": string;
  "userPhoto": string;
  "groupDivisionIds": number[];
  "zoneIds": number[];
}

export class UserList {
  'userId': number;
  'name': string;
  'emailAddress': string;
  'roleName': string;
  'status': string;
  'createdBy'?: string | null;
  'createdDate': Date;
}

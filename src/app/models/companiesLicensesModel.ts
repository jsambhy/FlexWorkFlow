
export class companiesLicensesModel {
  id: number;
  companyId: number;
  stateId: number;
  licenseTypeId: number;
  licenseNo: string;
  licenseeName: string;
  licenseeAddress: string;
  licenseeMobileNo: string;
  licenseeAadharNo: string;
  licenseePanNo: string;
  licenseBeginDate: string;
  licenseEndDate: string;
  financialYearBeginDate: string;
  financialYearEndDate: string;
  isCurrentFY: number;
  deshiTenderAmount: number;
  basicLicenseFee: number;
  compositeFee: number;
  noOfGodowns: number;
  noOfShops: number;
}

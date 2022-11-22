// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  baseUrl: 'http://3.24.116.146/FlexWFDevApi/api',
  reportBaseUrl: 'http://localhost:89/api',

  AWSS3AccessKey: 'AKIA2PZEKIVAQR2SLIP2',
  AWSS3SecretKey: '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',
  S3Bucketname: 'project-lite-staging-flex20200415095037299600000001',
  S3BucketRootFolder: 'dev',

  AuthSource: 'Cognito',
  region: 'ap-southeast-2',
  userPoolId: 'ap-southeast-2_nfHuSVZSa',
  userPoolWebClientId: '4d99r5si253niabl6qcgcq1lr1',
  
  Password: 'FlexWF!23'
};

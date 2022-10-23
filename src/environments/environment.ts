// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  //Test api url
  //baseUrl: 'https://api.test.flexwf.com/api',
  baseUrl: 'http://localhost:58286/api',
//reportBaseUrl: 'https://localhost:44308/api',
  reportBaseUrl: 'http://localhost:89/api',
  //baseUrl: 'http://localhost:88/api',
  //baseUrl: 'http://flexwf-api-public-alb-900438324.ap-southeast-2.elb.amazonaws.com/api',
  //S3 Details Starts here
  //AWSS3AccessKey: 'AKIA2PZEKIVA5WVY4A53',
  //AWSS3SecretKey: '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',
  //S3Bucketname: 'project-lite-staging-flex20200415095037299600000001',
  //S3BucketRootFolder: 'dev',
  AWSS3AccessKey: 'AKIA2PZEKIVAQR2SLIP2',
  AWSS3SecretKey: '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',
  S3Bucketname: 'project-lite-staging-flex20200415095037299600000001',
  S3BucketRootFolder: 'dev',
  //Env: 'dev',
  //S3 Details Ends here

  //AuthSource:'ActiveDirectory'
  AuthSource: 'Cognito',
  region: 'ap-southeast-2',
  userPoolId: 'ap-southeast-2_nfHuSVZSa',
  userPoolWebClientId: '4d99r5si253niabl6qcgcq1lr1',

  //Cognito Test Details 
  //region: 'ap-southeast-2',
  //userPoolId: 'ap-southeast-2_OMQPUGGcl',
  //userPoolWebClientId: '2m801p27jmhrcrn8v2oi1q0stc',

  ////Cognito Prod Details 
  //region: 'ap-southeast-2',
  //userPoolId: 'ap-southeast-2_2kw4UtzTc',
  //userPoolWebClientId: '4g4gtfvs460klbhrl146jaeb12',

  Password: 'FlexWF!23'
};

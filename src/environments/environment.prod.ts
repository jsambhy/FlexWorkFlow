export const environment = {
  production: true,
  
  //AuthSource:'ActiveDirectory'
  AuthSource: 'Cognito',

  //TEST details starts here uncomment below section for TEST deployment
   
  //Test api url
  //baseUrl: 'https://api.test.flexwf.com/api', 
  //reportBaseUrl: 'https://api.test.reports.flexwf.com/api',
  // //S3 Test bucke Details Details Starts here
   
   
  //AWSS3AccessKey: 'AKIA3QXMNHQYWJUARSGL',
  //AWSS3SecretKey: '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',
  //S3Bucketname: 'flexwf-s3-test',
  //S3BucketRootFolder: 'test',
  ////Env: 'Test',
  ////S3 Details Ends here

  // //Cognito Test Details 
  //region: 'ap-southeast-2',
  //userPoolId: 'ap-southeast-2_OMQPUGGcl',
  //userPoolWebClientId: '2m801p27jmhrcrn8v2oi1q0stc',
  //Password: 'FlexWF!23',

   


  //PROD details starts here uncomment below section for PROD deployment

    //Prod api url
  baseUrl: 'https://api.prod.flexwf.com/api',
  reportBaseUrl: 'https://api.prod.reports.flexwf.com/api',

  //S3 Prod bucket Details Details Starts here
  AWSS3AccessKey: 'AKIA3QXMNHQYQGAAL2XP',
  AWSS3SecretKey: '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',
  S3Bucketname: 'flexwf-s3-prod',
  S3BucketRootFolder: 'prod',
  //Env: 'Prod',
  //S3 Details Ends here

  
  
  //Cognito Prod Details 
  region: 'ap-southeast-2',
  userPoolId: 'ap-southeast-2_2kw4UtzTc',
  userPoolWebClientId: '4g4gtfvs460klbhrl146jaeb12',
  Password: 'FlexWF!23'
  
};

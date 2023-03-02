export type AuthParamList = {
  WelcomeAuth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  VerifyCode: { emailOrNumber: string | number };
};

export type AuthParamList = {
  WelcomeAuth: { shouldGoBack?: boolean };
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  VerifyCode: { emailOrNumber: string | number };
  ChangePassword: undefined;
};

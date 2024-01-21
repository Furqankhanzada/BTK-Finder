export type AddMembersParamList = {
  Email: { businessId: string | undefined };
  Packages: { businessId: string | undefined; email: string };
  Duration: { businessId: string | undefined };
  Billing: { businessId: string | undefined };
};

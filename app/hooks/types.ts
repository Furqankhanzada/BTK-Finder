// Using enums from the package 'sp-react-native-in-app-updates' results in typeerror. so declaring our own here.

export enum AndroidInstallStatus {
  INSTALLED = '4',
  CANCELED = '6',
  // Also note that DOWNLOADED value should be a number instead of a string.
  DOWNLOADED = 11,
}

export enum AndroidUpdateType {
  FLEXIBLE = 0,
  IMMEDIATE = 1,
}

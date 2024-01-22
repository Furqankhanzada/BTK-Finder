import Config from 'react-native-config';

//API End Points
export const SIGNUP = `${Config.API_URL}/api/v1/auth/signup`;
export const LOGIN = `${Config.API_URL}/api/v1/auth/login`;
export const RESET_PASSWORD = `${Config.API_URL}/api/v1/auth/forgotPassword`;
export const VERIFY_CODE = `${Config.API_URL}/api/v1/auth/verifyCode`;
export const CHANGE_PASSWORD = `${Config.API_URL}/api/v1/auth/changePassword`;

export const GET_CATEGORIES = `${Config.API_URL}/api/v1/categories`;

export const GET_PROFILE = `${Config.API_URL}/api/v1/auth/profile`;
export const EDIT_PROFILE = `${Config.API_URL}/api/v1/users/`;
export const DELETE_PROFILE = `${Config.API_URL}/api/v1/users`;

export const BUSINESSES_API = `${Config.API_URL}/api/v1/businesses`;

export const NOTIFICATIONS_API = `${Config.API_URL}/api/v1/notifications`;
export const NOTIFICATIONS_USER_API = `${Config.API_URL}/api/v1/notification-users`;

export const DEVICES_API = `${Config.API_URL}/api/v1/devices`;

export const UPLOAD = `${Config.API_URL}/api/v1/files/upload`;
export const DELETE = `${Config.API_URL}/api/v1/files/delete`;

export const INVOICES_API = `${Config.API_URL}/api/v1/invoices`;

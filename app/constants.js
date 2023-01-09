import Config from 'react-native-config';

//API End Points
export const SIGNUP = `${Config.API_URL}/auth/signup`;
export const LOGIN = `${Config.API_URL}/auth/login`;
export const RESET_PASSWORD = `${Config.API_URL}/auth/forgotPassword`;
export const VERIFY_CODE = `${Config.API_URL}/auth/verifyCode`;
export const CHANGE_PASSWORD = `${Config.API_URL}/auth/changePassword`;

export const GET_CATEGORIES = `${Config.API_URL}/categories`;
export const GET_PROFILE = `${Config.API_URL}/auth/profile`;

export const EDIT_PROFILE = `${Config.API_URL}/users/`;
export const DELETE_PROFILE = `${Config.API_URL}/users`;

export const BUSINESSES_API = `${Config.API_URL}/businesses`;
export const NOTIFICATIONS_API = `${Config.API_URL}/notifications`;
export const NOTIFICATIONS_USER_API = `${Config.API_URL}/notification-users`;

export const UPLOAD = `${Config.API_URL}/files/upload?folder=users`;

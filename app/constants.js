import Config from 'react-native-config';

//API End Points
export const SIGNUP = `${Config.API_URL}/auth/signup`;
export const LOGIN = `${Config.API_URL}/auth/login`;

export const GET_CATEGORIES = `${Config.API_URL}/categories`;
export const GET_PROFILE = `${Config.API_URL}/auth/profile`;

export const EDIT_PROFILE = `${Config.API_URL}/users/`;

export const BUSINESSES_API = `${Config.API_URL}/businesses`;

export const UPLOAD = `${Config.API_URL}/files/upload?folder=users`;

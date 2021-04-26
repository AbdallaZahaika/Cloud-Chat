/* eslint-disable @typescript-eslint/no-redeclare */
export const LOADING_USER = "LOADING_USER";
export const FAIL = "FAIL";
export const UPDATEUSER_INFO_SUCCESS = "UPDATEUSER_INFO_SUCCESS";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const ADD_FRIEND_SUCCESS = "ADD_FRIEND_SUCCESS";
export const NEWUSER_SUCCESS = "NEWUSER_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SET_USER_IFNO = "SET_USER_IFNO";
export const CHECK_USER_SUCCESS = "CHECK_USER_SUCCESS";
export const SEARCH_ADD_FRIEND_SUCCESS = "SEARCH_ADD_FRIEND_SUCCESS";
export const ACCEPT = "ACCEPT";
export const REMOVE_FRIEND_OR_BLOCK = "REMOVE_FRIEND_OR_BLOCK";
export const DENIED = "DENIED";
export const UPLOADIMAGE = "UPLOADIMAGE";
export const DELETE_AVATAR = "DELETE_AVATAR";
export const CONFIR_MEMAIL = "CONFIR_MEMAIL";
export const SEND_EMAIL_FORGOTEPASSOWRD = "SEND_EMAIL_FORGOTEPASSOWRD";
export const REST_PASSWROD = "REST_PASSWROD";
export const GET_FRIENDS_LIST = "GET_FRIENDS_LIST";
export const SEARCH_IN_FRIENDS_LIST = "SEARCH_IN_FRIENDS_LIST";
export const CLEAR_USER = "CLEAR_USER";
export const REFRESH_NOTIFICATIONS = "REFRESH_NOTIFICATIONS";

//////////////////////////////////////
//DATE
//////////////////////////////////////
interface DATE {
  time: string;
  day: string;
  date: string;
}

//////////////////////////////////////
//FRIENDS
//////////////////////////////////////
export interface FRIENDS {
  _id: number;
  name: string;
  avatar: string;
  block: boolean;
}

//////////////////////////////////////
//USER
//////////////////////////////////////
export interface USER {
  name: string;
  avatar: string;
  friends: Array<FRIENDS> | [];
  requestFriend: Array<ADDFRIEND> | [];
  chats: string;
  _id: string;
}

//////////////////////////////////////
//NEWUSER
//////////////////////////////////////
export interface NEWUSER {
  name: string;
  avatar?: string;
  email: string;
  password: string;
}

//////////////////////////////////////
//UPDATEUSER
//////////////////////////////////////
export interface UPDATEUSER {
  avatar: string;
  name: string;
}

//////////////////////////////////////
//CHANGEPASSWORD
//////////////////////////////////////
export interface CHANGEPASSWORD {
  password: string;
  newPassword: string;
}

//////////////////////////////////////
//ADDFRIEND
//////////////////////////////////////
export interface ADDFRIEND {
  _id: string;
  date: DATE;
  message?: string;
  name: string;
  avatar: string;
  token?: string | null;
}
//////////////////////////////////////
//NEWFRIEND : result from seacrh add friend
//////////////////////////////////////
export interface NEWFRIEND {
  _id: string;
  name: string;
  avatar: string;
}

//////////////////////////////////////
//LOGIN
//////////////////////////////////////
export interface LOGIN {
  email: string;
  password: string;
}
//////////////////////////////////////
//LOGIN
//////////////////////////////////////
export interface NotificationAnswerBody {
  answer: boolean;
  _id: string;
  friendName?: string;
  myName?: string;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface LOADING_USER {
  type: typeof LOADING_USER;
}
export interface FAIL {
  type: typeof FAIL;
}
// export interface FAIL {
//   type: typeof FAIL;
//   payload: any;
// }
export interface NEWUSER_SUCCESS {
  type: typeof NEWUSER_SUCCESS;
}
export interface UPDATEUSER_INFO_SUCCESS {
  type: typeof UPDATEUSER_INFO_SUCCESS;
  payload: UPDATEUSER;
}
export interface CHANGE_PASSWORD_SUCCESS {
  type: typeof CHANGE_PASSWORD_SUCCESS;
}
export interface SEND_EMAIL_FORGOTEPASSOWRD {
  type: typeof SEND_EMAIL_FORGOTEPASSOWRD;
}
export interface GET_FRIENDS_LIST {
  type: typeof GET_FRIENDS_LIST;
  payload: Array<NEWFRIEND>;
}
export interface DELETE_AVATAR {
  type: typeof DELETE_AVATAR;
}
export interface REMOVE_FRIEND_OR_BLOCK {
  type: typeof REMOVE_FRIEND_OR_BLOCK;
}
export interface REST_PASSWROD {
  type: typeof REST_PASSWROD;
}
export interface ADD_FRIEND_SUCCESS {
  type: typeof ADD_FRIEND_SUCCESS;
}

export interface CONFIR_MEMAIL {
  type: typeof CONFIR_MEMAIL;
}
export interface SEARCH_IN_FRIENDS_LIST {
  type: typeof SEARCH_IN_FRIENDS_LIST;
  payload: Array<NEWFRIEND>;
}

export interface CHECK_USER_SUCCESS {
  type: typeof CHECK_USER_SUCCESS;
  payload: string;
}
export interface LOGIN_SUCCESS {
  type: typeof LOGIN_SUCCESS;
}
export interface LOGOUT_SUCCESS {
  type: typeof LOGOUT_SUCCESS;
}
export interface SET_USER_IFNO {
  type: typeof SET_USER_IFNO;
  payload: USER;
}
export interface SEARCH_ADD_FRIEND_SUCCESS {
  type: typeof SEARCH_ADD_FRIEND_SUCCESS;
  payload: Array<NEWFRIEND>;
}
export interface ACCEPT {
  type: typeof ACCEPT;
}

export interface DENIED {
  type: typeof DENIED;
}
export interface UPLOADIMAGE {
  type: typeof UPLOADIMAGE;
}
export interface CLEAR_USER {
  type: typeof CLEAR_USER;
}

export interface REFRESH_NOTIFICATIONS {
  type: typeof REFRESH_NOTIFICATIONS;
  payload: any;
}
export type userTypes =
  | LOADING_USER
  | FAIL
  | NEWUSER_SUCCESS
  | UPDATEUSER_INFO_SUCCESS
  | ADD_FRIEND_SUCCESS
  | LOGOUT_SUCCESS
  | LOGIN_SUCCESS
  | CHECK_USER_SUCCESS
  | CHANGE_PASSWORD_SUCCESS
  | SET_USER_IFNO
  | SEARCH_ADD_FRIEND_SUCCESS
  | ACCEPT
  | DENIED
  | UPLOADIMAGE
  | DELETE_AVATAR
  | SEND_EMAIL_FORGOTEPASSOWRD
  | REST_PASSWROD
  | CONFIR_MEMAIL
  | GET_FRIENDS_LIST
  | SEARCH_IN_FRIENDS_LIST
  | REMOVE_FRIEND_OR_BLOCK
  | CLEAR_USER
  | REFRESH_NOTIFICATIONS;

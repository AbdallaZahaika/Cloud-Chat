/* eslint-disable @typescript-eslint/no-redeclare */
export const LOADING_CHATLIST = "LOADING_CHATLIST";
export const FAIL = "FAIL";
export const GETCHATLIST_SUCCESS = "GETCHATLIST_SUCCESS";
export const NEWCHAT_SUCCESS = "NEWCHAT_SUCCESS";
export const DELETECHAT_SUCCESS = "DELETECHAT_SUCCESS";
export const LEST_MESSAGE_SUCCESS = "LEST_MESSAGE_SUCCESS";
export const CLEAR_CHAT_LIST = "CLEAR_CHAT_LIST";
export const SEARCH_IN_CHAT_LIST = "SEARCH_IN_CHAT_LIST";

interface DATE {
  time: string;
  day: string | number;
  date: string;
}

export interface MESSAGE {
  message: string;
  date: DATE;
  userId?: string;
}

export interface ChatInfo {
  lestMessage: string;
  timeForTheLastMessage: DATE;
  _id: string;
}
export interface FriendInfo {
  name: string;
  avatar: string;
  _id: string;
}

export interface CHAT {
  chatInfo: ChatInfo;
  friendInfo: FriendInfo;
}

export interface LESTMESSAGE {
  message: MESSAGE;
  _id: string;
}

export interface LOADING_CHATLIST {
  type: typeof LOADING_CHATLIST;
}
export interface FAIL {
  type: typeof FAIL;
}
export interface NEWCHAT_SUCCESS {
  type: typeof NEWCHAT_SUCCESS;
}
export interface DELETECHAT_SUCCESS {
  type: typeof DELETECHAT_SUCCESS;
}
export interface CLEAR_CHAT_LIST {
  type: typeof CLEAR_CHAT_LIST;
}
export interface GETCHATLIST_SUCCESS {
  type: typeof GETCHATLIST_SUCCESS;
  payload: Array<CHAT>;
}
export interface SEARCH_IN_CHAT_LIST {
  type: typeof SEARCH_IN_CHAT_LIST;
  payload: Array<CHAT>;
}
export interface LEST_MESSAGE_SUCCESS {
  type: typeof LEST_MESSAGE_SUCCESS;
  payload: LESTMESSAGE;
}

export type chatListTypes =
  | LOADING_CHATLIST
  | FAIL
  | GETCHATLIST_SUCCESS
  | DELETECHAT_SUCCESS
  | NEWCHAT_SUCCESS
  | CLEAR_CHAT_LIST
  | LEST_MESSAGE_SUCCESS
  | SEARCH_IN_CHAT_LIST;

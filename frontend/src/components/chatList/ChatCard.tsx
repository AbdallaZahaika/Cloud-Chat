/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setChatInfo } from "../../store/chatRoom/chatRoomActions";
import React from "react";
import { CHAT } from "../../store/chatList/chatListTypes";
import { RootStore } from "../../store";
import { serverUrl } from "../../services/serverUrl.json";
import getDate from "../../services/date";
import { useHistory } from "react-router-dom";
export interface ChatCardProps {
  chatCard: CHAT;
}
const useStyles = makeStyles({
  box: {
    boxShadow: "0px 0px 1px rgba(0,0,0,0.5)",
    padding: 15,
    cursor: "pointer",
  },
  Avatar: {
    width: 50,
    height: 50,
    boxShadow: "0px 0px 1px rgba(0,0,0,1)",
  },
  typography: {
    margin: "0px 15px 0px 15px",
  },
});

const ChatCard: React.FC<ChatCardProps> = ({ chatCard }) => {
  const { chatInfo, friendInfo } = chatCard;
  const { room } = useSelector((state: RootStore) => state.chatRoom);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChangeChat = async () => {
    dispatch(setChatInfo(friendInfo));
    if (matches) {
      history.push("/room");
    }
  };

  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.box}
      style={{
        backgroundColor:
          chatInfo && room.chatInfo && room.chatInfo._id === chatInfo._id
            ? "rgb(235,235,235)"
            : "#fff",
      }}
      onClick={handleChangeChat}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          src={serverUrl + friendInfo.avatar}
          className={classes.Avatar}
        />
        <Box>
          <Typography variant="h6" className={classes.typography}>
            {friendInfo.name}
          </Typography>
          <Typography variant="body2" className={classes.typography}>
            {chatInfo && chatInfo.lestMessage}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="caption">
          {chatInfo && getDate("return-date", chatInfo.timeForTheLastMessage)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatCard;

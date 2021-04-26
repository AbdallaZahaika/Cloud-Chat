import React from "react";
import { useDispatch } from "react-redux";
import { newChat } from "../../store/chatList/chatListActions";
import { removeORblock, setUserInfo } from "../../store/user/userActions";
import { serverUrl } from "../../services/serverUrl.json";
import { useHistory } from "react-router-dom";
import { CLEAR_ROOM } from "../../store/chatRoom/chatRoomTypes";
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { PersonAddDisabled } from "@material-ui/icons";
export interface ChatCardProps {
  friendInfo: {
    _id: string;
    avatar: string;
    name: string;
  };
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

const NewChatCard: React.FC<ChatCardProps> = ({ friendInfo }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleNewChat = async () => {
    await dispatch(newChat(friendInfo._id));
    history.push("/");
  };

  const handleRemoveFriend = async (
    _id: string,
    answer: "remove" | "blockOrUnblock"
  ) => {
    await dispatch(removeORblock(_id, answer));
    dispatch(setUserInfo());
    return dispatch({ type: CLEAR_ROOM });
  };

  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.box}
      width="100%"
    >
      <Box display="flex" alignItems="center" onClick={handleNewChat} flex="1">
        <Avatar
          src={friendInfo.avatar && `${serverUrl}${friendInfo.avatar}`}
          className={classes.Avatar}
        />
        <Typography variant="h6" className={classes.typography}>
          {friendInfo.name}
        </Typography>
      </Box>
      <IconButton onClick={() => handleRemoveFriend(friendInfo._id, "remove")}>
        <PersonAddDisabled color="error" />
      </IconButton>
    </Box>
  );
};

export default NewChatCard;

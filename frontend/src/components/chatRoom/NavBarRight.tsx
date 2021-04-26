import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Delete, Block, PersonAddDisabled } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../store";
import { deleteChat, setChatList } from "../../store/chatList/chatListActions";
import { removeORblock } from "../../store/user/userActions";
import { setChatInfo } from "../../store/chatRoom/chatRoomActions";
import { serverUrl } from "../../services/serverUrl.json";
import { CLEAR_ROOM } from "../../store/chatRoom/chatRoomTypes";
export interface Props {}

const useStyles = makeStyles({
  Box: {
    width: "100%",
    height: 80,
    backgroundColor: "rgb(237,237,237)",
    borderLeft: "2px solid rgb(229,221,213)",
  },
  Avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  marginLeft: {
    marginLeft: 10,
  },
});

export interface NavBarRightProps {}

const NavBarRight: React.FC<NavBarRightProps> = () => {
  const { room } = useSelector((state: RootStore) => state.chatRoom);
  const dispatch = useDispatch();
  const handleDeleteChat = async () => {
    await dispatch(deleteChat(room.chatInfo._id));
    dispatch(setChatList());
    dispatch({ type: CLEAR_ROOM });
  };
  const handleUpdateBlock = async () => {
    dispatch(removeORblock(room.friendInfo._id, "blockOrUnblock"));
    setTimeout(() => {
      dispatch(setChatInfo(room.friendInfo));
    }, 100);
  };
  const handleDeleteFriend = async () => {
    dispatch(removeORblock(room.friendInfo._id, "remove"));
    dispatch({ type: CLEAR_ROOM });
    dispatch(setChatList());
  };

  const classes = useStyles();
  return (
    <Box
      className={classes.Box}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" ml={2}>
        <Avatar
          src={serverUrl + room.friendInfo.avatar}
          className={classes.Avatar}
        />
        <Typography variant="h6">{room.friendInfo.name}</Typography>
      </Box>
      <Box>
        {room.friendInfo.friendStatus ? (
          <IconButton
            className={classes.marginLeft}
            onClick={handleDeleteFriend}
          >
            <PersonAddDisabled color="error" fontSize="large" />
          </IconButton>
        ) : (
          "you are not friends"
        )}

        <IconButton className={classes.marginLeft} onClick={handleUpdateBlock}>
          <Block fontSize="large" color="error" />
        </IconButton>

        <IconButton className={classes.marginLeft} onClick={handleDeleteChat}>
          <Delete fontSize="large" color="error" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NavBarRight;

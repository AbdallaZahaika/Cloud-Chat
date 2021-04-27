import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  Delete,
  Block,
  PersonAddDisabled,
  MoreVert,
  ArrowBackIos,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../store";
import { deleteChat, setChatList } from "../../store/chatList/chatListActions";
import { removeORblock } from "../../store/user/userActions";
import {
  setChatInfo,
  clearChatRoomState,
} from "../../store/chatRoom/chatRoomActions";
import { serverUrl } from "../../services/serverUrl.json";
import { CLEAR_ROOM } from "../../store/chatRoom/chatRoomTypes";
import { useHistory } from "react-router-dom";
export interface Props {}

const useStyles = makeStyles((theme) => ({
  Box: {
    width: "100%",
    height: 80,
    backgroundColor: "rgb(237,237,237)",
    [theme.breakpoints.down("sm")]: {
      borderLeft: "none",
    },
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
}));

export interface NavBarRightProps {}

const NavBarRight: React.FC<NavBarRightProps> = () => {
  const { room } = useSelector((state: RootStore) => state.chatRoom);
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDeleteChat = async () => {
    await dispatch(deleteChat(room.chatInfo._id));
    dispatch(setChatList());
    dispatch({ type: CLEAR_ROOM });
    if (matches) {
      setAnchorEl(null);
      history.replace("/");
    }
  };
  const handleUpdateBlock = async () => {
    dispatch(removeORblock(room.friendInfo._id, "blockOrUnblock"));
    setTimeout(() => {
      dispatch(setChatInfo(room.friendInfo));
    }, 100);
    if (matches) {
      setAnchorEl(null);
    }
  };
  const handleDeleteFriend = async () => {
    dispatch(removeORblock(room.friendInfo._id, "remove"));
    dispatch({ type: CLEAR_ROOM });
    dispatch(setChatList());
    if (matches) {
      setAnchorEl(null);
      history.replace("/");
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    dispatch(clearChatRoomState());
    history.replace("/");
  };

  const classes = useStyles();
  return (
    <Box
      className={classes.Box}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box display="flex" alignItems="center">
        {matches ? (
          <IconButton onClick={handleBack}>
            <ArrowBackIos htmlColor="#00b4d8" />
          </IconButton>
        ) : (
          ""
        )}
        <Avatar
          src={serverUrl + room.friendInfo.avatar}
          className={classes.Avatar}
        />
        <Typography variant="h6">{room.friendInfo.name}</Typography>
      </Box>
      {!matches ? (
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

          <IconButton
            className={classes.marginLeft}
            onClick={handleUpdateBlock}
          >
            <Block fontSize="large" color="error" />
          </IconButton>

          <IconButton className={classes.marginLeft} onClick={handleDeleteChat}>
            <Delete fontSize="large" color="error" />
          </IconButton>
        </Box>
      ) : (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDeleteChat}>Delete Chat</MenuItem>
            <MenuItem onClick={handleUpdateBlock}>Block</MenuItem>
            <MenuItem onClick={handleDeleteFriend}>Remove Friend</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default NavBarRight;

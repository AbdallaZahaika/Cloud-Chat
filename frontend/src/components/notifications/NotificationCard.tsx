import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Close, Check } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADDFRIEND } from "../../store/user/userTypes";
import { answerNotification, setUserInfo } from "../../store/user/userActions";
import { RootStore } from "../../store";
import { toast } from "react-toastify";
import { serverUrl } from "../../services/serverUrl.json";
export interface ChatCardProps {
  requestFriendInfo: ADDFRIEND;
}
const useStyles = makeStyles({
  box: {
    cursor: "default",
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

const NotificationCard: React.FC<ChatCardProps> = ({ requestFriendInfo }) => {
  const { user } = useSelector((state: RootStore) => state.user);

  const dispatch = useDispatch();

  const classes = useStyles();

  const handleAnswerNotification = async (answer: "ACCEPT" | "DENIED") => {
    if (answer === "ACCEPT") {
      const dataBody = {
        answer: true,
        _id: requestFriendInfo._id,
        friendName: requestFriendInfo.name,
        myName: user.name,
      };

      await dispatch(answerNotification(dataBody));

      dispatch(setUserInfo());
      return toast.success(
        `now you are friend with ${requestFriendInfo.name} `
      );
    }
    if (answer === "DENIED") {
      const dataBody = {
        _id: requestFriendInfo._id,
        answer: false,
      };

      await dispatch(answerNotification(dataBody));
      return dispatch(setUserInfo());
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.box}
      flexDirection="column"
      boxShadow="0px 0px 1px rgba(0,0,0,0.5)"
      width="100%"
      p={2}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={serverUrl + requestFriendInfo.avatar}
            className={classes.Avatar}
          />
          <Typography variant="h6" className={classes.typography}>
            {requestFriendInfo.name}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => handleAnswerNotification("ACCEPT")}>
            <Check htmlColor="green" />
          </IconButton>
          <IconButton onClick={() => handleAnswerNotification("DENIED")}>
            <Close color="error" />
          </IconButton>
        </Box>
      </Box>
      <Box width="100%" dir="auto" mt={1}>
        <Typography variant="body2" className={classes.typography}>
          {requestFriendInfo.message}
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationCard;

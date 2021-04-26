import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
  Collapse,
} from "@material-ui/core";
import { PersonAdd, Check, Close } from "@material-ui/icons";
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputFormikMarerialUi from "../common/inputs/InputFormikMarerialUi";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../../store/user/userActions";
import { ADDFRIEND, NEWFRIEND } from "../../store/user/userTypes";
import { serverUrl } from "../../services/serverUrl.json";
import { RootStore } from "../../store";
import socket from "../../store/socket";
export interface ChatCardProps {
  userInfo: NEWFRIEND;
}

interface MyFormValues {
  message: string;
}

/////////// Formik initialValues
const initialValues: MyFormValues = {
  message: "",
};

/////////// Formik Schema
const validationSchema = Yup.object({
  message: Yup.string()
    .min(2, `message must be longer than 2 characters`)
    .max(50, `message must be shorter than 50 characters`),
});

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

const AddFriendCard: React.FC<ChatCardProps> = ({ userInfo }) => {
  const io = socket();
  /// this state handle value if Add Frind  Message Open show or hide
  const [isVisible, setIsVisible] = React.useState(false);
  const { user } = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();
  const handleShowMessage = () => {
    setIsVisible(!isVisible);
  };

  const classes = useStyles();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.box}
      boxShadow="0px 0px 1px rgba(0,0,0,0.5)"
      width="100%"
      p={2}
      flexDirection="column"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={`${serverUrl}${userInfo.avatar}`}
            className={classes.Avatar}
          />
          <Typography variant="h6" className={classes.typography}>
            {userInfo.name}
          </Typography>
        </Box>
        <IconButton onClick={handleShowMessage}>
          <PersonAdd htmlColor="black" />
        </IconButton>
      </Box>

      <Collapse
        in={isVisible}
        style={{ width: "100%", margin: "10px 0px 0px 0px" }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setFieldError }) => {
            const dataBody: ADDFRIEND = {
              _id: userInfo._id,
              date: {
                time: "10:20",
                day: "10:20",
                date: "10:20",
              },
              avatar: user.avatar,
              name: user.name,
            };
            if (values.message) {
              dataBody.message = values.message;
            }
            await dispatch(addFriend(dataBody));

            return io.on("add-friend-status", (status) => {
              if (status === "add-friend-error") {
                return io.on("add-friend-error", (err) => {
                  const error = String(Object.entries(err.errors)[0][1]);
                  setFieldError("message", error);
                });
              } else if (status === "already-friends-error") {
                return setFieldError(
                  "message",
                  "you already sent request or you already friends !!!"
                );
              } else if (status === "success") {
                setIsVisible(!isVisible);
              }
            });
          }}
        >
          {({ handleSubmit, isValid, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <InputFormikMarerialUi
                name="message"
                label="Message*"
                error={errors.message && touched.message}
              />
              <Box display="flex" width="100%" justifyContent="center">
                <Box ml={2}>
                  <IconButton type="submit" disabled={!isValid}>
                    <Check
                      htmlColor={!isValid ? "black" : "green"}
                      fontSize="large"
                    />
                  </IconButton>
                  <IconButton onClick={handleShowMessage}>
                    <Close color="error" fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Collapse>
    </Box>
  );
};

export default AddFriendCard;

import React from "react";
import { Form, Formik } from "formik";
import InpotFormik from "../common/inputs/InputFormik";
import * as Yup from "yup";
import { Send } from "@material-ui/icons";
import { makeStyles, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../../store/chatRoom/chatRoomActions";
import { RootStore } from "../../store";
import NewDate from "../../services/date";
import { MESSAGE } from "../../store/chatRoom/chatRoomTypes";
import socket from "../../store/socket";
export interface FooterChatProps {
  _id: string;
}

interface MyFormValues {
  message: string;
}

const initialValues: MyFormValues = {
  message: "",
};
const validationSchema = Yup.object({
  message: Yup.string().min(1, "").max(2000, "").required(""),
});

const useStyles = makeStyles({
  form: {
    backgroundColor: "#F0F0F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
  },
  iconSend: {
    margin: "0px 5px 0px 5px",
  },
});

const FooterChat: React.FC<FooterChatProps> = ({ _id }) => {
  const io = socket();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootStore) => state.user);
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setFieldError }) => {
        const date: any = NewDate("get-date");
        const message: MESSAGE = {
          message: values.message,
          date: { day: date.day, time: date.time, date: date.date },
          userId: user._id,
        };

        dispatch(newMessage(_id, message));
        values.message = "";
        return io.on("message-output-status", (status) => {
          if (status === "message-output-status-error") {
            return io.on("message-output-error", (err) => {
              const error = String(Object.entries(err.errors)[0][1]);
              setFieldError("message", error);
            });
          } else {
            values.message = "";
          }
        });
      }}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <Form onSubmit={handleSubmit} className={classes.form}>
          <InpotFormik name="message" placeholder="Write new Message" />
          <IconButton type="submit" disabled={!dirty || !isValid}>
            <Send className={classes.iconSend}></Send>
          </IconButton>
        </Form>
      )}
    </Formik>
  );
};

export default FooterChat;

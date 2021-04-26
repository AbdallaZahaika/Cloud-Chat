import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import { Form, Formik } from "formik";
import InputFormikMarerialUi from "../common/inputs/InputFormikMarerialUi";
import * as Yup from "yup";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../store";
import { sendEmailForgotPassword } from "../../store/user/userActions";

export interface SendForgotPassowrdEmailProps {}
interface MyFormValues {
  email: string;
}

////////// schema reagex Email
const emailRegExp = /^[a-z0-9._\-+]{2,50}@[a-z\-0-9]+(\.[a-z]{2,10})+$/i;

/////////// Formik initialValues
const initialValues: MyFormValues = {
  email: "",
};

/////////// Formik Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .lowercase()
    .matches(emailRegExp, `email is not valid`)
    .required(`this required`),
});

const SendForgotPassowrdEmail: React.FC<SendForgotPassowrdEmailProps> = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { userActive, loding } = useSelector((state: RootStore) => state.user);

  if (userActive) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Box
        bgcolor="rgb(0,191,165)"
        width="100%"
        height="120px"
        display="flex"
        alignItems="center"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Typography
            variant="h4"
            align="center"
            style={{ color: "white", fontWeight: "lighter" }}
          >
            Forgot Password
          </Typography>
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        alignItems="center "
        justifyContent="center"
        mt={5}
      >
        <Typography align="center">
          if you forgot your password, you can create a new one by providing
          your email ,after this you will be accept email to how reset your
          password
        </Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const res: any = await dispatch(
            sendEmailForgotPassword(values.email)
          );
          if (
            (res.response && res.response.status === 400) ||
            (res.response && res.response === undefined)
          ) {
            if (res.response && res.response.data.errors) {
              setFieldError("email", res.response.data.errors);
            }
            return toast.error("errors occurred!");
          }
          toast.success(`check your email`);
          history.replace(`/login`);
        }}
      >
        {({ handleSubmit, isValid, dirty, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" height="78vh">
              <Box display="flex" flexDirection="column" mt={4} pl={2} pr={2}>
                <InputFormikMarerialUi
                  name="email"
                  label="Email*"
                  variant="outlined"
                  error={errors.email && touched.email}
                  style={{ marginBottom: 30 }}
                  disabled={loding}
                />
              </Box>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-around"
                alignItems="center"
              >
                <Button
                  type="submit"
                  disabled={!isValid || !dirty || loding}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {loding ? <CircularProgress /> : "Next"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  to="/login"
                  disabled={loding}
                >
                  cancel
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SendForgotPassowrdEmail;

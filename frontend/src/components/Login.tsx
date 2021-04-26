import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import { Form, Formik } from "formik";
import InputFormikMarerialUi from "./common/inputs/InputFormikMarerialUi";
import * as Yup from "yup";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../store";
import { login, setUserInfo, cheackUser } from "../store/user/userActions";
import { refreshRequestToken } from "../services/http";
import io from "../store/socket";
export interface LoginProps {}
interface MyFormValues {
  email: string;
  password: string;
}

/////////// Formik initialValues
const initialValues: MyFormValues = {
  email: "",
  password: "",
};

/////////// Formik Schema
const validationSchema = Yup.object({
  email: Yup.string().required(`this required`),
  password: Yup.string().required(`this required`),
});

const Login: React.FC<LoginProps> = () => {
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
            variant="h3"
            align="center"
            style={{ color: "white", fontWeight: "lighter" }}
          >
            Login
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const dataBody = {
            password: values.password,
            email: values.email,
          };
          const resLogin: any = await dispatch(login(dataBody));
          if (
            (resLogin.response && resLogin.response.status === 400) ||
            (resLogin.response && resLogin.response === undefined)
          ) {
            if (resLogin.response && resLogin.response.data.error) {
              setFieldError("email", resLogin.response.data.error);
              setFieldError("password", resLogin.response.data.error);
            }
            return toast.error("errors occurred!");
          }
          refreshRequestToken();
          dispatch(setUserInfo());
          dispatch(cheackUser());
          io();
          history.replace("/");
          toast.success("welcome to cloudChat");
        }}
      >
        {({ handleSubmit, isValid, dirty, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" height="78vh">
              <Box display="flex" flexDirection="column" mt={15} pl={2} pr={2}>
                <InputFormikMarerialUi
                  name="email"
                  label="Email*"
                  variant="outlined"
                  error={errors.email && touched.email}
                  style={{ marginBottom: 30 }}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="password"
                  label="Password*"
                  type="password"
                  variant="outlined"
                  error={errors.password && touched.password}
                  disabled={loding}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" pl={2} pr={2}>
                <Typography
                  variant="body2"
                  color="primary"
                  component={Link}
                  to="/signUp"
                >
                  Create New Account
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  component={Link}
                  to="/send-forgotPassowrd-email"
                >
                  Forgot password?
                </Typography>
              </Box>
              <Box display="flex" width="100%" justifyContent="center">
                <Box mt={6}>
                  <Button
                    type="submit"
                    disabled={!isValid || !dirty || loding}
                    variant="contained"
                    size="large"
                    color="primary"
                  >
                    {loding ? <CircularProgress /> : "Login"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;

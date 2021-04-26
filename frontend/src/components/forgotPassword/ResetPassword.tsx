import { Box, Typography, Button } from "@material-ui/core";
import { Form, Formik } from "formik";
import InputFormikMarerialUi from "../common/inputs/InputFormikMarerialUi";
import * as Yup from "yup";
import { useParams, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../store";
import { restPasswrod } from "../../store/user/userActions";

export interface ResetPasswordProps {}
interface MyFormValues {
  password: string;
  passwordConfirm: string;
}

/////////// Formik initialValues
const initialValues: MyFormValues = {
  password: "",
  passwordConfirm: "",
};

/////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

/////////// Formik Schema
const validationSchema = Yup.object({
  password: Yup.string()
    .matches(lowerCaseRegExp, `one lowerCase Required!`)
    .matches(upperCaseRegExp, `one upperCase Required!`)
    .matches(numericRegExp, `one number Required!`)
    .min(6, `password must be longer than 8 characters`)
    .max(1024, `password must be shorter than 1024 characters`)
    .required(`this required`),

  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], `Password must be the same!`)
    .required(`this required`),
});

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  let history = useHistory();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { userActive } = useSelector((state: RootStore) => state.user);

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
            Rest Password
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
        <Typography align="center"></Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const res: any = await dispatch(
            restPasswrod(values.password, params.resetLink)
          );
          if (res.response && res.response.status === 400) {
            if (res.response.data.errors) {
              setFieldError("email", res.response.data.errors);
            }
            return toast.error("errors occurred!");
          }
          toast.success(`password changed`);
          history.replace(`/login`);
        }}
      >
        {({ handleSubmit, isValid, dirty, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" height="78vh">
              <Box display="flex" flexDirection="column" mt={4} pl={2} pr={2}>
                <InputFormikMarerialUi
                  placeholder="Enter 8 characters."
                  name="password"
                  label="New Password*"
                  type="password"
                  error={errors.password && touched.password}
                />
                <InputFormikMarerialUi
                  placeholder="Enter 8 characters."
                  name="passwordConfirm"
                  type="password"
                  label="Confirm Password*"
                  error={errors.passwordConfirm && touched.passwordConfirm}
                />
              </Box>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-around"
                alignItems="center"
                mt={4}
              >
                <Button
                  type="submit"
                  disabled={!isValid || !dirty}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ResetPassword;

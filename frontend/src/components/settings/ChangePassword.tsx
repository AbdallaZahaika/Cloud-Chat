import {
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import { Check, Close, ArrowBack } from "@material-ui/icons";
import InputFormikMarerialUi from "../common/inputs/InputFormikMarerialUi";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { chagnePassword } from "../../store/user/userActions";
import { RootStore } from "../../store";
export interface ChangePassWordProps {}
interface MyFormValues {
  password: string;
  newPassword: string;
  passwordConfirm: string;
}

/////////// Formik initialValues
const initialValues: MyFormValues = {
  password: "",
  newPassword: "",
  passwordConfirm: "",
};

/////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

/////////// Formik Schema

const validationSchema = Yup.object({
  password: Yup.string()
    .max(1024, `password must be shorter than 1024 characters`)
    .required(),
  newPassword: Yup.string()
    .matches(lowerCaseRegExp, `one lowerCase Required!`)
    .matches(upperCaseRegExp, `one upperCase Required!`)
    .matches(numericRegExp, `one number Required!`)
    .min(6, `password must be longer than 8 characters`)
    .max(1024, `password must be shorter than 1024 characters`)
    .required(`this required`),

  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("newPassword")], `Password must be the same!`)
    .required(`this required`),
});

const ChangePassWord: React.FC<ChangePassWordProps> = () => {
  const dispatch = useDispatch();
  const { loding } = useSelector((state: RootStore) => state.user);

  let history = useHistory();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Box
        bgcolor="rgb(0,191,165)"
        width="100%"
        height="50px"
        display="flex"
        alignItems="flex-end"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <IconButton component={Link} to="/">
            <ArrowBack htmlColor="black" />
          </IconButton>
          <Typography
            variant="h6"
            align="center"
            style={{ color: "white", fontWeight: "lighter", marginRight: 60 }}
          >
            Update Your Passwrod
          </Typography>
          <Box></Box>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const dataBody = {
            password: values.password,
            newPassword: values.newPassword,
          };
          const res: any = await dispatch(chagnePassword(dataBody));
          if (
            (res.response && res.response.status === 400) ||
            (res.response && res.response === undefined)
          ) {
            if (res.response && res.response.data.errors.password) {
              setFieldError("password", res.response.data.errors.password);
            }
            if (res.response && res.response.data.errors.newPassword) {
              setFieldError(
                "newPassword",
                res.response.data.errors.newPassword
              );
            }
            return toast.error("errors occurred!");
          }

          history.push("/");
        }}
      >
        {({ handleSubmit, isValid, dirty, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" height="78vh">
              <Box display="flex" flexDirection="column" mt={5}>
                <InputFormikMarerialUi
                  name="password"
                  label="password*"
                  type="password"
                  variant="filled"
                  error={errors.password && touched.password}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="newPassword"
                  label="New Password*"
                  type="password"
                  variant="filled"
                  error={errors.newPassword && touched.newPassword}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="passwordConfirm"
                  label="confirm  New Password*"
                  type="password"
                  variant="filled"
                  error={errors.passwordConfirm && touched.passwordConfirm}
                  disabled={loding}
                />
              </Box>
              <Box display="flex" width="100%" justifyContent="center">
                <Box ml={2}>
                  {loding ? (
                    <CircularProgress />
                  ) : (
                    <IconButton
                      type="submit"
                      disabled={!isValid || !dirty || loding}
                    >
                      <Check
                        htmlColor={!isValid || !dirty ? "black" : "green"}
                        fontSize="large"
                      />
                    </IconButton>
                  )}
                  <IconButton component={Link} to="." disabled={loding}>
                    <Close color="error" fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassWord;

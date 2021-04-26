import {
  Box,
  Typography,
  Button,
  IconButton,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { ErrorMessage, Form, Formik } from "formik";
import InputFormikMarerialUi from "./common/inputs/InputFormikMarerialUi";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { newUser, uploadImage } from "../store/user/userActions";
import { NEWUSER } from "../store/user/userTypes";
import { RootStore } from "../store";

export interface LoginProps {}

interface MyFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  avatar: string | undefined;
}

/////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

////////// schema reagex Email
const emailRegExp = /^[a-z0-9._\-+]{2,50}@[a-z\-0-9]+(\.[a-z]{2,10})+$/i;

/////////// Formik initialValues
const initialValues: MyFormValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  avatar: "",
};

/////////// Formik Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, `nickname must be longer than 2 characters`)
    .max(125, `nickname must be shorter than 125 characters`)
    .required(`this required`),
  email: Yup.string()
    .lowercase()
    .matches(emailRegExp, `email is not valid`)
    .required(`this required`),
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

const useStyles = makeStyles({
  form: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    flexDirection: "column",
    height: "79vh",
  },
  avatarContainer: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "default",

    "&:hover $addAPhotoContaienr": {
      display: "flex",
    },
  },
  addAPhotoContaienr: {
    display: "none",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    transition: "all 0.3s ease-in-out",
  },
});

const SignUp: React.FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const { loding } = useSelector((state: RootStore) => state.user);
  const FILE_SIZE = 5 * 1024 * 1024;
  const history = useHistory();

  ///// this preview Image
  const [img, setImg] = React.useState(
    "https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_960_720.png"
  );

  //// this fucntion handle new image
  //// 1:change src : preview image
  //// 2:change the vlaue of avatar in formik Values
  const handleNewImage = (
    e: any,
    setFieldValue: (field: string, value: object) => void,
    setFieldError: (field: string, message: string | undefined) => void
  ) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImg(URL.createObjectURL(file));
    /// this new image
    setFieldValue("avatar", file);
    if (file.size > FILE_SIZE) {
      setFieldError("avatar", "file to large");
    } else if (
      file.type !== ".png" &&
      file.type !== ".jpg" &&
      file.type !== ".jpeg" &&
      file.type !== ".gif" &&
      file.type !== ".psd" &&
      file.type !== ".jfif"
    ) {
      setFieldError("avatar", "only .png .jpg .jpeg .gif .psd .jfif");
    }
  };

  const handleDeleteImage = (
    setFieldValue: (field: string, value: object) => void
  ) => {
    setImg(
      "https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_960_720.png"
    );
    setFieldValue("avatar", {});
  };

  const classes = useStyles();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Box
        bgcolor="rgb(0,191,165)"
        width="100%"
        height="60px"
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
            Sign Up
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const dataBody: NEWUSER = {
            name: values.name,
            email: values.email,
            password: values.password,
          };
          if (values.avatar) {
            let formData = new FormData();
            formData.append("image", values.avatar);
            const res: any = await dispatch(uploadImage(formData));
            if (res.response && res.response.status === 400) {
              if (res.response.data.errors) {
                setFieldError("avatar", res.response.data.errors);
              }
              return toast.error("errors occurred!");
            }
            dataBody.avatar = res;
          }

          const respons: any = await dispatch(newUser(dataBody));

          if (
            (respons.response && respons.response.status === 400) ||
            (respons.response && respons.response === undefined)
          ) {
            if (respons.response && respons.response.data.errors.name) {
              setFieldError("name", respons.response.data.errors.name);
            }
            if (respons.response && respons.response.data.errors.email) {
              setFieldError("email", respons.response.data.errors.email);
            }
            if (respons.response && respons.response.data.errors.password) {
              setFieldError("password", respons.response.data.errors.password);
            }
            if (respons.response && respons.response.data.errors.avatar) {
              setFieldError("avatar", respons.response.data.errors.avatar);
            }
            return toast.error("errors occurred!");
          }

          history.push("/login");
          toast.success("sign up success");
        }}
      >
        {({
          handleSubmit,
          isValid,
          dirty,
          errors,
          touched,
          setFieldValue,
          values,
          setFieldError,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" height="78vh">
              <Box
                display="flex"
                flexDirection="column"
                mt={5}
                pl={2}
                pr={2}
                alignItems="center"
              >
                <InputFormikMarerialUi
                  name="email"
                  label="Email*"
                  variant="outlined"
                  error={errors.email && touched.email}
                  style={{ marginBottom: 30 }}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="name"
                  label="Nickname*"
                  variant="outlined"
                  error={errors.name && touched.name}
                  style={{ marginBottom: 30 }}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="password"
                  label="Password*"
                  type="password"
                  variant="outlined"
                  error={errors.password && touched.password}
                  style={{ marginBottom: 30 }}
                  disabled={loding}
                />
                <InputFormikMarerialUi
                  name="passwordConfirm"
                  label="PasswordConfirm*"
                  type="password"
                  variant="outlined"
                  error={errors.passwordConfirm && touched.passwordConfirm}
                  disabled={loding}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    width="200px"
                    height="200px"
                    borderRadius="50%"
                    className={classes.avatarContainer}
                    style={{
                      backgroundImage: img
                        ? `url(${img})`
                        : `url(${values.avatar})`,
                    }}
                  >
                    <Box
                      className={classes.addAPhotoContaienr}
                      width="200px"
                      height="200px"
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      <IconButton component="label">
                        <PhotoCamera htmlColor="white" fontSize="large" />
                        <input
                          type="file"
                          name="avatar"
                          hidden
                          onChange={(e) =>
                            handleNewImage(e, setFieldValue, setFieldError)
                          }
                          disabled={loding}
                        />
                      </IconButton>
                      <Typography variant="body2">CHANGE</Typography>
                      <Typography variant="body2">PROFILE PHOTO</Typography>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <ErrorMessage name="avatar">
                      {(msg) => (
                        <Typography
                          variant="body2"
                          color="error"
                          align="center"
                        >
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => handleDeleteImage(setFieldValue)}
                    disabled={!Boolean(values.avatar) || loding}
                  >
                    Delete Image
                  </Button>
                </Box>
              </Box>

              <Box display="flex" width="100%" justifyContent="center">
                <Box mt={5}>
                  <Button
                    type="submit"
                    disabled={!isValid || !dirty || loding}
                    variant="contained"
                    size="large"
                    color="primary"
                  >
                    {loding ? <CircularProgress /> : "Sign Up"}
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    color="primary"
                    style={{ marginLeft: 25 }}
                    disabled={loding}
                  >
                    SignIn
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

export default SignUp;

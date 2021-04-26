import React from "react";
import { Form, Formik } from "formik";
import InpotFormik from "./inputs/InputFormik";
import * as Yup from "yup";
import { Search } from "@material-ui/icons";
import { makeStyles, IconButton } from "@material-ui/core";

export interface SearchBarChatProps {
  placeholder: string;
  searchV: (value: string) => void;
}

interface MyFormValues {
  searchValue: string;
}

const initialValues: MyFormValues = {
  searchValue: "",
};
const validationSchema = Yup.object({
  searchValue: Yup.string().min(1, "").max(2000, "").required(""),
});

const useStyles = makeStyles({
  form: {
    backgroundColor: "#F0F0F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "10px",
    paddingTop: 10,
  },
  iconSend: {
    margin: "0px 5px 0px 5px",
    transform: "rotate(90deg)",
  },
});

const SearchBar: React.FC<SearchBarChatProps> = ({ placeholder, searchV }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        searchV(values.searchValue);
        values.searchValue = "";
      }}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <Form onSubmit={handleSubmit} className={classes.form}>
          <InpotFormik name="searchValue" placeholder={placeholder} />
          <IconButton type="submit" disabled={!dirty || !isValid}>
            <Search className={classes.iconSend} />
          </IconButton>
        </Form>
      )}
    </Formik>
  );
};

export default SearchBar;

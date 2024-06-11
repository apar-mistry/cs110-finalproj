import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
  },
  formButton: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    fontWeight: 600,
    padding: theme.spacing(1.5),
    borderRadius: "8px",
    textTransform: "none",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      backgroundColor: "#303f9f",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  roomCard: {
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-4px)",
    },
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#3f51b5',
      },
      '&:hover fieldset': {
        borderColor: '#303f9f',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#303f9f',
      },
    },
  },
  gradientBackground: {
    background: "linear-gradient(135deg, #3f51b5 30%, #303f9f 90%)",
    color: "#fff",
    padding: theme.spacing(4),
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  cardHeader: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    padding: theme.spacing(1),
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  cardContent: {
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    borderRadius: "0 0 8px 8px",
  },
  loginContainer: {
    marginTop: theme.spacing(10),
    display: "flex",
    justifyContent: "center",
  },
  loginPaper: {
    padding: theme.spacing(3),
    width: "400px",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-4px)",
    },
  },
  loginTitle: {
    marginBottom: theme.spacing(2),
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
}));

export default useStyles;


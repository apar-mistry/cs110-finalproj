import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3),
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
    color: "#3f51b5",
    fontWeight: 700,
  },
  form: {
    backgroundColor: "#fff",
    padding: theme.spacing(3),
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    color: "#3f51b5",
    fontWeight: 500,
  },
  formButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#3f51b5",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#303f9f",
    },
  },
  roomTitle: {
    marginBottom: theme.spacing(2),
    color: "#3f51b5",
    fontWeight: 500,
  },
  roomList: {
    marginTop: theme.spacing(6),
  },
  roomCard: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  roomCardContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  roomCardActions: {
    justifyContent: "flex-end",
    padding: theme.spacing(1),
  },
}));

export default useStyles;

import app from "./app";

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});

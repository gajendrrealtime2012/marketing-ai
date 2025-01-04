import app from "./app";
import { db } from "./config/db";

// console.log("DB", db);

db.collection("seeds")
  .get()
  .then(() => {
    console.log("Firebase connected successfully.");
  })
  .catch((error) => {
    console.error("Firebase connection error: ", error);
  });

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

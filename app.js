import express, { json } from "express";
import dotenv from "dotenv";
import {
  readExpenses,
  newExpense,
  addExpense,
  findExpense,
  createFile,
  deleteExpense,
  modifyExpense,
  templateMaker,
} from "./utils/fileManipulations.js";
import {
  dataNotFound,
  postSuccess,
  fileCreated,
  divTemplate,
} from "./utils/commonMessages.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/expenses", async (req, res) => {
  try {
    const data = await readExpenses();
    res.status(200);
    res.json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});
app.get("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readExpenses();
    const expense = await findExpense(data, id);
    const expenseHTML = await divTemplate(expense);
    const fullHTML = await templateMaker(expenseHTML);
    res.status(200);
    res.send(fullHTML);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const data = await readExpenses();
    const uid = data.length > 0 ? data[data.length - 1]?.id + 1 : 1;
    console.log(uid);
    const newData = newExpense(uid, "gia", 120);
    await data.push(newData);
    await addExpense(data);
    res.status(200);
    res.json({ success: true, data: postSuccess(newData) });
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        const data = await createFile();
        console.log(fileCreated);
        const newData = newExpense(1, "gia", 120);
        data.push(newData);
        await addExpense(data);
        res.status(200);
        res.json({ success: true, data: postSuccess(newData) });
      } catch (error) {
        console.error("Error during file creation ->", error);
        res.status(500).json({ success: false, data: dataNotFound(error) });
      }
    } else {
      console.error("Error:", err);
      res.status(400);
      res.json({ success: false, data: dataNotFound(err) });
    }
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    console.log("try");
    const { id } = req.params;
    const data = await readExpenses();
    const isAvailable = findExpense(data, id);
    if (isAvailable) {
      try {
        const modification = { cost: 50, name: "mamuka" };
        const modifiedData = modifyExpense(data, id, modification);
        await addExpense(modifiedData);
        res.status(200);
        res.json({
          success: true,
          data: `modifications -> ${JSON.stringify(
            modification
          )} applied to expense with id -> ${id}`,
        });
      } catch (err) {
        res.status(400);
        res.json({
          success: true,
          data: dataNotFound(err),
        });
      }
    } else {
      res.status(400);
      res.json({
        success: true,
        data: `expense do not exist, modifications cant be applied`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});
app.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readExpenses();
    const filteredData = deleteExpense(data, id);
    const baseLength = data.length;
    await addExpense(filteredData.data);
    if (filteredData.data.length === baseLength) {
      res.status(400);
      res.json({ success: false, message: "Expense not found" });
      return;
    }
    res.status(200);
    res.json({ success: true, data: filteredData.deleted });
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on http://127.0.0.1:${PORT}`);
});

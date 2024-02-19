import express, { json, request, Request, Response } from "express";
import dotenv from "dotenv";
import {
  readExpenses,
  addExpense,
  findExpense,
  createFile,
  deleteExpense,
  modifyExpense,
  templateMaker,
  newExpense,
} from "./utils/fileManipulations.js";
import {
  dataNotFound,
  postSuccess,
  fileCreated,
  divTemplate,
} from "./utils/commonMessages.js";
import { logUserAgent } from "./utils/middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
import { ExpenseParams, isErrorWithCode } from "./interfaces/interface.js";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }), logUserAgent);

app.get("/", (req: Request, res: Response) => {
  try {
    res.render("homepage");
  } catch (e) {
    console.log(e);
  }
});

app.get("/expenses", async (req: Request, res: Response) => {
  try {
    const expenses = await readExpenses();
    res.status(200);
    res.render("expenseWrapper", { expenses });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});
app.get("/expenses/:id", async (req: Request<ExpenseParams>, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readExpenses();
    let newId = Number(id);
    const expense = findExpense(data, newId);
    console.log(expense);
    res.status(200);
    res.render("singleProduct", {
      name: expense?.name,
      cost: expense?.cost,
      date: expense?.createdAt,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ success: false, data: dataNotFound(err) });
  }
});

app.post("/expenses", async (req: Request, res: Response) => {
  try {
    const data = await readExpenses();
    const lastExpense = data.length > 0 && data[data?.length - 1];
    const uid = lastExpense ? lastExpense.id : 1;
    const newData = uid && newExpense(uid, "gia", 120);
    newData && data.push(newData);
    await addExpense(data);
    newData &&
      res.status(200).json({ success: true, data: postSuccess(newData) });
  } catch (err) {
    if (isErrorWithCode(err) && err?.code === "ENOENT") {
      try {
        const data = await createFile();
        console.log(fileCreated);
        const newData = newExpense(1, "gia", 120);
        data?.push(newData);
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

app.post("/submit-expense", async (req: Request, res: Response) => {
  try {
    const data = await readExpenses();
    const lastExpense = data.length > 0 && data[data?.length - 1];
    const uid = lastExpense ? lastExpense.id : 1;
    const { name, cost } = req.body;
    const expense = newExpense(Number(uid), name, cost);
    res.json({
      success: true,
      data: expense,
      message: "expense added successfully",
    });
  } catch (e) {
    console.log(e);
  }
});
app.put("/expenses/:id", async (req: Request, res: Response) => {
  try {
    console.log("try");
    const { id } = req.params;
    const data = await readExpenses();
    let newId = Number(id);
    const isAvailable = findExpense(data, newId);
    if (isAvailable) {
      try {
        const modification = { cost: 50, name: "mamuka" };
        const modifiedData = modifyExpense(data, newId, modification);
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
app.delete("/expenses/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readExpenses();
    let newId = Number(id);
    const filteredData = deleteExpense(data, newId);
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

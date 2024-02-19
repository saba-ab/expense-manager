import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Expense } from "../interfaces/interface.js";
import { write } from "fs";
moment().format();

const filePath = path.join(__dirname, "..", "..", "data", "expenses.json");

export const readExpenses = async (): Promise<Expense[]> => {
  const data = await readFile(filePath, "utf-8");
  const expenses = JSON.parse(data);
  return expenses;
};
export const newExpense = (id: number, name: string, cost: number): Expense => {
  return {
    id,
    name,
    cost,
    createdAt: moment().format(),
  };
};

export const addExpense = async (data: Expense[]) => {
  try {
    const jsonData = JSON.stringify(data);
    const result = await writeFile(filePath, jsonData, "utf-8");
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const findExpense = (data: Expense[], id: number) => {
  return data.find((exp: Expense) => exp.id === Number(id));
};
export const createFile = async (): Promise<Expense[]> => {
  try {
    await writeFile(filePath, JSON.stringify([]), "utf-8");
    return [];
  } catch (err) {
    console.error("Error creating the file:", err);
    throw err;
  }
};

export const deleteExpense = (data: Expense[], id: number) => {
  return {
    data: data.filter((exp: Expense) => exp.id !== Number(id)),
    deleted: data.find((exp: Expense) => exp.id === Number(id)),
  };
};

export const modifyExpense = (
  data: Expense[],
  id: number,
  modifications: Expense
) => {
  return data.map((exp) =>
    exp.id === Number(id)
      ? (exp = {
          ...exp,
          ...modifications,
        })
      : exp
  );
};

const templatePath = path.join(__dirname, "..", "index.html");

export const templateMaker = async (data: any) => {
  let template = await readFile(templatePath, "utf-8");
  template = template.replace("{{%placeholder%}}", data);
  return template;
};

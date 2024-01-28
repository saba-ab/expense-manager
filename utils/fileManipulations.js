import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

moment().format();

const filePath = path.join(__dirname, "..", "data", "expenses.json");

export const readExpenses = async () => {
  const data = await readFile(filePath, "utf-8");
  const expenses = JSON.parse(data);
  return expenses;
};
export const newExpense = (id, name, cost) => {
  return {
    id,
    name,
    cost,
    createdAt: moment().format(),
  };
};

export const addExpense = async (data) => {
  try {
    const jsonData = JSON.stringify(data);
    const result = await writeFile(filePath, jsonData, "utf-8");
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const findExpense = (data, id) => {
  return data.find((exp) => exp.id === Number(id));
};
export const createFile = async () => {
  try {
    await writeFile(filePath, "[]", "utf-8");
    return [];
  } catch (err) {
    console.log(err);
  }
};

export const deleteExpense = (data, id) => {
  return {
    data: data.filter((exp) => exp.id !== Number(id)),
    deleted: data.find((exp) => exp.id === Number(id)),
  };
};

export const modifyExpense = (data, id, modifications) => {
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

export const templateMaker = async (data) => {
  let template = await readFile(templatePath, "utf-8");
  template = template.replace("{{%placeholder%}}", data);
  return template;
};

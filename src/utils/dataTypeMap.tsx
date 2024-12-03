import { DataType } from "ka-table/enums";

export const dataTypeMap: Record<string, any> = {
  Date: DataType.Date,
  Email: "Email",
  MultiSelect: "MultiSelect",
  Number: DataType.Number,
  Phone: "Phone",
  Status: "Status",
  Select: "Select",
  Text: DataType.String,
  // You can easily add more types here in the future
};

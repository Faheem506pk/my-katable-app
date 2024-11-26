
import { DataType } from "ka-table/enums"; // Import the original enum

declare module "ka-table/enums" {
  export enum DataType {
    Email = "Email",  // Add your custom data type here
   
  }
}

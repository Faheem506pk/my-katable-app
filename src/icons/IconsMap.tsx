import { GrTextAlignFull } from "react-icons/gr";
import { MdNumbers, MdOutlineEmail } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { GoSingleSelect, GoTag } from "react-icons/go";
import { TfiShine } from "react-icons/tfi";
import { FaRegIdCard } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import { VscListFlat } from "react-icons/vsc";

export const IconMap: Record<string, JSX.Element> = {
  String: <GrTextAlignFull style={{ marginRight: "5px" }} />,
  Number: <MdNumbers style={{ marginRight: "5px" }} />,
  Date: <BsCalendarDate style={{ marginRight: "5px" }} />,
  Select: <GoSingleSelect style={{ marginRight: "5px" }} />,
  MultiSelect: <GoTag style={{ marginRight: "5px" }} />,
  Status: <TfiShine style={{ marginRight: "5px" }} />,
  cnic: <FaRegIdCard style={{ marginRight: "5px" }} />,
  Phone: <LuPhone style={{ marginRight: "5px" }} />,
  Email: <MdOutlineEmail style={{ marginRight: "5px" }} />,
  default: <VscListFlat style={{ marginRight: "5px" }} />,
};

export const IconMapColumn: Record<string, JSX.Element> = {
  string: <GrTextAlignFull style={{ marginRight: "5px" }} />,
  number: <MdNumbers style={{ marginRight: "5px" }} />,
  date: <BsCalendarDate style={{ marginRight: "5px" }} />,
  Select: <GoSingleSelect style={{ marginRight: "5px" }} />,
  MultiSelect: <GoTag style={{ marginRight: "5px" }} />,
  Status: <TfiShine style={{ marginRight: "5px" }} />,
  cnic: <FaRegIdCard style={{ marginRight: "5px" }} />,
  Phone: <LuPhone style={{ marginRight: "5px" }} />,
  Email: <MdOutlineEmail style={{ marginRight: "5px" }} />,
  default: <VscListFlat style={{ marginRight: "5px" }} />,
};

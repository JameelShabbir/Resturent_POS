import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (name) => {
    if (status === "Booked") return;
    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  return (
    <>
      <div
        onClick={() => handleClick(name)}
        key={id}
        className="w-full sm:w-[300px] h-52 hover:shadow-md hover:bg-[#3a3a3a] bg-[#262626] p-4 rounded-lg cursor-pointer mx-auto"
      >
        <div className="flex items-center justify-between px-1">
          <h1 className="text-[#f5f5f5] font-semibold text-lg sm:text-xl">
            Table{" "}
            <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {name}
          </h1>
          <p
            className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${status === "Booked"
              ? "bg-green-600 text-white"
              : "bg-amber-600 text-black"
              }`}
          >
            {status}
          </p>
        </div>
        <div className="flex items-center justify-center mt-5 mb-8">
          <h1
            className="text-white rounded-full p-4 sm:p-5 text-lg sm:text-xl md:text-2xl"
            style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
          >
            {getAvatarName(initials) || <MdTableRestaurant className="text-red-500" />}
          </h1>
        </div>
        <p className="text-[#ababab] text-xs text-center font-semibold">
          Seats: <span className="text-[#f5f5f5] font-bold">{seats}</span>
        </p>
      </div>
    </>
  );
};

export default TableCard;

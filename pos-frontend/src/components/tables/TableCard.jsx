"use client"
import { useNavigate } from "react-router-dom"
import { getAvatarName, getBgColor } from "../../utils"
import { useDispatch } from "react-redux"
import { updateTable } from "../../redux/slices/customerSlice"
import { MdTableRestaurant } from "react-icons/md"

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = (name) => {
    if (status === "Booked") return
    const table = { tableId: id, tableNo: name }
    dispatch(updateTable({ table }))
    navigate(`/menu`)
  }

  return (
    <div onClick={() => handleClick(name)} key={id} className="w-full h-40 bg-[#262626] rounded-lg cursor-pointer p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-[#f5f5f5] font-medium text-sm">Table {name}</h1>
        <span
          className={`px-2 py-0.5 rounded text-xs ${status === "Booked" ? "bg-green-600/80 text-white" : "bg-amber-600/80 text-white"
            }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-center my-4">
        {initials ? (
          <div
            className="rounded-full flex items-center justify-center w-12 h-12 text-white text-base font-medium"
            style={{ backgroundColor: getBgColor() }}
          >
            {getAvatarName(initials)}
          </div>
        ) : (
          <div className="rounded-full flex items-center justify-center w-12 h-12 bg-[#1f1f1f]">
            <MdTableRestaurant className="text-red-500 text-xl" />
          </div>
        )}
      </div>

      <div className="text-[#9b9b9b] text-xs text-center">
        Seats: <span className="text-[#f5f5f5]">{seats}</span>
      </div>
    </div>
  )
}

export default TableCard


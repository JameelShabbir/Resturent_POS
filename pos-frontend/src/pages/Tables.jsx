"use client"

import React, { useState, useEffect } from "react"
import BottomNav from "../components/shared/BottomNav"
import BackButton from "../components/shared/BackButton"
import TableCard from "../components/tables/TableCard"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getTables } from "../https"
import { useSnackbar } from "notistack"

const Tables = () => {
  const [status, setStatus] = useState("all")
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    document.title = "POS | Tables"
  }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables()
    },
    placeholderData: keepPreviousData,
  })

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  const filteredTables = React.useMemo(() => {
    if (!resData?.data?.data) return []

    if (status === "all") {
      return resData.data.data
    } else if (status === "booked") {
      return resData.data.data.filter((table) => table.status === "Booked")
    } else if (status === "available") {
      return resData.data.data.filter((table) => table.status === "Available")
    }

    return resData.data.data
  }, [resData, status])

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wider">Tables</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-base ${status === "all" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-base ${status === "booked" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            Booked
          </button>
          <button
            onClick={() => setStatus("available")}
            className={`text-[#ababab] text-base ${status === "available" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            Available
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-4 md:px-6 lg:px-8 py-2 h-[calc(100vh-10rem)] overflow-y-scroll scrollbar-hide">
        {filteredTables.map((table) => (
          <TableCard
            key={table._id}
            id={table._id}
            name={table.tableNo}
            status={table.status}
            initials={table?.currentOrder?.customerDetails.name}
            seats={table.seats}
          />
        ))}
      </div>

      <BottomNav />
    </section>
  )
}

export default Tables


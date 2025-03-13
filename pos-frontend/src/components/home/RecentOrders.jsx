"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import OrderList from "./OrderList"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack"
import { getOrders } from "../../https/index"

const RecentOrders = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders()
    },
    placeholderData: keepPreviousData,
  })

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  // Filter orders based on search term
  const filteredOrders = React.useMemo(() => {
    if (!resData?.data?.data) return []

    if (!searchTerm.trim()) return resData.data.data

    const term = searchTerm.toLowerCase()
    return resData.data.data.filter(
      (order) =>
        order.customerDetails.name.toLowerCase().includes(term) ||
        order.table.tableNo.toString().includes(term) ||
        order.orderStatus.toLowerCase().includes(term),
    )
  }, [resData, searchTerm])

  const handleViewAll = (e) => {
    e.preventDefault()
    navigate("/orders")
  }

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">Recent Orders</h1>
          <a href="/orders" className="text-[#025cca] text-sm font-semibold" onClick={handleViewAll}>
            View all
          </a>
        </div>

        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Order list */}
        <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderList key={order._id} order={order} />
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No orders found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentOrders


"use client"

import React, { useEffect } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import BottomNav from "../components/shared/BottomNav"
import Greetings from "../components/home/Greetings"
import { BsCashCoin } from "react-icons/bs"
import { GrInProgress } from "react-icons/gr"
import MiniCard from "../components/home/MiniCard"
import RecentOrders from "../components/home/RecentOrders"
import PopularDishes from "../components/home/PopularDishes"
import { getOrders } from "../https"

const Home = () => {
  useEffect(() => {
    document.title = "POS | Home"
  }, [])

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders()
    },
    placeholderData: keepPreviousData,
  })

  // Calculate total earnings
  const totalEarnings = React.useMemo(() => {
    if (!resData?.data?.data) return 0

    return resData.data.data.reduce((total, order) => {
      return total + (order.bills?.totalWithTax || 0)
    }, 0)
  }, [resData])

  // Count in-progress orders
  const inProgressCount = React.useMemo(() => {
    if (!resData?.data?.data) return 0

    return resData.data.data.filter((order) => order.orderStatus === "In Progress").length
  }, [resData])

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
      {/* Left Div */}
      <div className="flex-[3]">
        <Greetings />
        <div className="flex items-center w-full gap-3 px-8 mt-8">
          <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={Math.round(totalEarnings)} footerNum={1.6} />
          <MiniCard title="In Progress" icon={<GrInProgress />} number={inProgressCount} footerNum={3.6} />
        </div>
        <RecentOrders />
      </div>
      {/* Right Div */}
      <div className="flex-[2]">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  )
}

export default Home


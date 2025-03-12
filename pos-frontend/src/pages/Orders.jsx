import React, { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import BackButton from "../components/shared/BackButton";
import OrderCard from "../components/orders/OrderCard";
import { getOrders } from "../https";
import BottomNav from "../components/shared/BottomNav";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    document.title = "POS | Orders"
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  const filteredOrders = React.useMemo(() => {
    if (!resData?.data?.data) return [];

    switch (status) {
      case "in-progress":
        return resData.data.data.filter(order => order.orderStatus === "In Progress");
      case "ready":
        return resData.data.data.filter(order => order.orderStatus === "Ready");
      case "completed":
        return resData.data.data.filter(order => order.orderStatus === "Completed");
      default:
        return resData.data.data;
    }
  }, [resData, status]);

  return (
    <section className="bg-[#1f1f1f] min-h-screen">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wider">
            Orders
          </h1>
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
            onClick={() => setStatus("in-progress")}
            className={`text-[#ababab] text-base ${status === "in-progress" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatus("ready")}
            className={`text-[#ababab] text-base ${status === "ready" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            Ready
          </button>
          <button
            onClick={() => setStatus("completed")}
            className={`text-[#ababab] text-base ${status === "completed" && "bg-[#383838]"
              } rounded-lg px-4 py-1.5 font-medium`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
      <BottomNav />
    </section>
  );
};

export default Orders;

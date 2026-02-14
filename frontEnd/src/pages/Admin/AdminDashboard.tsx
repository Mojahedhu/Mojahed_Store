import Chart from "react-apexcharts";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/features/order/orderApiSlice";
import { useGetUsersQuery } from "../../redux/features/users/usersApi";
import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { AdminMenu } from "./AdminMenu";
import { Loader } from "../../components/Loader";
import { OrderList } from "./OrderList";

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetails } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState<{
    options: ApexOptions;
    series: ApexAxisChartSeries;
  }>({
    options: {
      chart: {
        type: "bar",
        foreColor: "white",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#553fda"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Report",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        title: {
          text: "Date",
        },

        axisBorder: {
          color: "white",
        },
      },

      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetails) {
      const formattedSales = salesDetails.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            categories: formattedSales.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSales.map((item) => Number(item.y)) },
        ],
      }));
    }
  }, [salesDetails]);

  return (
    <>
      <title>Mojahed Store - Dashboard</title>
      <AdminMenu />
      <section className="xl:ml-16 md:ml-0">
        <div className="mx-auto">
          <div className="w-[80%] flex justify-around flex-wrap">
            <div className="rounded-lg bg-black p-5 w-80 mt-5 place-items-center">
              <div className="font-bold rounded-full w-12 bg-pink-500 text-center p-3">
                $
              </div>
              <p>Sales</p>
              <h1 className="text-2xl font-bold">
                ${" "}
                {salesLoading ? (
                  <Loader />
                ) : (
                  sales?.totalSales.map((item) => item.totalSales.toFixed(2))
                )}
              </h1>
            </div>
            <div className="rounded-lg bg-black p-5 w-80 mt-5 place-items-center">
              <div className="font-bold rounded-full w-12 bg-pink-500 text-center p-3">
                $
              </div>
              <p>Customers</p>
              <h1 className="text-2xl font-bold">
                🔷 {customersLoading ? <Loader /> : customers?.length}
              </h1>
            </div>
            <div className="rounded-lg bg-black p-5 w-80 mt-5 place-items-center">
              <div className="font-bold rounded-full w-12 bg-pink-500 text-center p-3">
                $
              </div>
              <p>All Orders</p>
              <h1 className="text-2xl font-bold">
                🔷 {ordersLoading ? <Loader /> : orders?.totalOrdersCount}
              </h1>
            </div>
          </div>
        </div>
        <div className="ml-40 mt-16">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width={"70%"}
            height={300}
          />
        </div>

        <div className="my-16 w-[95%]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export { AdminDashboard };

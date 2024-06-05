
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import {categories} from "../../../assets/data.json";
import { useSelector } from "react-redux";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { usePieQuery } from "../../../redux/api/dashboardApi";
import { Skeleton } from "../../../components/loader";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const PieCharts = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialTypes }) => state.userReducer
  );
  const { data, isLoading, isError } = usePieQuery(user?._id!);

  const charts = data?.charts!;

  const revenue = data?.charts.revenueDistribution!;
  const orders = data?.charts.orderFullfillment!;
  const ages = data?.charts.ageDistribution!;

  if (isError) return <Navigate to={"/admin/dashboard"}/>

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[orders.processing, orders.shipped, orders.delivered]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={charts.productcategories.map((i) => Object.keys(i)[0])}
                  data={charts.productcategories.map((i) => Object.values(i)[0])}
                  backgroundColor={categories.map(
                    (i) => `hsl(${Math.random() * 4}, ${Object.values(i)[0]}%, 50%)`
                  )}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[charts.stockAvailability.inStock, charts.stockAvailability.outOfStock]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2> Stock Availability</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[revenue.marketingCost, revenue.discount, revenue.burnt, revenue.productionCost,revenue.netMargin]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            <section>
              <div>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[ages.teen, ages.adult, ages.old]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[charts.adminCustomer.admin, charts.adminCustomer.customer]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;

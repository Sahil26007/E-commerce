import { useSelector } from "react-redux";

import { LineChart } from "../../../components/admin/Charts";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { useLineQuery } from "../../../redux/api/dashboardApi";
import { customError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/loader";
import { getLastMonths } from "../../../utils/features";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const { last12Months:months } = getLastMonths()

const Linecharts = () => {

    const {user} = useSelector(
      (state:{userReducer:userReducerInitialTypes}) => state.userReducer
    )

    const {data,isLoading,error,isError} = useLineQuery(user?._id!)

    const userCount = data?.charts.user || []
    const productCount = data?.charts.product || []
    const revenueCount = data?.charts.revenue || []
    const discount = data?.charts.discount || []

    if(isError){
      const err = error as customError
      toast.error(err.data.message)
    }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        {
          isLoading? <Skeleton/> : <>
                  <section>
          <LineChart
            data={ userCount}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={months}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={productCount}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={months}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={revenueCount}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={months}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={months}
          />
          <h2>Discount Allotted </h2>
        </section>
          </>
        }
      </main>
    </div>
  );
};

export default Linecharts;

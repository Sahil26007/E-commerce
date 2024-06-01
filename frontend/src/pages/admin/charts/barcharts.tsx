import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { getLastMonths } from "../../../utils/features";
import { userReducerInitialTypes } from "../../../types/reducer-types";
import { useBarQuery } from "../../../redux/api/dashboardApi";
import { customError } from "../../../types/api-types";
import toast from "react-hot-toast";

const { last12Months: months , last6Months :months6} = getLastMonths()

const Barcharts = () => {

  const {user} = useSelector(
    (state:{userReducer:userReducerInitialTypes}) => state.userReducer
  )
  console.log(user)
  const {data,isLoading,error,isError} = useBarQuery(user?._id!)

  const userArr = data?.charts.user || []
  const products = data?.charts.product || []
  const orders = data?.charts.order || []

  if(isError){
    const err = error as customError
    toast.error(err.data.message)
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {
          isLoading ? <h1>Loading...</h1> : <>
                  <section>
          <BarChart
            data_2={userArr}
            data_1={products}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
            labels={months6}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={orders}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={months}
          />
          <h2>Orders throughout the year</h2>
        </section>
          </>
        }
      </main>
    </div>
  );
};

export default Barcharts;

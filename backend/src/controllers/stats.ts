import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Products } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};

    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats") as string);
    else {
        let today = new Date();

        let sixMonth = new Date();
        sixMonth.setMonth(today.getMonth() - 6);

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        }

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        }

        const thisMonthOrderPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

        const lastMonthOrderPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        });

        const thisMonthProductPromise = Products.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

        const lastMonthProductPromise = Products.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        });

        const thisMonthUserPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

        const lastMonthUserPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        });

        const lastSixMonthOrderPromise = Order.find({
            createdAt: {
                $gte: sixMonth,
                $lte: today,
            }
        });

        const latestTransactionPromise = Order.find({}).select(["orderList","discount","total","status"]).limit(4);

        const [thisMonthOrder,
            thisMonthProduct,
            thisMonthUser,
            lastMonthProduct,
            lastMonthOrder,
            lastMonthUser,
            productsCount,
            usersCount,
            allOrders,
            lastSixMonthOrder,
            categories,
            femaleCount,
            latestTransaction
        ] =
            await Promise.all([
                thisMonthOrderPromise,
                thisMonthProductPromise,
                thisMonthUserPromise,
                lastMonthProductPromise,
                lastMonthOrderPromise,
                lastMonthUserPromise,

                Products.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),

                lastSixMonthOrderPromise,
                Products.distinct("category"),
                User.countDocuments({gender:"female"}),
                latestTransactionPromise,
            ])

            const thisMonthRevenue = thisMonthOrder.reduce( (total,order)=> total + (order.total || 0),0);
            const lastMonthRevenue = lastMonthOrder.reduce( (total,order)=> total + (order.total || 0),0);

            const percentageChange = {
                
                revenue : calculatePercentage(thisMonthRevenue,lastMonthRevenue),
                user : calculatePercentage(thisMonthUser.length, lastMonthUser.length),
                order : calculatePercentage(thisMonthOrder.length, lastMonthOrder.length),
                product : calculatePercentage(thisMonthProduct.length, lastMonthProduct.length),
            }

            const revenue = allOrders.reduce( (total,order)=> total + (order.total || 0) , 0 );

            const count = {
              
                revenue,
                user:usersCount,
                order:allOrders.length,
                product:productsCount,

            }

            const orderMonthCounts = new Array(6).fill(0);
            const orderMonthyRevenue = new Array(6).fill(0);

            lastSixMonthOrder.forEach((order) =>{
                const creationDate = order.createdAt;

                const monthDiff = today.getMonth() - creationDate.getMonth();

                if(monthDiff < 6){
                    orderMonthCounts[6 - monthDiff - 1] +=1;
                    orderMonthyRevenue[6 - monthDiff - 1] += order.total ;
                }
            });


            const userRatio = {
                male : usersCount - femaleCount,
                female : femaleCount
            }

            const modifiedLatestTranscation = latestTransaction.map((i)=>{
                _id : i._id;
                discount : i.discount;
                total : i.total;
                status : i.status;
                quantity : i.orderList.length;
            })

            stats={
                categories,
                percentageChange,
                count,
                chart:{
                    order: orderMonthCounts,
                    revenue: orderMonthyRevenue,
                },
                userRatio,
                latestTransaction:modifiedLatestTranscation,
            };
    }

    res.status(200).json({
        success: true,
        stats,
    });

    myCache.set("admin-stats",JSON.stringify(stats));
});











export const getLineStats = TryCatch(async (req, res, next) => {

});


export const getPieStats = TryCatch(async (req, res, next) => {

});


export const getBarStats = TryCatch(async (req, res, next) => {

});
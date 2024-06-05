// Imports
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Products } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, func1, getInventories } from "../utils/features.js";

// Interfaces
interface OrderType {
    _id: string;
    createdAt: Date;
    orderList: any[];
    discount: number;
    amount: number;
    status: string;
}

interface UserType {
    dob: Date;
    createdAt: Date;
    gender: string;
}

interface ProductType {
    createdAt: Date;
    category: string;
    stock: number;
}

interface StatsType {
    categoryCount?: Record<string, number>[];
    percentageChange?: {
        revenue: number;
        user: number;
        order: number;
        product: number;
    };
    count?: {
        revenue: number;
        user: number;
        order: number;
        product: number;
    };
    chart?: {
        order: number[];
        revenue: number[];
    };
    userRatio?: {
        male: number;
        female: number;
    };
    latestTransaction?: any[];
}

interface ChartsType {
    orderFullfillment?: {
        processing: number;
        shipped: number;
        delivered: number;
    };
    productCategories?: Record<string, number>[];
    stockAvailability?: {
        inStock: number;
        outOfStock: number;
    };
    revenueDistribution?: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingCost: number;
    };
    ageDistribution?: {
        teen: number;
        adult: number;
        old: number;
    };
    adminCustomer?: {
        admin: number;
        customer: number;
    };
    user?: number[];
    product?: number[];
    order?: number[];
    revenue?: number[];
    discount?: number[];
}

// Functions
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats: StatsType = {};

    if (myCache.has("admin-stats")) {
        stats = JSON.parse(myCache.get("admin-stats") as string);
    } else {
        let today = new Date();
        let sixMonth = new Date();
        sixMonth.setMonth(today.getMonth() - 6);

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };

        // Promises for fetching data
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
            },
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
            },
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
            },
        });

        const lastSixMonthOrderPromise = Order.find({
            createdAt: {
                $gte: sixMonth,
                $lte: today,
            },
        });

        const latestTransactionPromise = Order.find({}).select(["orderList", "discount", "amount", "status"]).limit(4);

        // Awaiting all promises
        const [
            thisMonthOrder,
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
            latestTransaction,
        ] = await Promise.all([
            thisMonthOrderPromise,
            thisMonthProductPromise,
            thisMonthUserPromise,
            lastMonthProductPromise,
            lastMonthOrderPromise,
            lastMonthUserPromise,
            Products.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("amount"),
            lastSixMonthOrderPromise,
            Products.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionPromise,
        ]);

        const thisMonthRevenue = thisMonthOrder.reduce((amount, order) => amount + (order.amount || 0), 0);
        const lastMonthRevenue = lastMonthOrder.reduce((amount, order) => amount + (order.amount || 0), 0);

        const percentageChange = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
            order: calculatePercentage(thisMonthOrder.length, lastMonthOrder.length),
            product: calculatePercentage(thisMonthProduct.length, lastMonthProduct.length),
        };

        const revenue = allOrders.reduce((amount, order) => amount + (order.amount || 0), 0);

        const count = {
            revenue,
            user: usersCount,
            order: allOrders.length,
            product: productsCount,
        };

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);

        lastSixMonthOrder.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth()) % 12;

            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += order.amount;
            }
        });

        const categoryCount: Record<string, number>[] = await getInventories({
            categories,
            productsCount,
        });

        const userRatio = {
            male: usersCount - femaleCount,
            female: femaleCount,
        };

        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.amount,
            status: i.status,
            quantity: i.orderList.length,
        }));

        stats = {
            categoryCount,
            percentageChange,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue,
            },
            userRatio,
            latestTransaction: modifiedLatestTransaction,
        };

        myCache.set("admin-stats", JSON.stringify(stats));
    }

    res.status(200).json({
        success: true,
        stats,
    });
});

// Line Chart Stats Function
export const getLineStats = TryCatch(async (req, res, next) => {
    let charts: ChartsType;

    let key = "admin-line-charts";

    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key) as string);
    } else {
        const today = new Date();
        const twelveMonth = new Date();
        twelveMonth.setMonth(twelveMonth.getMonth() - 12);

        const baseQuery = {
            createdAt: {
                $gte: twelveMonth,
                $lte: today,
            },
        };

        const twelveMonthUserPromise = User.find(baseQuery).select("createdAt");
        const twelveMonthProductPromise = Products.find(baseQuery).select("createdAt");
        const twelveMonthOrderPromise = Order.find(baseQuery).select(["createdAt", "amount", "discount"]);

        const [user, product, order] = await Promise.all([
            twelveMonthUserPromise, twelveMonthProductPromise, twelveMonthOrderPromise
        ]);

        const userCount = func1({ length: 12, docArr: user, today });
        const productCount = func1({ length: 12, docArr: product, today });
        const discount = func1({
            length: 12,
            docArr: order,
            property: "discount",
            today
        });

        const revenue = func1({
            length: 12,
            docArr: order,
            property: "amount",
            today
        });

        charts = {
            user: userCount,
            product: productCount,
            discount,
            revenue
        };
        myCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts
    });
});

// Pie Chart Stats Function
export const getPieStats = TryCatch(async (req, res, next) => {
    let charts: ChartsType;

    if (myCache.has("admin-pie-chart")) {
        charts = JSON.parse(myCache.get("admin-pie-chart") as string);
    } else {
        const allOrderPromise = Order.find({}).select(["subamount", "discount", "tax"]);
        
        // Promise to fetch required data
        const [
            processingOrder,
            shippedOrder,
            deliveredOrder,
            categoryArr,
            stockArr,
            allOrder,
            femaleUser,
            usersCount,
            allUser
        ] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Products.distinct("category"),
            Products.find({}).select(["category", "stock"]),
            allOrderPromise,
            User.countDocuments({ gender: "female" }),
            User.countDocuments(),
            User.find({}).select("dob")
        ]);

        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder
        };

        const productCategories = categoryArr.map((cat) => ({
            [cat]: stockArr.filter((i) => i.category === cat).length
        }));

        const stockAvailability = stockArr.reduce(
            (acc, item) => {
                if (item.stock <= 0) acc.outOfStock += 1;
                else acc.inStock += 1;
                return acc;
            },
            { inStock: 0, outOfStock: 0 }
        );

        const revenueDistribution = {
            netMargin: allOrder.reduce((acc, item) => acc + item.subtotal, 0),
            discount: allOrder.reduce((acc, item) => acc + item.discount, 0),
            productionCost: allOrder.reduce(
                (acc, item) => acc + item.subtotal * 0.4,
                0
            ),
            burnt: allOrder.reduce((acc, item) => acc + item.tax, 0),
            marketingCost: allOrder.reduce(
                (acc, item) => acc + item.subtotal * 0.1,
                0
            )
        };

        const ageDistribution = {
            teen: allUser.filter(
                (user) =>
                    new Date().getFullYear() - user.dob.getFullYear() < 20
            ).length,
            adult: allUser.filter(
                (user) =>
                    new Date().getFullYear() - user.dob.getFullYear() > 20 &&
                    new Date().getFullYear() - user.dob.getFullYear() < 60
            ).length,
            old: allUser.filter(
                (user) =>
                    new Date().getFullYear() - user.dob.getFullYear() > 60
            ).length
        };

        const adminCustomer = {
            admin: 1,
            customer: usersCount
        };

        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            ageDistribution,
            adminCustomer
        };

        myCache.set("admin-pie-chart", JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts
    });
});

// Bar Chart Stats Function
export const getBarStats = TryCatch(async (req, res, next) => {
    let charts: ChartsType;

    let key = "admin-bar-charts";

    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key) as string);
    } else {
        const today = new Date();
        const sixMonth = new Date();
        sixMonth.setMonth(sixMonth.getMonth() - 6);

        const twelveMonth = new Date();
        twelveMonth.setMonth(twelveMonth.getMonth() - 12);

        const twelveMonthOrderPromise = Order.find({
            createdAt: {
                $gte: twelveMonth,
                $lte: today
            },
        }).select("createdAt");

        const sixMonthProductPromise = Products.find({
            createdAt: {
                $gte: sixMonth,
                $lte: today
            },
        }).select("createdAt");

        const sixMonthUserPromise = User.find({
            createdAt: {
                $gte: sixMonth,
                $lte: today
            },
        }).select("createdAt");

        const [orders, products, users] = await Promise.all([
            twelveMonthOrderPromise,
            sixMonthProductPromise,
            sixMonthUserPromise
        ]);

        const orderCounts = func1({ length: 12, docArr: orders, today });
        const productCounts = func1({ length: 6, docArr: products, today });
        const userCounts = func1({ length: 6, docArr: users, today });

        charts = {
            user: userCounts,
            product: productCounts,
            order: orderCounts
        };

        myCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts
    });
});

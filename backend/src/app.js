import "dotenv/config";

import express from "express"
const PORT = process.env.PORT || 3000
import { connection } from "./connection/connection.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { handleWebhook } from "./controllers/payment.controller.js"

import { syncRegistry } from "./services/registry.service.js"

const app = express()
app.set("trust proxy", 1)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
        const reqOrigin = origin.replace(/\/$/, "");
        
        if (!clientUrl || reqOrigin === clientUrl || reqOrigin.includes("localhost") || reqOrigin.includes("vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}))


app.post("/api/v1/payment/webhook", express.raw({ type: 'application/json' }), handleWebhook)
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(express.static("uploads"))
app.use("/uploads", express.static("uploads"), (req, res) => res.status(404).send("Image not found"))
app.use("/api/v1/uploads", express.static("uploads"), (req, res) => res.status(404).send("Image not found"))
app.use(cookieParser())

const connect = async () => {
    await connection()
    await syncRegistry()

    app.listen(PORT, () => {
        console.log("server is listening on PORT: ", PORT)
    })
}
connect()

//routes
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import authRouter from "./routes/auth.route.js"
import favouriteRouter from "./routes/favourite.route.js"
import paymentRouter from "./routes/payment.route.js"
import dynamicRoutes from './routes/dynamic.route.js'
import registryRoutes from './routes/registry.route.js'
import { verifyJWT } from "./middlewares/auth.js"

//non auth
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/carts", cartRouter)
//partially auth
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/registry", registryRoutes)
app.use("/api/v1/admin", dynamicRoutes)

//auth routes
app.use("/api/v1/users", verifyJWT, userRouter)
app.use("/api/v1/orders", verifyJWT, orderRouter)
app.use("/api/v1/dashboard", verifyJWT, dashboardRouter)
app.use("/api/v1/favourites", verifyJWT, favouriteRouter)
app.use("/api/v1/payment", verifyJWT, paymentRouter)

import FoodsRouter from "./router";
import * as express from "express";
import * as compression from "compression";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as cors from "cors";

export default class App {
    public app: express.Application;

    constructor(private foodsRouter: FoodsRouter) {
        this.app = express();
        this.initMiddleware();
        this.initRoutes();
    }

    private initMiddleware() {
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(helmet());
        this.app.use(
            helmet.hsts({
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            })
        );
        this.app.use(helmet.frameguard());
    }

    private initRoutes(): void {
        this.app.use("/api", this.foodsRouter.router);
    }
}

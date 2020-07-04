import FoodRouter from "./routes/foodRouter"
import * as express from "express"
import * as compression from "compression"
import * as helmet from "helmet"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import UserRouter from "./routes/userRouter"
import * as passport from "passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { UserSchema } from "../app/schemas/user.schema"

export default class App {
    public app: express.Application

    constructor(private userRouter: UserRouter, private foodRouter: FoodRouter) {
        this.app = express()
        this.initMiddleware()
        this.initRoutes()
    }

    private initMiddleware() {
        this.app.use(cors())
        this.app.use(compression())
        this.app.use(bodyParser.json({ limit: "50mb", type: "application/json" }))
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
        this.app.use(helmet())
        this.app.use(
            helmet.hsts({
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            })
        );
        this.app.use(helmet.frameguard())

        passport.use(
            new Strategy({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: "secret"
                }, (jwtToken, done) => {
                    UserSchema.findOne({ username: jwtToken.username}, (err, user) => {
                        if (err) {
                            return done(err, false)
                        }
                        if (user) {
                            done(undefined, user)
                        } else {
                            done(undefined, false)
                        }
                    });
                }
            )
        )
    }

    private initRoutes(): void {
        this.app.use("/api/foods", this.foodRouter.router)
        this.app.use("/api", this.userRouter.router)
    }
}

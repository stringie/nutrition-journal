import * as http from "http";
import * as mongoose from "mongoose";
import * as express from "express";
import App from "./app";
import FoodsRouter from "./router";
import Scraper from "../app/services/scraping.service";

export default class Server {

    private app: express.Application;

    public async run() {
        this.initDB();
        await this.initServer();
    }

    private async initDB(): Promise<void> {
        await mongoose.connect("mongodb://admin:admin@mongo:27017/whf?authSource=admin", { useNewUrlParser: true } , err => {
            if (err) {
                throw err;
            }
            console.log("Mongo connected");
        });
    }

    private async initServer() {
        const scraper = new Scraper();
        await scraper.initBrowser();

        const foodsRouter = new FoodsRouter(scraper);

        this.app = new App(foodsRouter).app;
        this.app.set("port", 3000);
        
        const server = http.createServer(this.app);

        server.listen(3000);
        server.on("listening", this.onListening);
        server.on("error", this.onError);
    }

    private onError(error: NodeJS.ErrnoException): void {
        console.log(error);
    }
    
    private onListening(): void {
        console.log("Listening....");
    }
}
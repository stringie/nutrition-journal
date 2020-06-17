import * as puppeteer from 'puppeteer';
import * as $ from "cheerio";

export default class Scraper {
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private html: string;

    public async initBrowser() {
        this.browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        this.page = await this.browser.newPage();
    }

    public async load(url: string) {
        await this.page.goto(url, { waitUntil: "networkidle0" })
        this.html = await this.page.evaluate(() => {
            return document.body.innerHTML;
        });
    }

    public async getNutritionTable() {
        const table = new Map<String, { value: Number, dv: Number }>();

        const tableHtml = $("table", this.html).last();
        $("tr", tableHtml).each((i: number, el: CheerioElement) => {
            const values = $("td", el).toArray();
            
            const nutrient = $(values[0]).text();
            const value = Number($(values[1]).text().split(" ")[0]);
            const dv = Number($(values[2]).text());

            if (dv && value && nutrient) {
                table.set(nutrient, { value: value, dv: dv })
            }
        });

        return table;
    }
}
const fs = require("fs");
const puppeteer = require("puppeteer");

const url =
    "https://www.facebook.com/marketplace/103432163030646/search/?query=motorcycle&exact=false";

// entry function
async function init() {
    console.log("Start scraping...");
    console.log("Give me some minute...");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector(
        "div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.j83agx80.buofh1pr.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.cbu4d94t.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.g5gj957u.j83agx80.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5"
    );

    await page.setViewport({
        width: 1200,
        height: 800,
    });

    // call autoScroll
    await autoScroll(page);

    const finalOutput = await page.$$eval(
        "div > div > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.j83agx80.buofh1pr.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.cbu4d94t.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.g5gj957u.j83agx80.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5 > div",
        (anchors) => {
            let scrappedData = anchors
                .map((el) => {
                    // motorcycle type
                    let type = el.querySelector(
                        "span.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7"
                    )
                        ? el.querySelector(
                              "span.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7"
                          ).textContent
                        : "";

                    // original price before discount
                    let originalPrice = el.querySelector(
                        "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.b0tq1wua.a8c37x1j.fe6kdd0r.mau55g9w.c8b282yb.keod5gw0.nxhoafnm.aigsh9s9.tia6h79c.hrzyx87i.a5q79mjw.g1cxx5fr.ekzkrbhg.m9osqain"
                    )
                        ? el.querySelector(
                              "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.b0tq1wua.a8c37x1j.fe6kdd0r.mau55g9w.c8b282yb.keod5gw0.nxhoafnm.aigsh9s9.tia6h79c.hrzyx87i.a5q79mjw.g1cxx5fr.ekzkrbhg.m9osqain"
                          ).textContent
                        : "";

                    let distanceAndLocationArray = el.querySelector(
                        "span.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5"
                    )
                        ? Array.from(
                              el.querySelectorAll(
                                  "span.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5"
                              )
                          ).map((el) => el.textContent)
                        : "";

                    if (
                        el.querySelector(
                            "img.idiwt2bm.bixrwtb6.ni8dbmo4.stjgntxs.k4urcfbm"
                        ) &&
                        el.querySelector(
                            "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.b0tq1wua.a8c37x1j.fe6kdd0r.mau55g9w.c8b282yb.keod5gw0.nxhoafnm.aigsh9s9.tia6h79c.iv3no6db.a5q79mjw.g1cxx5fr.lrazzd5p.oo9gr5id"
                        )
                    ) {
                        return {
                            type,
                            price: el.querySelector(
                                "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.b0tq1wua.a8c37x1j.fe6kdd0r.mau55g9w.c8b282yb.keod5gw0.nxhoafnm.aigsh9s9.tia6h79c.iv3no6db.a5q79mjw.g1cxx5fr.lrazzd5p.oo9gr5id"
                            ).textContent,
                            originalPrice,
                            location: distanceAndLocationArray[0],
                            distance: distanceAndLocationArray[1],
                            url: el.querySelector(
                                "img.idiwt2bm.bixrwtb6.ni8dbmo4.stjgntxs.k4urcfbm"
                            ).src,
                        };
                    }
                })
                .filter((el) => !!el); // remove null entries
            return scrappedData;
        }
    );

    // stringify
    const jsonContent = JSON.stringify(finalOutput);

    // save to file
    fs.writeFile("data.json", jsonContent, "utf-8", (err) => {
        if (err) {
            console.log(err);
        }
        console.log("File saved!");
    });
    console.log("Complete scraping!");

    await browser.close();
}

// auto scroll
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

init();

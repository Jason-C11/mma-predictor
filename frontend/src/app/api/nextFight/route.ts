import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // UFC events page
    await page.goto("https://www.ufc.com/events", { waitUntil: "domcontentloaded" });

    // Get upcoming "View Fight Card" URL
    const eventURL = await page.$eval("a.e-button--white", (el: any) => el.href).catch(() => null);
    if (!eventURL) throw new Error("Event link not found");

    // Get event title & date from listing page
    const eventTitle = await page.$eval("h3.c-card-event--result__headline a", (el: any) =>
      el.textContent?.trim() || "Unknown Event"
    );

    const eventDate = await page.$eval("div.c-card-event--result__date a", (el: any) =>
      el.textContent?.trim() || "Unknown Date"
    );

    // Get banner images
    const bannerImages = await page.$$eval("div.c-hero__image picture", (pictures: any[]) =>
      pictures.map(pic => {
        const sources = Array.from(pic.querySelectorAll("source"))
          .map((src: any) => src.srcset)
          .filter(Boolean);
        const img = pic.querySelector("img")?.src || null;
        return { sources, img };
      })
    ).catch(() => []);

    // Go to event page to get main event info
    await page.goto(eventURL, { waitUntil: "domcontentloaded" });

    const mainFight = await page.$(".c-listing-fight");
    if (!mainFight) throw new Error("Main fight not found");

    // Extract first main event fighter name
    const redFighter = await mainFight.$eval(
      ".c-listing-fight__corner-name--red",
      (el: any) =>
        Array.from(el.querySelectorAll(".c-listing-fight__corner-given-name, .c-listing-fight__corner-family-name"))
          .map((x: any) => x.textContent?.trim() || "")
          .join(" ")
    ).catch(() => "Unknown Fighter");

    // Extract second main event fighter name
    const blueFighter = await mainFight.$eval(
      ".c-listing-fight__corner-name--blue",
      (el: any) =>
        Array.from(el.querySelectorAll(".c-listing-fight__corner-given-name, .c-listing-fight__corner-family-name"))
          .map((x: any) => x.textContent?.trim() || "")
          .join(" ")
    ).catch(() => "Unknown Fighter");

    return NextResponse.json({
      eventTitle,
      eventDate,
      fighter1: redFighter,
      fighter2: blueFighter,
      eventURL,
      bannerImages,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await browser.close();
  }
}

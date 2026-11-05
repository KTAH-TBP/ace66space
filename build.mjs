import { expandedGuides } from "./expanded-guides.mjs";
import { guideDetails, guideSections } from "./guide-details.mjs";
import fs from "node:fs";
import path from "node:path";
import { guides, support } from "./content.mjs";

const origin = "https://ace66.space";
const pages = ["", ...guides.map(g => g[0]), ...support.map(s => s[0])];
const url = slug => slug ? "/" + slug + "/" : "/";
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const link = (slug, name) => '<a href="' + url(slug) + '">' + esc(name) + '</a>';
const links = rows => '<ul>' + rows.map(([slug, name]) => '<li>' + link(slug, name) + '</li>').join("") + '</ul>';
const p = s => '<p>' + esc(s) + '</p>';
const img = file => '<img' + (/banner|banners/.test(file) ? ' class="hero-landscape"' : '') + ' src="/image/' + file + '" alt="" decoding="async">';
const section = (heading, body) => '<section><h2>' + esc(heading) + '</h2><div class="section-answer">' + body + '</div></section>';
const actions = () => '<div class="space-actions">' + link("register", "Sign Up") + link("login", "Log In") + '</div>';
const faq = (q, a) => '<details><summary>' + esc(q) + '</summary><div class="faq-answer">' + p(a) + '</div></details>';
const general = faq("Where should I start?", "Open Table Games to compare the four casino games, or Football to read about match markets.") +
  faq("Are table rules always the same?", "Check the rules and payout chart for the table you choose.");

function renderGuide(g, title) {
  const [slug, name, , image, intro, , rules, example, question, answer] = g;
  const topic = "ACE66 " + name;
  const expansion = expandedGuides[slug];
  const [definition, firstConcept, secondConcept, check, strategy, strategyAnswer] = guideSections[slug];
  const [ruleDetails, workedExample] = guideDetails[slug];
  const related = guides.filter(row => row[0] !== slug && (slug === "football" || row[0] !== "football"));
  const card = (heading, body) => '<div class="guide-card"><h3>' + esc(heading) + '</h3>' + body + '</div>';
  const steps = [
    ["Visit the Registration Page", link("register", "Open the registration guide") + " and follow the account instructions."],
    ["Log In to Your Account", link("login", "Open the login guide") + " and sign in once your account is ready."],
    ["Review Deposit Options", "Check the cashier for available methods, limits and fees before transferring funds."],
    ["Find " + name, slug === "blackjack" ? "Open Casino and choose Blackjack. Compare the minimum stake, blackjack payout and dealer soft-17 rule before choosing a table." : "Find your chosen option in the ACE66 menu, then " + check + "."],
    ["Review the Rules and Set a Limit", "Before making a selection, " + check + ". Set your spending and time limits."]
  ];
  const stepList = '<ol class="guide-steps">' + steps.map(([heading, body]) =>
    '<li><h3>' + esc(heading) + '</h3><p>' + body + '</p></li>').join("") + '</ol>';
  return '<div class="space-hero"><div><h1>' + esc(title) + '</h1>' + p("At ACE66, you can enjoy online " + name + " with clear rules, a smooth mobile interface, and easy MYR payments. This page covers " + (slug === "football" ? "market types" : "how to play") + ", FAQ, available promotions, and the simple steps to get started today.") + actions() + '</div>' + img(image) + '</div>' +
    '<div class="space-columns"><article>' +
    section("What Is " + topic + "?", p(definition) + p(rules) + (expansion ? p(expansion.example) : "") + (slug === "blackjack" ? p("Number cards count at face value, face cards count as 10, and an ace counts as 1 or 11. You play your hand first, then the dealer follows the table’s drawing rules. If both hands stay at 21 or below, the higher total generally wins. Equal totals usually push.") : "")) +
    section("Why Explore " + topic + "?", '<div class="guide-cards">' +
      card("Mobile-Friendly Layout", p("Read the guide and open the navigation on a phone or desktop.")) +
      card("Easy-to-Use Navigation", p("Find the rules, worked examples and account links in separate sections.")) +
      card("Clear Rules and Payouts", p("Check the rules and payout or settlement terms for your chosen option.")) + '</div>') +
    section("Who Is " + topic + " For?", p("Beginners in Malaysia can start with the examples and learn the basic terms at their own pace.") +
      p("Experienced players can compare rules and limits. You control your budget and decide which option to choose, how much to stake and when to stop.")) +
    section("Two " + topic + " Concepts to Know", '<div class="guide-cards">' +
      card(firstConcept, p(ruleDetails) + p(example)) + card(secondConcept, p(workedExample) + (slug === "blackjack" ? p("For example, if you hit ace–six and draw a nine, the ace changes from 11 to 1. Your hand is now hard 16, so you stay in the round.") : "")) + '</div>') +
    section("How to Get Started with " + topic, stepList) +
    section(topic + " Promotions", p("Check ACE66 for current offers around Hari Raya Aidilfitri, Chinese New Year and National Day. Check whether " + name + " qualifies before claiming an offer.") +
      p("Check your account for weekend offers and review the claim period and wagering terms.") + '<a href="https://ace66my1.com/en-my/promotion">View ACE66 Promotions</a>') +
    section(topic + " FAQ", faq(question, answer) + (expansion ? expansion.faq.map(([q, a]) => faq(q, a)).join("") : "") + (slug === "blackjack" ? faq("What is a push?", "A push usually happens when you and the dealer finish with the same total without busting. Your stake is returned under the table’s rules.") + faq("What does double down mean?", "When the rules allow it, you increase your original stake and receive one final card.") + faq("When can I split?", "Eligible starting cards can be separated into two hands with a separate stake for each. Check the rules for split aces and whether doubling after a split is allowed.") : "") + faq(strategy, strategyAnswer)) +
    '</article><aside aria-label="Quick links">' + section(topic + " — Quick Access", actions()) +
    section(topic + " — Explore Other Games", links([...related.slice(0,3), ["faq","General FAQ"]])) + '</aside></div>';
}

function renderHome() {
  return '<div class="space-home"><div><p>Game Guides for Malaysia</p><h1>ACE66 — Table Games and Football</h1>' +
    p("Explore casino classics and learn how to read football markets.") + actions() + '</div></div>' +
    section("Explore Games", '<div class="space-grid">' + guides.map(([slug,name,,image]) =>
      '<a href="' + url(slug) + '">' + img(image) + '<h3>' + esc(name) + '</h3></a>').join("") + '</div>') +
    section("About ACE66", p(support.find(s => s[0] === "about-us")[3]) + link("about-us","About ACE66 Space")) +
    section("FAQ", general + link("faq","Read the full FAQ"));
}

const nav = guides.map(([slug,name]) => link(slug,name)).join("");
fs.mkdirSync("dist", {recursive:true});
fs.cpSync("public", "dist", {recursive:true});
for (const slug of pages) {
  const g = guides.find(row => row[0] === slug);
  const s = support.find(row => row[0] === slug);
  const title = g ? "ACE66 " + g[1] + " — " + g[2] : s ? "ACE66 Space — " + s[2] : "ACE66 Space — Table Games and Football in Malaysia";
  const description = g?.[4] || s?.[3] || "Explore Blackjack, Roulette, Baccarat, Dragon Tiger and football market guides.";
  const body = g ? renderGuide(g,title) : s ? '<h1>' + esc(title) + '</h1>' + p(description) + (slug === "faq" ? general : "") : renderHome();
  const crumb = slug ? '<nav class="space-crumb" aria-label="Breadcrumb">' + link("","Home") + ' › <span aria-current="page">' + esc((g || s)[1]) + '</span></nav>' : "";
  const html = '<!doctype html><html lang="en-MY"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    esc(title) + '</title><meta name="description" content="' + esc(description) + '"><link rel="canonical" href="' + origin + url(slug) +
    '"><link rel="stylesheet" href="/theme.css"><link rel="stylesheet" href="/space.css"></head><body class="space-site"><header><div class="space-wrap space-bar">' +
    link("","ACE66") + '<nav aria-label="Main navigation">' + nav + '</nav><details><summary>Menu</summary><nav aria-label="Mobile navigation">' +
    nav + '</nav></details>' + actions() + '</div></header><main class="space-wrap">' + crumb + body +
    '<div class="space-cta">' + section("Ready for ACE66" + (g ? " " + g[1] : s?.[0] === "welcome-bonus" ? " Welcome Bonus" : "") + "? Sign Up for Free", p(g ? "Explore " + g[1] + " on ACE66 and check the current welcome offer before you get started." : "Create a ACE66 account and check the current welcome offer.") + '<div class="space-actions">' + link("register", "Sign Up") + '</div><p class="space-cta-note">18+ only · ' + "Terms & Conditions apply" + ' · ' + link("responsible-gaming", "Please gamble responsibly") + '</p>') + '</div></main><footer><div class="space-wrap"><strong>ACE66</strong>' +
    links(support) + '</div></footer></body></html>';
  const dir = path.join("dist",slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"index.html"),html);
}
fs.writeFileSync("dist/robots.txt","User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n");
fs.writeFileSync("dist/sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  pages.map(slug => '<url><loc>' + origin + url(slug) + '</loc></url>').join("") + '</urlset>');
for (const slug of pages) {
  const html = fs.readFileSync(path.join("dist",slug,"index.html"),"utf8");
  if ((html.match(/<h1>/g) || []).length !== 1) throw Error("Invalid H1: " + slug);
  for (const [,target] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!fs.existsSync(path.join("dist",target,target.endsWith("/") ? "index.html" : ""))) throw Error("Missing " + target);
  }
}
console.log("Built and checked " + pages.length + " pages.");

const reference = fs.readFileSync("templates/ace66-home.html", "utf8").replaceAll("https://ace66.website", origin);
const dropdown = (title, slugs) => '<details class="nav-games"><summary>' + title + '</summary>' +
  links(slugs.map(slug => guides.find(guide => guide[0] === slug))) + '</details>';
const menu = '<nav class="primary" aria-label="Primary">' +
  link("welcome-bonus", "Welcome Bonus") + link("football", "Sport") + link("table-games", "Table Games") +
  dropdown("Casino", ["blackjack", "dragon-tiger", "sic-bo", "roulette", "baccarat"]) +
  dropdown("Others", ["rummy", "slots"]) +
  '<a href="/login/">Log In</a><a class="button" href="/register/">Sign Up</a></nav>';
const header = reference.match(/<header class="site-header">[\s\S]*?<\/header>/)[0].replace(/<nav class="primary"[\s\S]*?<\/nav>/, menu);
const favicon = reference.match(/<link\b[^>]*rel="icon"[^>]*>/)?.[0];
if (!favicon) throw Error("Homepage favicon missing");
const styles = favicon + [...reference.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(m => m[0]).join("");
const scripts = [...reference.matchAll(/<script\b[^>]*src="[^"]+"[^>]*><\/script>/g)].map(m => m[0]).join("");
const footer = '<footer class="site-footer"><div class="wrap footer-grid"><div><strong>ACE66</strong><p>ACE66 is a Registered Trademark, brand and registered business regulated by The Philippine Amusement and Gaming Corporation (PAGCOR) and operates under the licenses of Offshore Gaming, and Electronic Gaming and Poker.</p><p>18+</p></div><div><h2 class="footer-label">Games</h2>' + links(guides) + '</div><div><h2 class="footer-label">Pages</h2>' + links(support) + '</div></div></footer>';
let homepage = reference.replace(/<header class="site-header">[\s\S]*?<\/header>/, header)
  .replace(/<footer\b[\s\S]*?<\/footer>/, footer);
const known = new Set(pages.map(url));
homepage = homepage.replace(/href="(\/[^"#?]*)"/g, (match, href) => {
  if (known.has(href) || /\.[a-z0-9]+$/i.test(href)) return match;
  if (href === "/promotions/") return 'href="https://ace66my1.com/en-my/promotion"';
  if (href === "/vip/") return 'href="/#vip"';
  if (href === "/about/") return 'href="/about-us/"';
  return 'href="/table-games/"';
});
homepage = homepage.replace(/(<h2[^>]*>ACE66 Promotions<\/h2>)/, '<span id="promotions"></span>$1')
  .replace(/(<h2[^>]*>ACE66 VIP<\/h2>)/, '<span id="vip"></span>$1');
fs.writeFileSync("dist/index.html", homepage);
for (const slug of pages.filter(Boolean)) {
  const file = path.join("dist", slug, "index.html");
  let html = fs.readFileSync(file,"utf8");
  html = html.replace('<link rel="stylesheet" href="/theme.css">', styles)
    .replace(/<header>[\s\S]*?<\/header>/, header)
    .replace(/<footer>[\s\S]*?<\/footer>/, footer)
    .replace("</body>", scripts + "</body>");
  fs.writeFileSync(file,html);
}
console.log("Applied local ACE66 homepage and shared navigation.");


const supportPages = JSON.parse(fs.readFileSync("support-pages.json", "utf8"));
for (const [slug, page] of Object.entries(supportPages)) {
  const file = path.join("dist", slug, "index.html");
  let html = fs.readFileSync(file, "utf8");
  let body = page.body.replaceAll("https://ace66.website", origin)
    .replaceAll('href="/about/"', 'href="/about-us/"')
    .replaceAll('href="/responsible-play/"', 'href="/responsible-gaming/"');
  body = body.replace(/<p>([\s\S]*?)<\/p>/g, '<div class="section-answer"><p>$1</p></div>');
  const cta = html.match(/<div class="space-cta">[\s\S]*?<\/main>/)[0];
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + page.title + "</title>")
    .replace(/name="description" content="[^"]*"/, 'name="description" content="' + page.description + '"')
    .replace(/<main class="space-wrap">[\s\S]*?<\/main>/, '<main class="space-wrap">' + body + cta);
  fs.writeFileSync(file, html);
}
console.log("Applied five local ACE66 support pages.");


for (const slug of pages) {
  const file = path.join("dist", slug, "index.html");
  const html = fs.readFileSync(file, "utf8").replace(/href="(?:\/promotions\/|\/#promotions)"/g, 'href="https://ace66my1.com/en-my/promotion"');
  fs.writeFileSync(file, html);
}


for (const slug of ["terms-conditions", "privacy-policy"]) {
  const target = path.resolve("dist", slug);
  if (path.dirname(target) !== path.resolve("dist")) throw Error("Invalid removal path");
  fs.rmSync(target, {recursive:true, force:true});
}

for (const slug of pages) {
  const file = path.join("dist", slug, "index.html");
  const html = fs.readFileSync(file, "utf8").replace(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g, (anchor, href, text) => {
    const target = path.join("dist", href, href.endsWith("/") ? "index.html" : "");
    return fs.existsSync(target) ? anchor : text;
  });
  fs.writeFileSync(file, html);
}


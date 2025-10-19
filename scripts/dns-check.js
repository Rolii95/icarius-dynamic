#!/usr/bin/env node
/* eslint-disable no-console */

const dns = require("node:dns").promises;

function parseArgs() {
  const args = process.argv.slice(2);
  return args.reduce((acc, current, index) => {
    if (!current.startsWith("--")) {
      return acc;
    }

    const key = current.slice(2);
    const value = args[index + 1] && !args[index + 1].startsWith("--") ? args[index + 1] : "true";
    return { ...acc, [key]: value };
  }, {});
}

function flattenTxt(records) {
  return records
    .map((entry) => (Array.isArray(entry) ? entry.join("") : entry))
    .filter((value) => typeof value === "string");
}

async function resolveTxtRecord(name) {
  try {
    return await dns.resolveTxt(name);
  } catch (error) {
    if (error && (error.code === "ENOTFOUND" || error.code === "ESERVFAIL")) {
      return [];
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs();
  const domain = args.domain || process.env.DELIVERABILITY_DOMAIN;
  const dkimSelector = args["dkim-selector"] || process.env.DKIM_SELECTOR;
  const sendingIp = args.ip || process.env.SENDING_IP;

  if (!domain) {
    console.error("[deliverability] domain missing. Pass --domain or set DELIVERABILITY_DOMAIN.");
    process.exitCode = 2;
    return;
  }

  console.log(`Checking deliverability records for ${domain}`);

  const spfRecords = flattenTxt(await resolveTxtRecord(domain));
  const hasSpf = spfRecords.some((record) => /v=spf1\b/i.test(record));
  console.log(`SPF: ${hasSpf ? "✅ found" : "❌ missing"}`);
  if (!hasSpf) {
    console.log("  Expecting TXT record: v=spf1 include:sendgrid.net ~all");
  }

  const dmarcRecords = flattenTxt(await resolveTxtRecord(`_dmarc.${domain}`));
  const hasDmarc = dmarcRecords.some((record) => /v=dmarc1\b/i.test(record));
  console.log(`DMARC: ${hasDmarc ? "✅ found" : "❌ missing"}`);
  if (!hasDmarc) {
    console.log("  Expecting TXT record: v=DMARC1; p=quarantine; rua=mailto:dmarc@" + domain);
  }

  let hasDkim = false;
  if (dkimSelector && dkimSelector !== "true") {
    const dkimDomain = `${dkimSelector}._domainkey.${domain}`;
    const dkimRecords = flattenTxt(await resolveTxtRecord(dkimDomain));
    hasDkim = dkimRecords.some((record) => /v=DKIM1\b/i.test(record));
    console.log(`DKIM (${dkimSelector}): ${hasDkim ? "✅ found" : "⚠️ missing"}`);
    if (!hasDkim) {
      console.log(`  Check TXT record at ${dkimDomain}`);
    }
  } else {
    console.log("DKIM: ⚠️ selector not provided (set --dkim-selector or DKIM_SELECTOR)");
  }

  let hasPtr = false;
  if (sendingIp && sendingIp !== "true") {
    try {
      const ptrRecords = await dns.reverse(sendingIp);
      hasPtr = Array.isArray(ptrRecords) && ptrRecords.length > 0;
      console.log(`PTR (${sendingIp}): ${hasPtr ? "✅ found" : "⚠️ missing"}`);
      if (!hasPtr) {
        console.log("  Configure reverse DNS with your ISP or hosting provider.");
      }
    } catch (error) {
      console.log(`PTR (${sendingIp}): ⚠️ lookup failed`);
      console.log(`  Reason: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    console.log("PTR: ⚠️ sending IP not provided (set --ip or SENDING_IP)");
  }

  if (!hasSpf || !hasDmarc) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error("deliverability:dns-check", error instanceof Error ? error.message : error);
  process.exitCode = 2;
});

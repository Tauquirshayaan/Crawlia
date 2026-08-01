# How Website Analysis Works

When you add a lead to a Smart Outreach campaign, Swokei visits and analyzes their website before writing the personalized email. Here's exactly what it looks at, how the score works, and how to use the results to improve your targeting.

![Analysis history page showing website analysis jobs](images/analysis-history.png)

## What happens during analysis

When a campaign launches, Swokei processes each lead in a consistent sequence. For each lead, Swokei visits the prospect's homepage and key pages (About, Services, Contact), then evaluates the site across six key dimensions. Each dimension gets a sub-score based on what the AI finds. These sub-scores are weighted and combined into an overall score from 1–10. Once the analysis is complete, the AI identifies the 2–3 most impactful problems on the site, and uses those specific findings to write a unique, personalized email for that prospect. Analysis on individual leads typically completes in 30–90 seconds, though for larger batches Swokei processes multiple leads in parallel — a 50-lead campaign usually has all leads analyzed within 15–30 minutes.

## The six analysis dimensions

## Understanding the score

The overall score runs from 1–10 and reflects how well-built the prospect's website is:

- 8–10: Very well built — few obvious issues
- 6–7: Good, with a few areas to improve
- 4–5: Average — clear opportunities
- 2–3: Poor — significant issues across multiple areas
- 1: Very poor — site needs a major overhaul
## Viewing and interpreting results for a specific lead

Once a lead's analysis completes and reaches Ready status (analysis done, email generated, not yet sent), click on the lead row in the campaign detail table to expand its detail panel on the right. The panel displays the overall score, the sub-scores for each of the six dimensions, and the specific findings the AI used when writing the email. You can also read and edit the generated email from this same panel before it sends, giving you a chance to review Swokei's work or make manual adjustments if needed.

This is your opportunity to understand what the AI found and ensure the personalized angle makes sense for this particular prospect. The analysis is only as good as your follow-up — if you spot an issue the email didn't mention, you can add it to strengthen the pitch.

## Filtering and sorting leads by score

On the campaign detail page, look for the sort options above the lead table. Sort by Score to bring the lowest-scoring leads to the top — those are your highest-probability targets because they have the most obvious problems for you to address. You can also set a minimum score threshold during campaign setup in the Rules step, which automatically skips any leads above that score, keeping your credits focused on prospects most likely to need your services.

If a prospect's site scores 8–10, it means the site is well-built with few obvious issues. It doesn't mean you can't reach out, but it does mean the AI will have fewer specific problems to reference, which weakens the email. High-scoring leads are lower-probability conversions for website improvement services, so using the score filter to focus on lower scores is a smart use of your credits.

## Handling analysis failures and retries

Analysis can fail for a few reasons: the website is offline or returning an error, the site blocks automated access with aggressive bot protection, the page takes too long to load (timeout), or the URL is malformed or doesn't point to a real website. When analysis fails, the lead is marked Skipped and no credit is charged.

To retry a skipped lead, open the campaign and click on the skipped lead to expand its panel. Look for a "Retry analysis" or "Retry" option in the lead actions and click it — Swokei will attempt to fetch and analyze the site again. If the site continues to fail, check that the URL in your lead list is correct. A mistyped URL (missing .com or a typo in the domain) is the most common cause of repeated failures.

## Understanding analysis accuracy and limitations

The analysis is AI-driven and accurate for most commercial websites, but a few edge cases exist. Single-page apps built entirely with JavaScript (some React or Vue applications) may not render fully during analysis, which can affect scores. Password-protected sites behind a login can't be analyzed at all. A site with almost no content may score poorly on content quality even if it's intentionally minimal, and recently redesigned sites will be scored based on their current state, not what they looked like before the redesign.

Additionally, Swokei focuses on the homepage and key pages (About, Services, Contact) — the pages a potential client would judge a business by. It doesn't crawl the entire site. For most small business websites, the homepage alone contains enough signals to generate a relevant and specific email. Very large or complex websites are treated the same way — judged by their most visible pages, with the assumption that if those are weak, the overall impression is weak.

ON THIS PAGE


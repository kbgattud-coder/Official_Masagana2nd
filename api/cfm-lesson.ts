import { handleCfmLesson } from './_lib/cfm.js';

export default async function handler(req: any, res: any) {
  const lang = Array.isArray(req.query.lang) ? req.query.lang[0] : req.query.lang;
  const isCron = /vercel-cron/i.test(req.headers['user-agent'] || '');
  const force = req.query.refresh === '1' || isCron;

  // The Monday cron warms both languages for the new week in one visit.
  if (isCron) {
    const [en, tl] = await Promise.all([
      handleCfmLesson('eng', true),
      handleCfmLesson('tgl', true),
    ]);
    return res.status(200).json({ cron: true, eng: en.body, tgl: tl.body });
  }

  const result = await handleCfmLesson(lang, force);
  // Client/CDN may cache for an hour; the weekly key change handles rollover.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(result.status).json(result.body);
}

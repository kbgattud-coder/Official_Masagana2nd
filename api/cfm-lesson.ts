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
  // The client sends a ?w= week stamp, so each study week is a distinct URL
  // and a new week is always a cache miss. Keep the stale window short so a
  // request without the stamp can never serve last week's lesson for long.
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
  return res.status(result.status).json(result.body);
}

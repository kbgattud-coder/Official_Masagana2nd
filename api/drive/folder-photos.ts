import { fetchFolderPhotos } from '../_lib/drive.js';

export default async function handler(req: any, res: any) {
  const folderParam = Array.isArray(req.query.folderId) ? req.query.folderId[0] : req.query.folderId;
  const result = await fetchFolderPhotos(folderParam);
  return res.status(result.status).json(result.body);
}

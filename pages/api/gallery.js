// Vercel Serverless Function for gallery API

// 简单的内存存储（实际生产环境建议使用数据库）
let galleries = {};

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // 获取作品集
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing gallery ID' });
      return;
    }

    const gallery = galleries[id];
    if (gallery) {
      res.status(200).json(gallery);
    } else {
      res.status(404).json({ error: 'Gallery not found' });
    }
  } else if (req.method === 'POST') {
    // 保存作品集
    try {
      const data = req.body;
      if (!data.galleryId) {
        res.status(400).json({ error: 'Missing gallery ID' });
        return;
      }

      galleries[data.galleryId] = {
        items: data.items,
        spacing: data.spacing,
        owner: data.owner,
        createdAt: data.createdAt
      };

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Save gallery error:', error);
      res.status(500).json({ error: 'Failed to save gallery' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

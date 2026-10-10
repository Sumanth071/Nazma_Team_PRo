import { Router, Request, Response } from 'express';

const router = Router();

// In-memory cache for audio buffers to avoid redundant upstream requests
const ttsCache = new Map<string, Buffer>();
const MAX_CACHE_ENTRIES = 200;

function splitIntoChunks(text: string, maxLen = 150): string[] {
  // First split by sentence enders
  const rawSentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];

  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if (trimmed.length <= maxLen) {
      chunks.push(trimmed);
    } else {
      // Split long sentences by comma or space
      const parts = trimmed.split(/([,;]+)/);
      let current = '';
      for (const part of parts) {
        if ((current + part).length <= maxLen) {
          current += part;
        } else {
          if (current.trim()) chunks.push(current.trim());
          current = part;
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const lang = String(req.query.lang || 'en').toLowerCase().trim();
    const text = String(req.query.text || '').trim();

    if (!text) {
      res.status(400).json({ message: 'Query parameter "text" is required.' });
      return;
    }

    const validLangMap: Record<string, string> = {
      en: 'en',
      hi: 'hi',
      te: 'te',
      ta: 'ta',
      'en-us': 'en',
      'hi-in': 'hi',
      'te-in': 'te',
      'ta-in': 'ta',
    };

    const targetLang = validLangMap[lang] || 'en';
    const cacheKey = `${targetLang}:${text}`;

    if (ttsCache.has(cacheKey)) {
      const cachedBuf = ttsCache.get(cacheKey)!;
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(cachedBuf.length),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      });
      res.end(cachedBuf);
      return;
    }

    const chunks = splitIntoChunks(text, 140);
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
        targetLang
      )}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

      const upstreamRes = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!upstreamRes.ok) {
        throw new Error(`Upstream TTS failed with HTTP status ${upstreamRes.status}`);
      }

      const arrBuf = await upstreamRes.arrayBuffer();
      buffers.push(Buffer.from(arrBuf));
    }

    const combinedBuffer = Buffer.concat(buffers);

    // Save to cache
    if (ttsCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, combinedBuffer);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(combinedBuffer.length),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });
    res.end(combinedBuffer);
  } catch (err: any) {
    console.error('[TTS Route] Audio generation error:', err.message);
    res.status(500).json({ message: 'Failed to synthesize speech audio.', error: err.message });
  }
});

export default router;

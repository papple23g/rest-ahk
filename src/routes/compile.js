import express from 'express';
import expressQueue from 'express-queue';
import mcache from 'memory-cache';

import { promises as fs } from 'fs';
import proc from 'child_process';

import md5 from 'md5';
import del from 'del';

// TODO: convert to import
// const proc = require('child_process');

const CACHE_TIMEOUT = process.env.CACHE_TIMEOUT || 60000;
const BUILD_TIMEOUT = process.env.BUILD_TIMEOUT || 10000;

// expressjs constants
const router = express.Router();
const queueMw = expressQueue({ activeLimit: 1, queuedLimit: 20 });

/** Utility function to convert script->exe */
async function compileScript(id, script) {
  try {
    await fs.writeFile(`/tmp/${id}.ahk`, script);

    await new Promise(async (resolve) => {
      proc.exec(`xvfb-run -a wine Ahk2Exe.exe /in /tmp/${id}.ahk`, { timeout: BUILD_TIMEOUT }, (err, stout, sterr) => {
        resolve(err ? stout : sterr);
      });
    });

    return await fs.readFile(`/tmp/${id}.exe`);
  } finally {
    await del(`/tmp/${id}.*`, { force: true });
  }
}

router.post('/', queueMw, async (req, res) => {
  if (!req.body) {
    res.status(400).send({ error: { code: -1, message: 'Empty body' } });
    return;
  }

  const id = md5(req.body);

  let data = mcache.get(id);
  if (!data) {
    console.log(`processing uncached:${id}`);

    try {
      data = await compileScript(id, req.body);

      mcache.put(id, data, CACHE_TIMEOUT);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: { code: err.code || -1, message: err.message || 'unknown' } });
      return;
    }
  }

  // cannot use res.download(`/tmp/${id}.exe`); due to cached buffer
  res.sendFileBuffer(`${id}.exe`, data);
});

export default {
  stats() {
    return {
      queue: queueMw.queue.getLength(),
      cache: mcache.size(),
    };
  },
  router,
};

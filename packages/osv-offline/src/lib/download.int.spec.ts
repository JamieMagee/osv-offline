import { OsvOfflineDb } from '@renovatebot/osv-offline-db';
import fs from 'fs-extra';
import path from 'path';
import { tryDownloadDb } from './download';

describe('lib/download', () => {
  describe('tryDownloadDb', () => {
    beforeEach(async () => {
      await fs.remove(OsvOfflineDb.rootDirectory);
    });

    it('works', async () => {
      const result = await tryDownloadDb();

      expect(result.success).toBeTrue();
      expect(fs.stat(OsvOfflineDb.rootDirectory)).toBeDefined();
      expect(fs.readdir(OsvOfflineDb.rootDirectory)).not.toBeEmptyArray();
    });

    it('skips download if less than 1 day old', async () => {
      await fs.ensureDir(OsvOfflineDb.rootDirectory);
      const zipFilePath = path.join(
        OsvOfflineDb.rootDirectory,
        'osv-offline.zip'
      );
      await fs.ensureFile(zipFilePath);

      const result = await tryDownloadDb();

      expect(result.success).toBeTrue();
      const stat = await fs.stat(zipFilePath);
      expect(stat.size).toBe(0);
    });

    it('skips download in case of invalid GitHub token', async () => {
      process.env['GITHUB_COM_TOKEN'] = 'some-token';

      const result = await tryDownloadDb();

      expect(result.success).toBeFalse();
    });
  });
});

import { HarEntries, HttpArchive } from './har';
import fs from 'fs';
import Path from 'path';
import { collect, take } from '../../../lib/async-tools';

describe('HarEntries', () => {
  it('can be constructed from a readable', async () => {
    let source = fs.createReadStream(
      Path.join(__dirname, '../../../tests/inputs/petstore.swagger.io.har')
    );

    let entries = HarEntries.fromReadable(source);
    let entriesArray = await collect(entries);

    expect(entriesArray.length).toBeGreaterThan(0);
  });

  it('propagates errors in I/O', async () => {
    let source = fs.createReadStream(
      Path.join(__dirname, 'not-actually-a-file')
    );

    const getEntries = async () => {
      let entries = HarEntries.fromReadable(source);

      await collect(entries);
    };

    expect(getEntries).rejects.toThrowError('ENOENT');
  });

  describe('will only read HAR files', () => {
    it('will not produce any entries when they do not exist at expected path', async () => {
      let source = fs.createReadStream(
        Path.join(__dirname, '../../../tests/inputs/githubpaths.json')
      );

      let entries = await collect(HarEntries.fromReadable(source));
      expect(entries).toHaveLength(0);
    });

    it('throws an error when file isnt json', async () => {
      let source = fs.createReadStream(Path.join(__dirname, './har.ts'));

      const getEntries = async () => {
        await collect(HarEntries.fromReadable(source));
      };

      expect(getEntries).rejects.toThrowError('could not be read as HAR');
    });
  });

  it('can be encoded as Readable JSON stream', async () => {
    let source = fs.createReadStream(
      Path.join(__dirname, '../../../tests/inputs/petstore.swagger.io.har')
    );

    let entries = take<HttpArchive.Entry>(2)(HarEntries.fromReadable(source));

    let jsonStream = HarEntries.toHarJSON(entries);

    let result = '';
    for await (let chunk of jsonStream) {
      result += chunk.toString('utf-8');
    }

    let parsed;
    expect(() => {
      parsed = JSON.parse(result);
    }).not.toThrow();

    expect(parsed).toMatchSnapshot();
  });
});

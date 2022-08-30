import { createHash } from 'crypto';
import { DriveFile } from '.';
import { FileType } from '../FileTypeEnum';
import type { IGetFilesFuncProps } from '.';

const mockListFunction = jest
  .fn()
  .mockReturnValue({
    nextPageToken: null,
    items: Array.from([1, 2, 3], (key) => ({
      id: createHash('sha256').digest('hex'),
      title: `file_${key}`,
    })),
  })
  .mockReturnValueOnce({ nextPageToken: null, items: null })
  .mockReturnValueOnce({ nextPageToken: null, items: [] });

class Files {
  public static list(): GoogleAppsScript.Drive.Schema.FileList;
  public static list(
    optionalArgs?: object
  ): GoogleAppsScript.Drive.Schema.FileList {
    return mockListFunction(optionalArgs);
  }
}

global.Drive = {
  Files: Files as unknown as GoogleAppsScript.Drive.Collection.FilesCollection,
} as unknown as GoogleAppsScript.Drive;

it('Test DriveFile class', () => {
  // Test getFiles() return value
  const list_call_default_args = {
    q: 'mimeType != "application/vnd.google-apps.folder"',
    maxResults: 100,
    pageToken: null,
  };
  const call_1_args: IGetFilesFuncProps = { query: '', maxResults: 300 };
  expect(DriveFile.getFiles(call_1_args)).toEqual([]);

  const call_2_args: IGetFilesFuncProps = {
    query: '  ',
    type: FileType.DIRECTORY,
  };
  expect(DriveFile.getFiles(call_2_args)).toEqual([]);

  expect(DriveFile.getFiles()).not.toEqual([]);

  // Test mocked function arguments
  expect(mockListFunction.mock.calls[0][0]).toEqual({
    ...list_call_default_args,
    ...{ maxResults: 300 },
  });
  expect(mockListFunction.mock.calls[1][0]).toEqual({
    ...list_call_default_args,
    ...{ q: 'mimeType = "application/vnd.google-apps.folder"' },
  });
  expect(mockListFunction.mock.calls[2][0]).toEqual(list_call_default_args);
});

import { DriveFile } from '../src/lib/DriveFile';

const mockListFunction = jest
  .fn()
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
  expect(DriveFile.getFiles()).toEqual([]);
  expect(DriveFile.getFiles()).toEqual([]);
});

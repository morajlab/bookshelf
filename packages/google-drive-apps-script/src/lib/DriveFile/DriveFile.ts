import { FileType } from '../FileTypeEnum';
import type {
  GetFilesFunc,
  IGetFilesFuncProps,
  GetRootDocumentsFunc,
  GetRootDirectoriesFunc,
  MoveFileFunc,
} from './DriveFile.types';

export class DriveFile {
  public static getFiles: GetFilesFunc = (params) => {
    const GetFilesDefProps: IGetFilesFuncProps = {
      type: FileType.FILE,
      maxResults: 100,
      filterCallback: () => true,
    };
    const { query, type, maxResults, filterCallback } = {
      ...GetFilesDefProps,
      ...params,
    };
    const q: string = `${query ? `${query} and ` : ''}mimeType ${
      type === FileType.FILE ? '!' : ''
    }= "application/vnd.google-apps.folder"`;
    const filesArray: GoogleAppsScript.Drive.Schema.File[] = [];
    let pageToken: string = null;

    do {
      try {
        const { items, nextPageToken } = Drive.Files.list({
          q,
          maxResults,
          pageToken,
        });

        if (!items || items.length === 0) {
          break;
        }

        filesArray.push.apply(filesArray, items.filter(filterCallback));

        pageToken = nextPageToken;
      } catch (err) {
        Logger.log('Failed with error %s', err.message);
      }
    } while (pageToken);

    return filesArray;
  };

  public static getRootDocuments: GetRootDocumentsFunc = () =>
    this.getFiles({
      query: '"root" in parents and trashed = false',
      filterCallback: ({ mimeType }) =>
        mimeType !== 'application/vnd.google-apps.script',
    });

  public static getRootDirectories: GetRootDirectoriesFunc = (query) =>
    this.getFiles({
      query: `${
        query ? `${query} and ` : ''
      }"root" in parents and trashed = false`,
      type: FileType.DIRECTORY,
    });

  public static moveFile: MoveFileFunc = ({ file, dest }) => {
    const parentDirectory = this.getRootDirectories().filter(
      ({ title }) => title === dest
    )[0];

    return Drive.Files.patch(file, file.id, {
      addParents: parentDirectory.id,
      removeParents: file.parents.map(({ id }) => id).join(),
    });
  };
}

export default DriveFile;

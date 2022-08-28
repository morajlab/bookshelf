// TODO: Create query builder

const ROOT_DIRECTORIES_ARRAY: string[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'persian',
  '123',
];

enum FileType {
  FILE,
  DIRECTORY,
}

interface IGetFilesFuncProps {
  query?: string;
  type?: FileType;
  maxResults?: number;
  filterCallback?: (params: GoogleAppsScript.Drive.Schema.File) => boolean;
}
type GetFilesFunc = (
  params?: IGetFilesFuncProps
) => GoogleAppsScript.Drive.Schema.File[];
type GetRootDocumentsFunc = () => ReturnType<GetFilesFunc>;
type GetRootDirectoriesFunc = (
  query?: IGetFilesFuncProps['query']
) => ReturnType<GetFilesFunc>;

interface IMoveFileProps {
  file: GoogleAppsScript.Drive.Schema.File;
  dest: string;
}
type MoveFileFunc = (
  params: IMoveFileProps
) => GoogleAppsScript.Drive.Schema.File;

class DriveFile {
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

class FileManager {
  public static manageRootDirectories = () => {
    DriveFile.getRootDirectories()
      .filter(({ title }) => !ROOT_DIRECTORIES_ARRAY.includes(title))
      .forEach(({ id, title }) => {
        try {
          Drive.Files.trash(id);
          Logger.log('Directory %s removed successfully.', title);
        } catch (err) {
          Logger.log('Failed with error %s', err.message);
        }
      });

    ROOT_DIRECTORIES_ARRAY.forEach((dir) => {
      const dirsArray = DriveFile.getRootDirectories(`title = '${dir}'`);

      if (dirsArray.length === 1) {
        return;
      }

      if (dirsArray.length > 1) {
        // TODO: remove extra directories with the same name
        Logger.log('TODO: remove extra directories with the same name');
        return;
      }

      try {
        DriveApp.createFolder(dir);
        Logger.log('Directory %s created successfully.', dir);
      } catch (err) {
        Logger.log('Failed with error %s', err.message);
      }
    });
  };

  public static arrangeDocuments = () => {
    DriveFile.getRootDocuments().forEach((file) => {
      const firstChar = file.title[0];

      if (/[A-Za-z]/.test(firstChar)) {
        DriveFile.moveFile({ file, dest: firstChar.toLowerCase() });

        return;
      }

      if (/\d/.test(firstChar)) {
        DriveFile.moveFile({ file, dest: '123' });

        return;
      }

      DriveFile.moveFile({ file, dest: 'persian' });
    });
  };
}

const main = () => {
  FileManager.arrangeDocuments();
};

// TODO: Create query builder

const ROOT_DIRECTORIES_ARRAY = [
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

const FileType = {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY',
};

const getFiles = ({
  query = '',
  type = FileType.FILE,
  maxResults = 100,
  filterCallback = () => true,
} = {}) => {
  const q = `${query ? `${query} and ` : ''}mimeType ${
    type === FileType.FILE ? '!' : ''
  }= "application/vnd.google-apps.folder"`;
  const filesArray = [];
  let pageToken = null;

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

const getRootDocuments = () =>
  getFiles({
    query: '"root" in parents and trashed = false',
    filterCallback: ({ mimeType }) =>
      mimeType !== 'application/vnd.google-apps.script',
  });

const getRootDirectories = ({ query = '' } = {}) =>
  getFiles({
    query: `${
      query ? `${query} and ` : ''
    }"root" in parents and trashed = false`,
    type: FileType.DIRECTORY,
  });

const manageRootDirectories = () => {
  getRootDirectories()
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
    const dirsArray = getRootDirectories({ query: `title = '${dir}'` });

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

const arrangeDocuments = () => {
  getRootDocuments().forEach(({ title }) => {
    const firstChar = title[0];

    if (/[A-Za-z]/.test(firstChar)) {
      // TODO: move to related directory
      return;
    }

    if (/\d/.test(firstChar)) {
      // TODO: move to '123' directory
      return;
    }

    // TODO: move to 'persian' directory
  });
};

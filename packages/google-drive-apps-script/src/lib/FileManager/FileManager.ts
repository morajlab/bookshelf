import { DriveFile } from '../DriveFile/DriveFile';
import { ROOT_DIRECTORIES_ARRAY } from '../../root-directories';

export class FileManager {
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

export default FileManager;

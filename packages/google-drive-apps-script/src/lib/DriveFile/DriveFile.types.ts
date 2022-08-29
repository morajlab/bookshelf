export interface IGetFilesFuncProps {
  query?: string;
  type?: FileType;
  maxResults?: number;
  filterCallback?: (params: GoogleAppsScript.Drive.Schema.File) => boolean;
}

export type GetFilesFunc = (
  params?: IGetFilesFuncProps
) => GoogleAppsScript.Drive.Schema.File[];

export type GetRootDocumentsFunc = () => ReturnType<GetFilesFunc>;

export type GetRootDirectoriesFunc = (
  query?: IGetFilesFuncProps['query']
) => ReturnType<GetFilesFunc>;

export interface IMoveFileProps {
  file: GoogleAppsScript.Drive.Schema.File;
  dest: string;
}

export type MoveFileFunc = (
  params: IMoveFileProps
) => GoogleAppsScript.Drive.Schema.File;

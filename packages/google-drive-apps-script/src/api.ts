import { FileManager } from './lib/FileManager';

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

const EXPORTED_FUNCTIONS: { [k: string]: Function } = {
  manageRootDirectories: FileManager.manageRootDirectories,
  arrangeDocuments: FileManager.arrangeDocuments,
  defaultFunction: () => ({
    content: 'This is default function',
  }),
};

const doGet = ({ parameter }: any) => {
  const defaultParameter = {
    function: 'defaultFunction',
  };
  const _parameter = { ...defaultParameter, ...parameter };
  const functionName = EXPORTED_FUNCTIONS[_parameter.function]
    ? EXPORTED_FUNCTIONS[_parameter.function]
    : EXPORTED_FUNCTIONS[defaultParameter.function];
  const output = ContentService.createTextOutput(
    JSON.stringify(functionName())
  );

  output.setMimeType((MimeType as any).JSON);

  return output;
};

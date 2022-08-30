import { FileManager } from './lib';

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

global.doGet = doGet;

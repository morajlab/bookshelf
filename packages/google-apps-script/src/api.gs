const getRootFiles = () => {
  const q = `"root" in parents and trashed = false and
  mimeType != "application/vnd.google-apps.folder"`;
  const maxResults = 100;
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

      filesArray.push.apply(
        filesArray,
        items.filter(
          ({ mimeType }) => mimeType !== 'application/vnd.google-apps.script'
        )
      );

      pageToken = nextPageToken;
    } catch (err) {
      Logger.log('Failed with error %s', err.message);
    }
  } while (pageToken);

  return filesArray;
};

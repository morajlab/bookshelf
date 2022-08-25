function doGet(e) {
  var params = JSON.stringify(e);

  return HtmlService.createHtmlOutput(params);
  // var files = DriveApp.getFiles();

  // while (files.hasNext()) {
  //   var file = files.next();
  //   Logger.log(file.getName());
  // }
}

export function stripProtocol(path: string) {
  const index = path.indexOf("://");

  return index == -1 ? path : path.slice(index + 3);
}

// returns the extension, including the `.` (`a.txt` -> `.txt`)
export function copyExtension(path: string) {
  const slashIndex = path.lastIndexOf("/");

  if (slashIndex == -1) {
    return "";
  }

  const extensionIndex = path.slice(slashIndex).lastIndexOf(".") + slashIndex;

  return extensionIndex == -1 ? "" : path.slice(extensionIndex);
}

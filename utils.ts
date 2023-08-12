export const findNoteStart = function (fileLines: string[]) {
  if (fileLines[0] === '---') {
    for (let i = 1; i < fileLines.length; i++) {
      if (fileLines[i] === '---') {
        return i + 1;
      }
    }
  }
  return 0;
}

export const getFileName = function (fileLines: string[], startLine: number) {
  console.log(startLine)
  for (let i = startLine; i < fileLines.length; i++) {

  }
  return null
}
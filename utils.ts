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
  for (let i = startLine; i < fileLines.length; i++) {
    const line = fileLines[i]
    if (!line || line === ' ') continue
    const noTag = replaceTag(line)
    if (!noTag || noTag === ' ') continue
    const noSymbol = replaceSymbol(noTag)
    if (!noSymbol || noSymbol === ' ') continue
    return noSymbol
  }
  return null
}

const replaceTag = function (line: string) {
  return line.replace(/(?<=(\s|^))#[^\s\!\@\#\$\%\^\&\*\(\)]+(?=(\s|$))/, '')
}

const replaceSymbol = function (line: string) {
  return line
    .replace(/[\\/:|#^[\]]/g, '')
    .replace(/^.*?\s/, '')
    .replace(/[^\w\s\u4e00-\u9fa5]+$/, '')
}


const extractFirstSentence = function (line: string) {
  const match = line.match(/^.*?[。！？：!?.]/);
  if (match) {
    return match[0];
  } else {
    return line;
  }
}
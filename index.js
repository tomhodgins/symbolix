export default function(expression = '()') {
  const tokens = expression.trim().match(
    new RegExp(
      [
        '(',                   // group of things that can be parsed:
          [
            '"[^"]*"',         // double-quoted string
            '\'[^\']*\'',      // single-quoted string
            '`[^`]*`',         // backtick-quoted string
            '\\(',             // paren open
            '\\)',             // paren close
            '[^\\s()"\'`]+',  // everything that's not the above
          ].join('|'),
        ')'                    // close group
      ].join(''),
      'g'
    )
  )

  for (
    var count = 0, index = tokens.length - 1;
    0 <= index;
    index--
  ) {
    const currentToken = tokens[index].trim()

    // If paren open, convert to [
    if (currentToken === '(') {
      tokens[index] = '[',
      count++
    }

    // If paren close, convert to ]
    else if (currentToken  === ')') {
      tokens[index] = ']',
      count--
    }

    // Skip null
    else if (currentToken === 'null') {
      // Do nothing, JSON.parse gives us this for free
    }

    // If boolean
    else if (['true', 'false'].some(boolean => boolean === currentToken)) {
      tokens[index] = JSON.parse(currentToken)
    }

    // If integer
    else if (Number.isInteger(Number(currentToken))) {
      if (Math.abs(Number(currentToken)) == Number(currentToken)) {
        tokens[index] = Number(currentToken)
      }
    }

    // Skip number
    else if (currentToken == Number(currentToken)) {
      if (Math.abs(Number(currentToken)) == Number(currentToken)) {
        tokens[index] = Number(currentToken)
      }
    }

    // Otherwise, handle as a string
    else tokens[index] = `"${currentToken.replace(/["'`]/g, '')}"`

    // Add commas between terms (no trailing commas)
    if (
      0 < index
      && currentToken !== ')'
      && tokens[index - 1].trim() !== '('
    ) {
      tokens.splice(index, 0, ',')
    }

  }

  return count
    ? undefined
    : JSON.parse(tokens.join(''))

}
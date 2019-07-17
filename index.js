export default function(expression) {
  const tokens = expression.trim().match(
    new RegExp(
      [
        '(',                  // group of things that can be parsed:
          [
            '\\(',            // paren open
            '\\)',            // paren close
            '[^\\s()"\'`+]+',  // everything that's not the above
          ].join('|'),
        ')'                   // close group
      ].join(''),
      'g'
    )
  )

  for (
    var o, count = 0, index = tokens.length - 1;
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

    // Skip integer
    else if (Number.isInteger(Number(currentToken))) {
      // Do nothing, JSON.parse gives us this for free
    }

    // Skip number
    else if (currentToken == Number(currentToken)) {
      // Do nothing, JSON.parse gives us this for free
    }

    // Skip double quotes
    else if (currentToken === '"') {
      // Do nothing, JSON.parse gives us this for free
    }

    // Otherwise, handle as a string
    else tokens[index] = '"' + currentToken.replace('"', '\\\"') + '"'

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
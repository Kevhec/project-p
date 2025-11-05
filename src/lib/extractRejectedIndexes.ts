function extractRejectedIndexes<T>(array: PromiseSettledResult<T>[]) {
  const newRejectedIndexes = []

  for (let i = 0; i < array.length; i++) {
    const result = array[i];

    if (result.status === 'rejected') {
      newRejectedIndexes.push(i)
    } else {
      continue
    }
  }

  return newRejectedIndexes;
}

export default extractRejectedIndexes;
// used to display the actual number of comments
function countComments(comm: IComment[]): number {
  if (comm !== undefined && comm.length >= 1) {
    let levelQuantity = comm.length;
    // recursively count comments
    comm.forEach((com) => (levelQuantity += countComments(com.responses)));
    return levelQuantity;
  }
  // base case
  return 0;
}

export default countComments;

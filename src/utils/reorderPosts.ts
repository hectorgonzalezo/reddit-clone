import { differenceInHours } from 'date-fns';
import countComments from './countComents';

// this function is used to sort by hot
function getWeight(post: IPost): number {
  const timeDifference = differenceInHours(new Date(), new Date(post.createdAt));

  return (post.commentsNum * 100) / timeDifference;
}

function reorderPosts(postArray: IPost[], order: PostOrder): IPost[] {
  const copiedPosts = [...postArray];
  let orderedPosts = copiedPosts;
  switch (order) {
    case 'hot':
      // sort by both time and votes
      if (postArray.length > 0) {
        const withComments = copiedPosts.map((post) => ({
          ...post,
          commentsNum: countComments(post.comments),
        }));
        orderedPosts = withComments.sort(
          (a, b) => getWeight(a) - getWeight(b)
        ).reverse();
      }
      break;
    case 'new':
      // sort by most recently posted
      if (postArray.length > 0) {
        orderedPosts = copiedPosts
          .sort(
            (a, b) =>
              new Date(a.createdAt).valueOf() -
              new Date(b.createdAt).valueOf()
          )
          .reverse();
      }
      break;
    case 'top':
      // sort by most votes
      if (postArray.length > 0) {
        orderedPosts = copiedPosts.sort((a, b) => a.upVotes - b.upVotes).reverse();
      }
      break;
    default:
      break;
  }
  return orderedPosts;
}

export default reorderPosts;

import BASEURL from './baseurl';


// uploads an image to firestore
// arguments are the file to upload and the path to upload it to
export async function uploadImage(
    file: File,
    path: string
  ): Promise<string | Error> {
    try {
      // Upload the image to Cloud Storage.
      const filePath = `${path}${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      // Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
      return publicImageUrl;
    } catch (error) {
      console.log(`couldn't upload ${file.name}`);
      return error as Error;
    }
  }

export async function getPost(subredditName, postId) {
    const userDoc = await getDoc(doc(db, `subreddits/${subredditName}/posts`, postId));
    return userDoc.data();
  }


export async function updateVotes(username, subreddit, postId, incrementQuantity, voteType) {
    const postDoc = doc(db, `subreddits/${subreddit}/posts/`, postId);
    const userDoc = doc(db, 'users', username);

    // update upVotes in original document
    await updateDoc(postDoc, {
      upVotes: increment(incrementQuantity),
    });

    // updates votes
    await updateDoc(userDoc, {
      [`votes.${postId}`]: voteType,
    });
  }
  export async function getAllPostsInSubreddit(
    subredditName: string
  ): Promise<IPost[]> {
    const posts: IPost[] = [];
    const postsQuery = query(
      collection(db, `subreddits/${subredditName}/posts`),
      orderBy("timePosted", "desc"),
      limit(10)
    );
    const postsInSubreddit = await getDocs(postsQuery);
    postsInSubreddit.forEach((post) => posts.push(post.data() as IPost));

    return posts;
  }

  export async function getTopPostsInSubreddit(subredditName: string): Promise<IPost[]> {
    const posts: IPost[] = [];
    const postsQuery = query(collection(db, `subreddits/${subredditName}/posts`));
    const postsInSubreddit = await getDocs(postsQuery);
    postsInSubreddit.forEach((post) => {
      const postData = post.data();
      // Add id of post to object
      posts.push(postData as IPost);
    });

    return posts;
  }




  // adds a post in the specified subreddit
  export async function addTextPost(username, title, subreddit, text) {
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      text,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    return docRef.id;
  }

  export async function addImagePost(username, title, subreddit, image) {
    const imageUrl = await uploadImage(image, `postImages/${username}/images`)
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      imageUrl,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    return docRef.id;
  }

  export async function addUrlPost(username, title, subreddit, url) {
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      url,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    return docRef.id;
  }
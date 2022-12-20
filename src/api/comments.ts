import BASEURL from './baseurl';

export async function createComment(
  postId: string,
  comment: { text: string; user: string; parent?: string},
  token: string,
): Promise<{ comment: IComment ; errors?: BackendErrors }>{
  const response = await fetch(`${BASEURL}/posts/${postId}/comments`, {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(comment),
  });

  const createdComment = await response.json();

  return createdComment;
} 


export async function updateComment(
  postId: string,
  commentId: string,
  comment: { text: string; user: string; parent?: string},
  token: string,
): Promise<{ comment: IComment ; errors?: BackendErrors }> {

  const response = await fetch(`${BASEURL}/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(comment),
  });

  const updatedComment = await response.json();

  return updatedComment;
} 
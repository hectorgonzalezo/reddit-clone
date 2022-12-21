
// Three ways to orders posts by
type PostOrder = 'hot' | 'new' | 'top';

type Vote = "upVote" | "downVote" | '';

interface Votes {
  [index: string]: Vote;
}

type BackendErrors = Array<{ msg: string}>;

interface IUser {
  username: string;
  password?: string;
  passwordConfirm?: string;
  email: string;
  permission: "regular" | "admin";
  icon?: string;
  communities: [] | string[] | ObjectId[] | ICommunity[];
  subreddits: string[];
  _id: string | ObjectId;
  createdAt: string;
  updatedAt: string;
  votes: Votes;
  token: string;
}

interface IPost {
  title: string;
  text: string;
  user: ObjectId;
  community: ObjectId | ICommunity;
  upVotes: number;
  comments: [] | ObjectId[] | IComment[];
  _id: string | ObjectId;
  url?: string;
  createdAt: string;
  updatedAt: string;
  commentsNum: number;
}


interface IComment {
  _id: string | ObjectId;
  text: string;
  user: ObjectId | IUser;
  upVotes: number;
  responses: [] | ObjectId[] | IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface ICommunity {
  _id: string | ObjectId;
  name: string;
  subtitle: string;
  description: string;
  creator: ObjectId | IUser;
  users: [] | ObjectId[] | IUser[];
  posts: [] | ObjectId[] | IPost[];
  membersQuantity: number;
  postsQuantity: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubredditsObject {
  [index?: string]: ICommunity
}

interface PostsObject {
  [index?: number]: IPost
}

interface LoginModalState {
  loginModalVisible: boolean;
}

interface UserState {
  user: UserInState;
}

interface AddCommunityModalState {
  addCommunityModalVisible: boolean;
}

interface ChangeIconModalState {
  changeIconModalVisible: boolean;
}

interface CurrentSubredditState {
  currentSubreddit: string;
}

interface UserInState {
  username: string;
  email: string;
  permission: "regular" | "admin";
  icon?: string;
  communities: [] | ObjectId[] | ICommunity[];
  subreddits: string[];
  _id: string | ObjectId;
  createdAt: string;
  updatedAt: string;
  votes: Votes;
  token: string;
}

declare module "*.jpg";
declare module "*.png";
declare module "*.gif";
declare module "*.svg";

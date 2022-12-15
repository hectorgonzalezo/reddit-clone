export interface IUser {
  username: string;
  password: string;
  email: string;
  permission: "regular" | "admin";
  icon?: string;
  communities: [] | ObjectId[] | ICommunity[];
  _id?: string | ObjectId;
}

export interface IPost {
  title: string;
  text: string;
  user: ObjectId;
  community: ObjectId | ICommunity;
  upVotes: number;
  comments: [] | ObjectId[] | IComment[];
}

export interface IComment {
  text: string;
  user: ObjectId | IUser;
  upVotes: number;
  responses: [] | ObjectId[] | IComment[];
}

export interface ICommunity {
  name: string;
  subtitle: string;
  description: string;
  creator: ObjectId | IUser;
  users: [] | ObjectId[] | IUser[];
  posts: [] | ObjectId[] | IPost[];
  membersQuantity?: number;
  postsQuantity?: number;
  icon?: string;
}

interface LoginModalState {
  loginModalVisible: boolean;
}

interface AddCommunityModalState {
  addCommunityModalVisible: boolean;
}

interface ChangeIconModalState {
  changeIconModalVisible: boolean;
}

interface CurrentSubredditState {
  currentSubreddit: ICommunity;
}

interface SubredditsState {
  subreddits: [] | ICommunity[];
}

interface UserState {
  user: IUser;
}

// interface UserAction {
//   type: string;
//   user: IUser | null;
// }

// type DispatchUser = (args: UserAction) => UserAction;

// interface SignUpError {
//   location: string;
//   msg: string;
//   param: string;
//   value: string;
// }

declare module "*.jpg";
declare module "*.png";
declare module "*.gif";

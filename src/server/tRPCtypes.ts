import { Prisma } from "@prisma/client";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AuthRouterType } from "./api/routers/auth";
import type { FollowingRouterType } from "./api/routers/following";
import type { PostRouterType } from "./api/routers/post";

type RouterInput = inferRouterInputs<AuthRouterType>;
type RouterOutput = inferRouterOutputs<
  AuthRouterType & FollowingRouterType & PostRouterType
>;

export type GetAllSearchableUsersType = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    email: true;
    image: true;
    isVerified: true;
  };
}>[];

export type GetCurrentUserType = RouterOutput["getCurrentUser"];
export type GetUserByUsernameType = RouterOutput["getUserByUsername"];
export type FollowedPostsType = RouterOutput["getFollowedPosts"];
export type AvailableUsersType = RouterOutput["getAvailableFollows"];
export type NotificationsType = RouterOutput["getMyNotifications"];
export type AllCommentsType = RouterOutput["getAllComments"];
export type PostDetaiByIdType = RouterOutput["getPostDetailById"];

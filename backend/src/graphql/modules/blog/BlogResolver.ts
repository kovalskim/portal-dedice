import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { SignedUrl } from '@backend/graphql/modules/file/signedUrlType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

import { Blog } from './BlogType';
import { NewBlogInput } from './NewBlogInput';

@Resolver(() => Blog)
export class BlogResolver {
  @Query(() => [Blog], { nullable: true })
  async getAllArticles(@Ctx() { blogService }: CustomContext): Promise<Blog[]> {
    return await blogService.getAllArticles();
  }

  @Query(() => [Blog], { nullable: true })
  async getMostViewedArticles(
    @Arg('count') count: number,
    @Ctx() { blogService }: CustomContext,
  ): Promise<Blog[]> {
    return await blogService.getMostViewedArticles(count);
  }

  @Query(() => Blog, { nullable: true })
  async getBlogById(
    @Arg('id') id: number,
    @Ctx() { blogService }: CustomContext,
  ): Promise<Blog | null> {
    return await blogService.getBlogById(id);
  }

  @Mutation(() => Blog)
  @Authenticated()
  async createBlog(
    @Arg('data') input: NewBlogInput,
    @Ctx() { authUser, blogService }: AuthenticatedContext,
  ): Promise<Blog> {
    return await blogService.createBlog(authUser.id, input);
  }

  @Mutation(() => SignedUrl)
  @Authenticated()
  async getCoverImgSignedUrl(
    @Arg('filename') filename: string,
    @Arg('filetype') filetype: string,
    @Ctx()
    { blogService }: AuthenticatedContext,
  ): Promise<SignedUrl> {
    const url = await blogService.getCoverImgSignedUrl(filename, filetype);
    return { url };
  }

  @Mutation(() => Blog)
  @Authenticated()
  async updateBlog(
    @Arg('id') blogId: number,
    @Arg('data') input: NewBlogInput,
    @Ctx() { authUser, blogService }: AuthenticatedContext,
  ): Promise<Blog> {
    return await blogService.updateBlog(authUser.id, blogId, input);
  }

  @Mutation(() => Boolean)
  async increaseViewersCount(
    @Arg('id') blogId: number,
    @Ctx() { blogService }: CustomContext,
  ): Promise<boolean> {
    await blogService.increaseViewersCount(blogId);
    return true;
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async deleteBlog(
    @Arg('id') id: number,
    @Ctx() { authUser, blogService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await blogService.deleteBlog(authUser.id, id);
  }
}

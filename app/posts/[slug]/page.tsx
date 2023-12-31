// app/posts/[slug]/page.tsx
import { format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';
import { ImageViewer } from 'components/Post';
import Utterances from '@/components/utterances';
import Toc from '@/components/toc';
// import './markdown.css'

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  const Content = getMDXComponent(post.body.code);
  return (
    <main className="mx-auto max-w-5xl py-28 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[--color-primary]">{post.title}</h1>
        <time dateTime={post.date} className=" block m-4 text-xs">
          {format(parseISO(post.date), 'yyyy. MM. dd. a hh:mm')}
        </time>
      </div>
      <hr />
      <div className='flex gap-8'>
        <aside className='sticky top-[80px] hidden min-w-[240px] max-w-[260px] self-start lg:block'>
          <Toc url={post.url} source={post.body.raw} />
        </aside>
        <article className="markdown w-full">
          <Content components={{ ImageViewer }} />
        </article>
      </div>
      <Utterances />
    </main>
  );
};

export default PostLayout;

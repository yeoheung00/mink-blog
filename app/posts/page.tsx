'use client'

import { Post, allPosts } from '@/.contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'
import Link from 'next/link'
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

function PostCard(post: Post) {
    return (
        <div className="w-[calc(50%-0.5rem)]">
            <h2 className="mb-1 text-xl">
                <Link href={post.url} className="text-[var(--color-paragraph)]">
                    {post.title}
                </Link>
            </h2>
            <time dateTime={post.date} className="mb-2 block text-xs">
                {format(parseISO(post.date), 'yyyy. MM. d. a h : mm')}
            </time>
            <div className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0">{post.summary}</div>
        </div>
    )
}

export default function Page() {
    const [load, setLoad] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState("전체");
    const postsList = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
    const posts: Post[] = useMemo(() => {
        if (selectedTag === "전체") return postsList;
        const postsTemp = postsList.filter((post) => post.tag.split(" ").includes(selectedTag));
        return postsTemp;
    }, [selectedTag]);
    useEffect(() => {
        let tagArray: string[] = [];
        postsList.forEach((tags) => {
            tags.tag.split(" ").forEach((tag) => {
                if (!tagArray.includes(tag)) tagArray.push(tag);
            });
        });
        setTags(tagArray);
        setLoad(true);
    }, []);
    const handlerTagChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedTag(e.target.value);
    }
    return (
        <main className="w-full min-h-screen pt-20">
            <div className='max-w-5xl mx-auto'>
                <h2>태그</h2>
                <div className="w-fill flex gap-4 flex-wrap">
                    <div className="h-fit">
                        <input type='radio' id="all" value="전체" checked={selectedTag === "전체"} onChange={handlerTagChanged}></input><label htmlFor="all">전체</label>
                    </div>
                    {tags.map((tag, idx) => (
                        <div key={idx}><input type='radio' id={tag} value={tag} checked={selectedTag === tag} onChange={handlerTagChanged}></input><label htmlFor={tag}>{tag}</label></div>
                    ))}
                </div>
                <h2>글 목록</h2>
                <div className="flex flex-wrap gap-4">
                    {posts.map((post, idx) => (
                        <PostCard key={idx} {...post} />
                    ))}
                </div>
            </div>
        </main>
    )
}
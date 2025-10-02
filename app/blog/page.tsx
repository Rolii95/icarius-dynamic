import dynamic from 'next/dynamic'
const MdxProvider = dynamic(() => import('@/components/mdx-provider'), { ssr: false })

// ...keep generateStaticParams & generateMetadata as is...

export default async function BlogPost({ params }: { params: { slug: string }}) {
  const MDX = (await import(`@/content/posts/${params.slug}.mdx`)).default
  return (
    <MdxProvider>
      <article className="prose prose-invert max-w-none">
        <MDX />
      </article>
    </MdxProvider>
  )
}

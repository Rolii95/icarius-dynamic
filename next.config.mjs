import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const baseConfig = { experimental: { mdxRs: true }, pageExtensions: ['ts', 'tsx', 'md', 'mdx'] }
const withMDX = createMDX({ extension: /\.mdx?$/, options: { remarkPlugins:[remarkGfm], rehypePlugins:[rehypeSlug, [rehypeAutolinkHeadings, {behavior:'wrap'}]] } })
export default withMDX(baseConfig)

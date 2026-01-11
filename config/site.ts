export const siteConfig = {
  name: 'Luua Tools',
  description:
    'Free online tools for social media creators. Preview LinkedIn and X posts, check content readability, create code screenshots, and format text with Unicode styling.',
  url: 'https://tools.luua.io',
  mainAppUrl: '#',
  keywords: [
    'social media tools',
    'LinkedIn post preview',
    'Twitter post preview',
    'X post preview',
    'readability checker',
    'Flesch-Kincaid score',
    'code to image',
    'code screenshot generator',
    'text formatter',
    'Unicode bold text',
    'content creator tools',
    'free marketing tools',
  ],
  links: {
    twitter: '#',
    github: '#',
  },
}

export const toolsConfig = [
  {
    title: 'Post Previewer',
    description: 'See where LinkedIn truncates your post with accurate height-based preview',
    href: '/preview',
    icon: 'Eye',
    seo: {
      title: 'Free LinkedIn & X Post Previewer - Height-Based Truncation Preview',
      description:
        'Preview your LinkedIn posts with accurate height-based truncation. See exactly where "see more" cuts off your hook. Uses visual line count, not character limits.',
      keywords: [
        'LinkedIn post preview',
        'LinkedIn see more preview',
        'LinkedIn truncation',
        'LinkedIn hook preview',
        'social media preview tool',
        'Twitter post preview',
      ],
    },
  },
  {
    title: 'Viral Grade',
    description: 'Check if your writing is simple enough to go viral',
    href: '/viral-grade',
    icon: 'TrendingUp',
    seo: {
      title: 'Viral Grade - Free Readability Checker for Social Media',
      description:
        'Check if your content is readable enough to go viral. Uses Flesch-Kincaid grade level to analyze your writing. Aim for Grade 5 or below for maximum engagement.',
      keywords: [
        'readability checker',
        'Flesch-Kincaid calculator',
        'viral content checker',
        'reading level analyzer',
        'content readability score',
        'simple writing checker',
      ],
    },
  },
  {
    title: 'Code to Image',
    description: 'Turn code snippets into beautiful shareable images',
    href: '/code-to-image',
    icon: 'Code',
    seo: {
      title: 'Code to Image - Beautiful Code Screenshots for Social Media',
      description:
        'Create beautiful code screenshots for LinkedIn, Twitter, and more. Syntax highlighting, custom themes, and export to PNG. Perfect for developer content creators.',
      keywords: [
        'code to image',
        'code screenshot generator',
        'code snippet image',
        'carbon alternative',
        'ray.so alternative',
        'code image maker',
        'syntax highlighting image',
      ],
    },
  },
  {
    title: 'Smart Formatter',
    description: 'Bold, italic, and check whitespace density',
    href: '/formatter',
    icon: 'Type',
    seo: {
      title: 'Smart Text Formatter - Unicode Bold & Italic for Social Media',
      description:
        'Format text with Unicode bold and italic for LinkedIn and Twitter. Analyze whitespace density and avoid walls of text. Free formatting tool for creators.',
      keywords: [
        'Unicode bold text',
        'Unicode italic text',
        'LinkedIn text formatter',
        'social media text styling',
        'bold text generator',
        'whitespace analyzer',
      ],
    },
  },
] as const

export type ToolConfig = (typeof toolsConfig)[number]

export const faqsConfig = [
  {
    question: 'Are these tools really free?',
    answer:
      'Yes, all Luua Tools are 100% free to use. No sign-up required, no hidden fees. The tools run entirely in your browser.',
  },
  {
    question: 'Do you store my content or data?',
    answer:
      'No. All processing happens locally in your browser. We never send your content to any server, and nothing is stored or tracked.',
  },
  {
    question: 'What is the Post Previewer?',
    answer:
      'The Post Previewer lets you see exactly how your LinkedIn and Twitter/X posts will appear before publishing. It shows character counts and warns you if your hook might be cut off by the "see more" button.',
  },
  {
    question: 'How does the Viral Grade checker work?',
    answer:
      "Viral Grade uses the Flesch-Kincaid readability formula to calculate your text's grade level. Content at Grade 5 or below is considered 'viral ready' because it's easy for anyone to read and share.",
  },
  {
    question: 'Can I use the code images commercially?',
    answer:
      'Yes. Images you create with Code to Image are yours to use however you like - on social media, in presentations, documentation, or anywhere else.',
  },
  {
    question: 'What is Unicode formatting?',
    answer:
      "The Smart Formatter uses special Unicode characters that look like bold or italic text. Unlike HTML formatting, these work on platforms like LinkedIn and Twitter that don't support rich text.",
  },
] as const

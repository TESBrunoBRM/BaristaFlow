
import React from 'react';
import DOMPurify from 'dompurify';
import type { ContentBlock } from '../../types/blog';
import { FaFileDownload, FaExternalLinkAlt, FaQuoteLeft, FaInfoCircle, FaExclamationTriangle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

interface ContentBlockRendererProps {
    blocks: ContentBlock[];
}

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="space-y-6">
            {blocks.map((block) => (
                <div key={block.id} className="content-block">
                    {renderBlock(block)}
                </div>
            ))}
        </div>
    );
};

const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
        case 'text':
            return (
                <div
                    className="prose max-w-none text-gray-700 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
                />
            );

        case 'heading':
            const level = block.metadata?.level || 2;
            const sizeClass = level === 1 ? 'text-3xl' : level === 3 ? 'text-xl' : 'text-2xl';
            return React.createElement(`h${level}`, { className: `font-bold text-[#3A1F18] mt-6 mb-3 ${sizeClass}` }, block.content);

        case 'image':
            return (
                <figure className="my-6">
                    <img
                        src={block.content}
                        alt={block.metadata?.caption || 'Blog image'}
                        className="w-full rounded-xl shadow-md object-cover max-h-[500px]"
                    />
                    {block.metadata?.caption && (
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                            {block.metadata?.caption}
                        </figcaption>
                    )}
                </figure>
            );

        case 'video':
            // Simple embed for YouTube/Vimeo if content is a URL
            // block.content should be the URL
            const getEmbedUrl = (url: string) => {
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
                    return `https://www.youtube.com/embed/${videoId}`;
                }
                if (url.includes('vimeo.com')) {
                    const videoId = url.split('/').pop();
                    return `https://player.vimeo.com/video/${videoId}`;
                }
                return url;
            };

            return (
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg my-6 bg-black">
                    <iframe
                        src={getEmbedUrl(block.content)}
                        title="Video Player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );

        case 'file':


            return (
                <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg my-4 hover:bg-gray-100 transition-colors">
                    <div className="bg-amber-100 p-3 rounded-full mr-4 text-amber-600">
                        <FaFileDownload size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{block.metadata?.filename || 'Documento Adjunto'}</h4>
                        <p className="text-xs text-gray-500">{block.metadata?.mimeType || 'Archivo'}</p>
                    </div>
                    <a
                        href={block.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700"
                    >
                        Descargar
                    </a>
                </div>
            );

        case 'link':
            return (
                <a
                    href={block.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg my-4 text-blue-700 hover:bg-blue-100 transition-colors group"
                >
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                        <FaExternalLinkAlt size={16} />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold underline decoration-blue-300 underline-offset-2">
                            {block.metadata?.caption || block.content}
                        </span>
                        <p className="text-xs text-blue-400 mt-1 truncate">{block.content}</p>
                    </div>
                </a>
            );

        case 'separator':
            return <hr className="my-8 border-gray-200" />;

        case 'embed':
            // Secure Embed
            // The iframe is sandboxed for security.

            return (
                <div className="w-full my-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <iframe
                        src={block.content}
                        className="w-full min-h-[400px]"
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        title="Embedded Content"
                    />
                </div>
            );

        case 'list':
            const ListTag = block.metadata?.listType === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag className={`my-6 pl-6 space-y-2 ${block.metadata?.listType === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                    {(block.metadata?.items || []).map((item, i) => (
                        <li key={i} className="text-gray-700">{item}</li>
                    ))}
                </ListTag>
            );

        case 'quote':
            return (
                <blockquote className="my-8 pl-6 border-l-4 border-amber-500 italic text-gray-700 text-lg bg-gray-50 py-4 pr-4 rounded-r-lg">
                    <div className="flex gap-2">
                        <FaQuoteLeft className="text-amber-300 shrink-0 mt-1" size={24} />
                        <div>
                            <p className="mb-2">{block.content}</p>
                            {block.metadata?.author && (
                                <cite className="block text-sm text-gray-500 font-normal not-italic text-right">
                                    — {block.metadata.author}
                                </cite>
                            )}
                        </div>
                    </div>
                </blockquote>
            );

        case 'callout':
            const calloutStyles = {
                info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: FaInfoCircle, iconColor: 'text-blue-500' },
                warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: FaExclamationTriangle, iconColor: 'text-orange-500' },
                tip: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: FaLightbulb, iconColor: 'text-green-500' },
                success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: FaCheckCircle, iconColor: 'text-emerald-500' }
            };
            const type = block.metadata?.calloutType || 'info';
            const style = calloutStyles[type] || calloutStyles.info;
            const Icon = style.icon;

            return (
                <div className={`my-6 p-4 rounded-lg border ${style.bg} ${style.border} flex gap-3`}>
                    <Icon className={`shrink-0 mt-0.5 ${style.iconColor}`} size={20} />
                    <div className={`text-sm ${style.text}`}>
                        {block.content}
                    </div>
                </div>
            );

        default:
            return <p className="text-red-500 font-mono text-xs">Unknown block type: {block.type}</p>;
    }
};



export default ContentBlockRenderer;

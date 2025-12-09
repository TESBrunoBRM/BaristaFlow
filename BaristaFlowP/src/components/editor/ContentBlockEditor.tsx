import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ContentBlock, BlockType } from '../../types/blog';
import { FaTrash, FaArrowUp, FaArrowDown, FaImage, FaVideo, FaFont, FaHeading, FaCode, FaGripLines, FaFile, FaLink, FaSpinner, FaListUl, FaQuoteRight, FaExclamationCircle } from 'react-icons/fa';

interface ContentBlockEditorProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({ blocks, onChange }) => {

    // Helper to add a new block
    const addBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: uuidv4(),
            type,
            content: '',
            metadata: type === 'heading' ? { level: 2 } : {}
        };
        onChange([...blocks, newBlock]);
    };

    // Helper to update a block
    const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
        const newBlocks = blocks.map(block =>
            block.id === id ? { ...block, ...updates } : block
        );
        onChange(newBlocks);
    };

    const updateMetadata = (id: string, metadataUpdates: any) => {
        const newBlocks = blocks.map(block =>
            block.id === id ? { ...block, metadata: { ...block.metadata, ...metadataUpdates } } : block
        );
        onChange(newBlocks);
    }

    // Remote block
    const removeBlock = (id: string) => {
        if (window.confirm('¿Eliminar este bloque?')) {
            onChange(blocks.filter(b => b.id !== id));
        }
    };

    // Move block
    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    // Helper to convert file to Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // State for uploading status (simple map of blockId -> boolean)
    const [uploading, setUploading] = React.useState<Record<string, boolean>>({});

    const handleFileUpload = async (blockId: string, file: File) => {
        try {
            console.log('[DEBUG] handleFileUpload called for block:', blockId);
            setUploading(prev => ({ ...prev, [blockId]: true }));

            // Convert to Base64 instead of uploading
            const base64String = await fileToBase64(file);
            console.log('[DEBUG] File converted to Base64');

            // Update block content with Base64 string
            updateBlock(blockId, { content: base64String });
            // Update metadata with filename
            updateMetadata(blockId, {
                filename: file.name,
                mimeType: file.type
            });
        } catch (error: any) {
            console.error("Conversion failed:", error);
            alert(`Error al procesar archivo: ${error.message}`);
        } finally {
            console.log('[DEBUG] Clearing upload state for block:', blockId);
            setUploading(prev => ({ ...prev, [blockId]: false }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div key={block.id} className="relative group bg-white border border-gray-200 rounded-xl p-4 shadow-xs transition-shadow hover:shadow-md">
                        {/* Editor Controls Overlay (Right side) */}
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg z-10">
                            <button
                                type="button"
                                onClick={() => moveBlock(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 text-gray-400 hover:text-amber-600 disabled:opacity-30"
                                title="Subir"
                            >
                                <FaArrowUp size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveBlock(index, 'down')}
                                disabled={index === blocks.length - 1}
                                className="p-1.5 text-gray-400 hover:text-amber-600 disabled:opacity-30"
                                title="Bajar"
                            >
                                <FaArrowDown size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeBlock(block.id)}
                                className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded ml-1"
                                title="Eliminar"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>

                        {/* Block Content Inputs */}
                        <div className="pr-12">
                            {/* Label for Block Type */}
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {getBlockIcon(block.type)}
                                <span>{getBlockLabel(block.type)}</span>
                            </div>

                            {/* Inputs based on type */}
                            {block.type === 'heading' && (
                                <div className="flex gap-2">
                                    <select
                                        value={block.metadata?.level || 2}
                                        onChange={(e) => updateMetadata(block.id, { level: parseInt(e.target.value) })}
                                        className="p-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value={1}>H1</option>
                                        <option value={2}>H2</option>
                                        <option value={3}>H3</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="Escribe el título..."
                                        className="w-full p-2 text-xl font-bold border-b-2 border-transparent focus:border-amber-500 outline-none placeholder-gray-300"
                                    />
                                </div>
                            )}

                            {block.type === 'text' && (
                                <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    placeholder="Escribe tu contenido aquí..."
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px] resize-y"
                                />
                            )}

                            {block.type === 'image' && (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                            placeholder="URL de la imagen (https://...)"
                                            className="grow p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                        />
                                        <label className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap">
                                            <FaImage className="text-gray-600" />
                                            <span className="text-sm font-semibold">Subir</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(block.id, file);
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {uploading[block.id] && (
                                        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                            <FaSpinner className="animate-spin text-amber-600" size={24} />
                                        </div>
                                    )}

                                    {block.content && !uploading[block.id] && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img src={block.content} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={block.metadata?.caption || ''}
                                        onChange={(e) => updateMetadata(block.id, { caption: e.target.value })}
                                        placeholder="Descripción / Pie de foto (opcional)"
                                        className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-xs text-center text-gray-500"
                                    />
                                </div>
                            )}

                            {block.type === 'video' && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="URL del video (YouTube, Vimeo, MP4...)"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                    {block.content && (
                                        <p className="text-xs text-blue-500">
                                            * Se generará un reproductor seguro automáticamente.
                                        </p>
                                    )}
                                </div>
                            )}

                            {block.type === 'file' && (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                            placeholder="URL del enlace (https://github.com/...)"
                                            className="grow p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                        />
                                        <label className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                                            <FaFile className="text-gray-600" />
                                            <span className="text-sm font-semibold">Subir</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(block.id, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={block.metadata?.filename || ''}
                                        onChange={(e) => updateMetadata(block.id, { filename: e.target.value })}
                                        placeholder="Nombre del archivo para mostrar"
                                        className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                                    />
                                    {uploading[block.id] && <p className="text-xs text-amber-600 animate-pulse">Subiendo archivo...</p>}
                                </div>
                            )}

                            {block.type === 'link' && (
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="URL del enlace (https://github.com/...)"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono text-blue-600"
                                    />
                                    <input
                                        type="text"
                                        value={block.metadata?.caption || ''}
                                        onChange={(e) => updateMetadata(block.id, { caption: e.target.value })}
                                        placeholder="Texto del enlace (ej. 'Ver Repositorio', 'Fuente Original')"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                            )}

                            {block.type === 'embed' && (
                                <div className="space-y-3">
                                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 mb-2">
                                        <strong>Nota de Seguridad:</strong> El contenido será sanitizado y ejecutado en un entorno restringido (sandbox).
                                    </div>
                                    <input
                                        type="text"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="Pegar URL del Embed (ej. Google Forms, Slides...)"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm"
                                    />
                                </div>
                            )}

                            {block.type === 'list' && (
                                <div className="space-y-3">
                                    <div className="flex gap-4 mb-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`list-type-${block.id}`}
                                                checked={block.metadata?.listType !== 'ordered'}
                                                onChange={() => updateMetadata(block.id, { listType: 'bullet' })}
                                                className="text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">Viñetas</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`list-type-${block.id}`}
                                                checked={block.metadata?.listType === 'ordered'}
                                                onChange={() => updateMetadata(block.id, { listType: 'ordered' })}
                                                className="text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">Numerada</span>
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        {(block.metadata?.items || []).map((item, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <span className="text-gray-400 text-sm w-6 text-right">
                                                    {block.metadata?.listType === 'ordered' ? `${i + 1}.` : '•'}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...(block.metadata?.items || [])];
                                                        newItems[i] = e.target.value;
                                                        updateMetadata(block.id, { items: newItems });
                                                    }}
                                                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                                    placeholder={`Elemento ${i + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newItems = (block.metadata?.items || []).filter((_, idx) => idx !== i);
                                                        updateMetadata(block.id, { items: newItems });
                                                    }}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newItems = [...(block.metadata?.items || []), ''];
                                                updateMetadata(block.id, { items: newItems });
                                            }}
                                            className="ml-8 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                        >
                                            + Agregar elemento
                                        </button>
                                    </div>
                                </div>
                            )}

                            {block.type === 'quote' && (
                                <div className="space-y-3">
                                    <textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="Escribe la cita..."
                                        className="w-full p-3 border-l-4 border-amber-500 bg-gray-50 rounded-r-lg focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px] italic"
                                    />
                                    <input
                                        type="text"
                                        value={block.metadata?.author || ''}
                                        onChange={(e) => updateMetadata(block.id, { author: e.target.value })}
                                        placeholder="Autor / Fuente"
                                        className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm text-right text-gray-500"
                                    />
                                </div>
                            )}

                            {block.type === 'callout' && (
                                <div className="space-y-3">
                                    <select
                                        value={block.metadata?.calloutType || 'info'}
                                        onChange={(e) => updateMetadata(block.id, { calloutType: e.target.value })}
                                        className="p-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    >
                                        <option value="info">ℹ️ Información</option>
                                        <option value="warning">⚠️ Advertencia</option>
                                        <option value="tip">💡 Consejo</option>
                                        <option value="success">✅ Éxito</option>
                                    </select>
                                    <textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="Contenido del aviso..."
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px] ${block.metadata?.calloutType === 'warning' ? 'bg-orange-50 border-orange-200' :
                                            block.metadata?.calloutType === 'tip' ? 'bg-green-50 border-green-200' :
                                                block.metadata?.calloutType === 'success' ? 'bg-emerald-50 border-emerald-200' :
                                                    'bg-blue-50 border-blue-200'
                                            }`}
                                    />
                                </div>
                            )}

                            {block.type === 'separator' && (
                                <div className="flex items-center justify-center py-4">
                                    <hr className="w-full border-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Block Controls */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-wrap justify-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <p className="w-full text-center text-xs text-gray-400 font-bold uppercase mb-2">Agregar Bloque de Contenido</p>

                <AddButton onClick={() => addBlock('heading')} icon={FaHeading} label="Título" />
                <AddButton onClick={() => addBlock('text')} icon={FaFont} label="Texto" />
                <AddButton onClick={() => addBlock('image')} icon={FaImage} label="Imagen" />
                <AddButton onClick={() => addBlock('video')} icon={FaVideo} label="Video" />
                <AddButton onClick={() => addBlock('file')} icon={FaFile} label="Archivo" />
                <AddButton onClick={() => addBlock('link')} icon={FaLink} label="Enlace" />
                <AddButton onClick={() => addBlock('list')} icon={FaListUl} label="Lista" />
                <AddButton onClick={() => addBlock('quote')} icon={FaQuoteRight} label="Cita" />
                <AddButton onClick={() => addBlock('callout')} icon={FaExclamationCircle} label="Aviso" />
                <AddButton onClick={() => addBlock('embed')} icon={FaCode} label="Embed" />
                <AddButton onClick={() => addBlock('separator')} icon={FaGripLines} label="Separador" />
            </div>
        </div>
    );
};

const AddButton = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow-md hover:border-amber-300 text-gray-700 hover:text-amber-700 transition-all text-sm font-medium"
    >
        <Icon className="text-amber-500" />
        {label}
    </button>
);

const getBlockLabel = (type: BlockType) => {
    switch (type) {
        case 'text': return 'Párrafo de Texto';
        case 'heading': return 'Título';
        case 'image': return 'Imagen de Multimedia';
        case 'video': return 'Video Externo';
        case 'file': return 'Archivo Adjunto';
        case 'link': return 'Enlace Externo';
        case 'list': return 'Lista';
        case 'quote': return 'Cita Destacada';
        case 'callout': return 'Aviso / Nota';
        case 'embed': return 'Embed Seguro';
        case 'separator': return 'Separador Visual';
        default: return type;
    }
};

const getBlockIcon = (type: BlockType) => {
    switch (type) {
        case 'heading': return <FaHeading />;
        case 'image': return <FaImage />;
        case 'video': return <FaVideo />;
        case 'file': return <FaFile />;
        case 'link': return <FaLink />;
        case 'list': return <FaListUl />;
        case 'quote': return <FaQuoteRight />;
        case 'callout': return <FaExclamationCircle />;
        case 'embed': return <FaCode />;
        case 'separator': return <FaGripLines />;
        default: return <FaFont />;
    }
}

export default ContentBlockEditor;

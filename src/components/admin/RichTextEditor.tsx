import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Minus, 
  Eye, 
  Code, 
  Edit3,
  Upload
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your article or message here...',
  minHeight = '320px'
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'split'>('visual');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef(false);

  // Sync value to editor DOM when value changes externally (e.g. loading an article or resetting)
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Set initial content and default paragraph separator on mount / viewMode switch
  useEffect(() => {
    if (editorRef.current && (viewMode === 'visual' || viewMode === 'split')) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch (err) {
        // Fallback for browsers that don't support defaultParagraphSeparator
      }
    }
  }, [viewMode]);

  // Execute formatting command in contentEditable
  const executeCommand = useCallback((command: string, arg?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleHeading = (tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch (err) {
        // ignore
      }
    }
  };

  const handleInsertImage = () => {
    if (!imgUrl) return;
    const html = `
      <figure class="my-6 rounded-2xl overflow-hidden border border-[#E6E1D8] bg-[#FAF8F5]">
        <img src="${imgUrl}" alt="${imgCaption || 'Article Image'}" class="w-full h-auto max-h-[480px] object-cover" />
        ${imgCaption ? `<figcaption class="p-3 text-center text-xs text-[#5C6672] bg-[#F4EFE6] border-t border-[#ECE7DE] font-sans">${imgCaption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    executeCommand('insertHTML', html);
    setImgUrl('');
    setImgCaption('');
    setShowImageModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImgUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#8C6D40] underline hover:text-[#554228] font-medium">${linkText || linkUrl}</a>`;
    executeCommand('insertHTML', html);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  const wordCount = value ? value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = value ? value.replace(/<[^>]*>/g, '').length : 0;

  return (
    <div className="border border-[#D9D2C4] rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Formatting Toolbar */}
      <div className="bg-[#FAF8F5] border-b border-[#ECE7DE] p-2 flex flex-wrap items-center justify-between gap-1.5 text-[#1E232A]">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text formatting - onMouseDown preventDefault prevents losing cursor selection */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#D9D2C4] mx-1" />

          {/* Headings */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleHeading('h2')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors font-bold text-xs cursor-pointer"
            title="Large Heading (H2)"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleHeading('h3')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors font-bold text-xs cursor-pointer"
            title="Subheading (H3)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleHeading('h4')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors font-bold text-xs cursor-pointer"
            title="Small Heading (H4)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleHeading('p')}
            className="px-2 py-1 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors text-xs font-medium cursor-pointer"
            title="Paragraph"
          >
            Paragraph
          </button>

          <div className="w-px h-5 bg-[#D9D2C4] mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleHeading('blockquote')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Blockquote (Quote Scripture/Statement)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Divider Line"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#D9D2C4] mx-1" />

          {/* Insert Media / Links */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#554228] border border-[#EADFCB] text-xs font-semibold transition-colors cursor-pointer"
            title="Insert In-Article Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Add Image</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="p-1.5 rounded-lg hover:bg-[#EFEAE1] text-[#4A5568] hover:text-[#1E232A] transition-colors cursor-pointer"
            title="Insert Hyperlink"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1 bg-[#EFEAE1] p-0.5 rounded-lg border border-[#D9D2C4]">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'visual' ? 'bg-white text-[#1E232A] shadow-xs' : 'text-[#6C7785] hover:text-[#1E232A]'
            }`}
            title="Visual Editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors hidden sm:block cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-[#1E232A] shadow-xs' : 'text-[#6C7785] hover:text-[#1E232A]'
            }`}
            title="Split Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'code' ? 'bg-white text-[#1E232A] shadow-xs' : 'text-[#6C7785] hover:text-[#1E232A]'
            }`}
            title="HTML Source Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 flex flex-col md:flex-row min-h-[300px]" style={{ minHeight }}>
        {/* Visual / WYSIWYG Content Area */}
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={`flex-1 p-5 text-[#1E232A] bg-white focus:outline-hidden overflow-y-auto leading-relaxed space-y-4 font-serif text-[16px] selection:bg-[#EADFCB] ${
              viewMode === 'split' ? 'border-r border-[#ECE7DE] md:w-1/2' : 'w-full'
            }`}
            style={{
              minHeight: '300px',
            }}
            data-placeholder={placeholder}
          />
        )}

        {/* HTML Source Code Mode */}
        {viewMode === 'code' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs text-[#1E232A] bg-[#FAF8F5] focus:outline-hidden resize-none leading-5"
            placeholder="<p>Write raw HTML here...</p>"
          />
        )}

        {/* Live Reader Preview in Split Mode */}
        {viewMode === 'split' && (
          <div className="hidden md:block md:w-1/2 p-5 bg-[#FAF8F5] overflow-y-auto">
            <div className="text-xs uppercase tracking-wider text-[#8C6D40] font-semibold mb-3">
              Live Reader Preview
            </div>
            <div 
              className="text-[#1E232A] leading-relaxed space-y-4 font-serif text-[15px]"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-[#8C97A4] italic">Start typing to see live article preview...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Footer Word & Character Count Bar */}
      <div className="bg-[#FAF8F5] border-t border-[#ECE7DE] px-4 py-2 flex items-center justify-between text-xs text-[#717E8C]">
        <div>
          <span>{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>{charCount} characters</span>
        </div>
        <div className="text-[#8C6D40] font-medium">
          Rich Text Formatting Active
        </div>
      </div>

      {/* Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-[#1E232A] font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#8C6D40]" />
              <span>Insert Image into Article</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Upload Image from Device
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 border border-dashed border-[#554228]/50 rounded-xl bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#554228] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (JPG, PNG, WebP)</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-[#ECE7DE] flex-1" />
                <span className="text-xs text-[#8C97A4] font-medium">OR PASTE URL</span>
                <div className="h-px bg-[#ECE7DE] flex-1" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Image Web URL
                </label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                />
              </div>

              {imgUrl && (
                <div className="relative rounded-xl overflow-hidden border border-[#D9D2C4] max-h-36">
                  <img src={imgUrl} alt="Preview" className="w-full h-36 object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Image Caption (Optional)
                </label>
                <input
                  type="text"
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  placeholder="e.g. Masagana youth enjoying the hiking devotional"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C6672] hover:text-[#1E232A] bg-white border border-[#D9D2C4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  disabled={!imgUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1C2026] hover:bg-black disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-[#1E232A] font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#8C6D40]" />
              <span>Insert Web Link</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ChurchofJesusChrist.org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Link Text / Label
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Read full Come, Follow Me lesson"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C6672] hover:text-[#1E232A] bg-white border border-[#D9D2C4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  disabled={!linkUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1C2026] hover:bg-black disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

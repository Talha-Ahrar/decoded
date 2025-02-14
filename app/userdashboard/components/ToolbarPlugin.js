import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createQuoteNode } from '@lexical/rich-text';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200">
      {/* Text Formatting */}
      <div className="flex gap-1 mr-4">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className="p-2 rounded hover:bg-gray-100"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className="p-2 rounded hover:bg-gray-100"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          className="p-2 rounded hover:bg-gray-100"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className="p-2 rounded hover:bg-gray-100"
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 mr-4">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          className="p-2 rounded hover:bg-gray-100"
          title="Left Align"
        >
          ←
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          className="p-2 rounded hover:bg-gray-100"
          title="Center Align"
        >
          ↔
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          className="p-2 rounded hover:bg-gray-100"
          title="Right Align"
        >
          →
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
          className="p-2 rounded hover:bg-gray-100"
          title="Justify"
        >
          ↔↔
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 mr-4">
        <button
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
          className="p-2 rounded hover:bg-gray-100"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
          className="p-2 rounded hover:bg-gray-100"
          title="Numbered List"
        >
          1.
        </button>
        <button
          onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND)}
          className="p-2 rounded hover:bg-gray-100"
          title="Remove List"
        >
          ⌫
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 mr-4">
        <select
          onChange={(e) => formatHeading(e.target.value)}
          className="p-2 rounded border border-gray-200 hover:bg-gray-100"
        >
          <option value="">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>
      </div>

      {/* Quote */}
      <button
        onClick={formatQuote}
        className="p-2 rounded hover:bg-gray-100"
        title="Quote"
      >
        
      </button>

      {/* Undo/Redo */}
      <div className="flex gap-1 ml-auto">
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
          className="p-2 rounded hover:bg-gray-100"
          title="Undo"
        >
          ↺
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND)}
          className="p-2 rounded hover:bg-gray-100"
          title="Redo"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
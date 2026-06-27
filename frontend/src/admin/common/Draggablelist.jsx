/**
 * DraggableList.jsx  –  src/admin/common/DraggableList.jsx
 *
 * Two exports:
 *
 *   <DraggableTagList>   – flat string array (stories, languages, expertise, achievements)
 *   <DraggableFAQList>   – array of { question, answer } objects
 *
 * Both support HTML5 drag-to-reorder with no extra dependencies.
 */

import { useRef } from "react";
import "./DraggableList.css";

/* ─────────────────────────────────────────────
   SHARED HOOK: drag-to-reorder logic
───────────────────────────────────────────── */
function useDragReorder(items, onChange) {
  const dragIndex = useRef(null);

  const onDragStart = (i) => { dragIndex.current = i; };

  const onDragOver = (e, i) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const updated = [...items];
    const dragged = updated.splice(dragIndex.current, 1)[0];
    updated.splice(i, 0, dragged);
    dragIndex.current = i;
    onChange(updated);
  };

  const onDragEnd = () => { dragIndex.current = null; };

  return { onDragStart, onDragOver, onDragEnd };
}

/* ─────────────────────────────────────────────
   DRAGGABLE TAG LIST
   Props:
     items    : string[]
     onChange : (newItems: string[]) => void
───────────────────────────────────────────── */
export function DraggableTagList({ items = [], onChange }) {
  const { onDragStart, onDragOver, onDragEnd } = useDragReorder(items, onChange);

  const remove = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    onChange(updated);
  };

  if (!items.length) return null;

  return (
    <ul className="admin-tag-list">
      {items.map((item, i) => (
        <li
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDragEnd={onDragEnd}
          className="admin-tag-draggable"
          title="Drag to reorder"
        >
          <span className="admin-tag-drag-handle">⠿</span>
          <span className="admin-tag-text">{item}</span>
          <span className="admin-tag-remove" onClick={() => remove(i)}>×</span>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────
   DRAGGABLE FAQ LIST
   Props:
     items    : { question: string, answer: string }[]
     onChange : (newItems) => void
───────────────────────────────────────────── */
export function DraggableFAQList({ items = [], onChange }) {
  const { onDragStart, onDragOver, onDragEnd } = useDragReorder(items, onChange);

  const remove = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    onChange(updated);
  };

  if (!items.length) return null;

  return (
    <div className="draggable-faq-list">
      {items.map((f, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDragEnd={onDragEnd}
          className="faq-item faq-item-draggable"
        >
          <span className="faq-drag-handle" title="Drag to reorder">⠿</span>
          <div className="faq-item-body">
            <strong>{f.question}</strong>
            <p>{f.answer}</p>
          </div>
          <button type="button" className="faq-remove-btn" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
    </div>
  );
}
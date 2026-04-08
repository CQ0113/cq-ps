function RichTextDisplay({ html, className = "" }) {
  if (!html) return null;

  return (
    <div
      className={`ql-editor-display ${className}`}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
}

export default RichTextDisplay;

import { CONTENT_SAFETY_COPY } from '../config/contentSafetyCopy.js';

function ContentSafetyNotice({
  variant = 'general',
  title,
  description,
  compact = false,
}) {
  const copy = CONTENT_SAFETY_COPY[variant] || CONTENT_SAFETY_COPY.general;

  return (
    <section className={`content-safety-notice ${compact ? 'compact' : ''}`}>
      <strong>{title || copy.title}</strong>
      <p>{description || copy.description}</p>
    </section>
  );
}

export default ContentSafetyNotice;

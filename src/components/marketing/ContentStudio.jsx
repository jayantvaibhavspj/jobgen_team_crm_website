import React, { useRef } from 'react';
import { Icon } from './Icons';

export default function ContentStudio({ state, showToast, openModal }) {
  const { studio, setStudio, preferences } = state;
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^(image|video)\//.test(file.type) || file.size > 100 * 1024 * 1024) {
      showToast('Choose an image or video under 100 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    setStudio(prev => ({
      ...prev,
      file,
      url,
      output: null
    }));
  };

  const handleRemoveFile = () => {
    if (studio.url) URL.revokeObjectURL(studio.url);
    setStudio(prev => ({
      ...prev,
      file: null,
      url: null,
      output: null
    }));
  };

  const handleGenerate = (isRegen = false) => {
    if (!studio.file || studio.loading) return;
    setStudio(prev => ({
      ...prev,
      loading: true,
      variant: isRegen ? prev.variant + 1 : prev.variant
    }));

    setTimeout(() => {
      const platform = studio.platform || preferences.platform;
      const tone = studio.tone || preferences.tone;
      const intros = {
        Professional: 'Better hiring starts with a clearer connection.',
        Friendly: 'Your next chapter could be closer than you think. ✨',
        Bold: 'Great talent deserves more than another application.',
        Inspirational: 'Every opportunity begins with someone believing in what’s possible.'
      };
      const hook = studio.variant % 2
        ? 'A fresh perspective can open the right doors.'
        : 'Let’s make the next opportunity count.';

      const output = {
        analysis: `${studio.file.type.startsWith('video') ? 'Video' : 'Image'} selected for ${platform}. A ${tone.toLowerCase()} voice with a people-first hiring message.`,
        caption: `${intros[tone] || intros.Professional}\n\nAt Jobgen.ai, we’re bringing people and possibilities together — helping teams find their next great hire and talent find a meaningful next step.${studio.notes ? '\n\n' + studio.notes : ''}\n\n${hook}${platform === 'LinkedIn' ? ' What would a better hiring experience look like for your team?' : ''}`,
        hashtags: platform === 'LinkedIn'
          ? '#JobgenAI #FutureOfWork #TalentAcquisition #Hiring'
          : '#JobgenAI #CareerGrowth #HiringMadeHuman #NewOpportunities #YourNextChapter',
        cta: 'Explore your next opportunity at Jobgen.ai.'
      };

      setStudio(prev => ({
        ...prev,
        loading: false,
        output
      }));
      showToast('Your AI-generated content is ready.');
    }, 900);
  };

  const handleCopy = async () => {
    if (!studio.output) return;
    const text = [studio.output.caption, studio.output.hashtags, studio.output.cta].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Content copied to clipboard.');
    } catch {
      showToast('Copied to clipboard.');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Creative Workspace</div>
          <h1>Content Studio</h1>
          <p className="subtitle">Turn your media into content that connects.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>

      <div className="two-col equal">
        <section className="card studio-form">
          <div className="card-head">
            <div>
              <h2>Start with your story</h2>
              <p>Upload media. Add context. Make it yours.</p>
            </div>
            <span className="badge">Creative workspace</span>
          </div>

          <div
            className="dropzone"
            onClick={() => !studio.file && fileInputRef.current?.click()}
            style={{ cursor: studio.file ? 'default' : 'pointer' }}
          >
            {studio.file ? (
              studio.file.type.startsWith('video') ? (
                <video className="preview" src={studio.url} controls></video>
              ) : (
                <img className="preview" src={studio.url} alt="Upload preview" />
              )
            ) : (
              <>
                <Icon name="upload" />
                <h3>Drop your image or video here</h3>
                <p>JPG, PNG, WebP, GIF or video · up to 100 MB</p>
                <button
                  type="button"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose a file
                </button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileUpload}
          />

          {studio.file && (
            <div className="upload-meta">
              <span>{studio.file.name}</span>
              <button className="btn small" onClick={handleRemoveFile}>Remove</button>
            </div>
          )}

          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="field">
              <label>Platform</label>
              <select
                value={studio.platform || preferences.platform}
                onChange={e => setStudio(prev => ({ ...prev, platform: e.target.value }))}
              >
                <option>LinkedIn</option>
                <option>Instagram</option>
                <option>Facebook</option>
              </select>
            </div>

            <div className="field">
              <label>Tone</label>
              <select
                value={studio.tone || preferences.tone}
                onChange={e => setStudio(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Bold</option>
                <option>Inspirational</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Extra notes</label>
            <textarea
              placeholder="What’s the story? Who’s it for? Any key details?"
              value={studio.notes}
              onChange={e => setStudio(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <button
            className="btn primary"
            style={{ width: '100%' }}
            onClick={() => handleGenerate(false)}
            disabled={!studio.file || studio.loading}
          >
            <Icon name="studio" /> {studio.loading ? 'Creating your content…' : 'Generate content from media'}
          </button>
          <p className="muted small-text" style={{ marginTop: '8px' }}>
            Local AI studio · files are stored locally in your browser.
          </p>
        </section>

        <section className="card output">
          <div className="card-head">
            <div>
              <h2>Your next great post</h2>
              <p>Ready to refine, copy and share.</p>
            </div>
            <span className="badge">AI-powered demo</span>
          </div>

          {studio.output ? (
            <div>
              <div className="analysis">
                <b>Creative direction</b><br />
                {studio.output.analysis}
              </div>

              <div className="field">
                <label>Caption</label>
                <textarea
                  rows={5}
                  value={studio.output.caption}
                  onChange={e => setStudio(prev => ({
                    ...prev,
                    output: { ...prev.output, caption: e.target.value }
                  }))}
                />
              </div>

              <div className="field">
                <label>Hashtags</label>
                <textarea
                  rows={2}
                  style={{ minHeight: '65px' }}
                  value={studio.output.hashtags}
                  onChange={e => setStudio(prev => ({
                    ...prev,
                    output: { ...prev.output, hashtags: e.target.value }
                  }))}
                />
              </div>

              <div className="field">
                <label>CTA</label>
                <input
                  value={studio.output.cta}
                  onChange={e => setStudio(prev => ({
                    ...prev,
                    output: { ...prev.output, cta: e.target.value }
                  }))}
                />
              </div>

              <div className="actions" style={{ marginTop: '16px' }}>
                <button
                  className="btn"
                  onClick={() => handleGenerate(true)}
                  disabled={studio.loading}
                >
                  ↻ Regenerate
                </button>
                <button className="btn primary" onClick={handleCopy}>
                  <Icon name="copy" /> Copy content
                </button>
              </div>
            </div>
          ) : (
            <div className="empty" style={{ padding: '60px 20px' }}>
              <Icon name="studio" />
              <h3>{studio.loading ? 'A little creative thinking…' : 'Your ideas, brought to life'}</h3>
              <p>Upload your media and generate a caption, hashtags and a clear call to action.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

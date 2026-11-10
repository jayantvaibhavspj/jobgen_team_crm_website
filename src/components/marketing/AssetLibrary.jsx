import React, { useRef } from 'react';
import { Icon } from './Icons';
import { uid } from '../../hooks/useMarketingState';

function formatSize(bytes) {
  if (!bytes) return '0 KB';
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function AssetLibrary({ state, showToast }) {
  const { assets, setAssets, assetTab, setAssetTab, assetSearch, setAssetSearch } = state;
  const fileInputRef = useRef(null);

  const count = type => assets.filter(a => type === 'All' || a.kind === type).length;
  const filtered = assets.filter(a => {
    const matchesTab = assetTab === 'All' || a.kind === assetTab;
    const matchesSearch = a.name.toLowerCase().includes(assetSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalUsed = assets.reduce((n, a) => n + (a.size || 0), 0);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(f => f.size <= 100 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      showToast('Oversized files (>100 MB) were skipped.');
    }

    const newAssets = validFiles.map(f => {
      const kind = f.type.startsWith('image') ? 'Images' : f.type.startsWith('video') ? 'Videos' : 'Documents';
      const previewUrl = URL.createObjectURL(f);
      return {
        id: uid(),
        name: f.name,
        size: f.size,
        type: f.type,
        kind,
        previewUrl
      };
    });

    setAssets(prev => [...prev, ...newAssets]);
    showToast(`${newAssets.length} asset(s) added.`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
      showToast('Asset deleted.');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Creative Storage</div>
          <h1>Asset Library</h1>
          <p className="subtitle">Your brand’s best work, all in one place.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => fileInputRef.current?.click()}>
            <Icon name="upload" /> Upload assets
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total assets</span>
            <span className="metric-icon"><Icon name="assets" /></span>
          </div>
          <strong>{assets.length}</strong>
          <small>Your creative collection</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Images</span>
            <span className="metric-icon"><Icon name="assets" /></span>
          </div>
          <strong>{count('Images')}</strong>
          <small>Visual stories</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Videos</span>
            <span className="metric-icon"><Icon name="studio" /></span>
          </div>
          <strong>{count('Videos')}</strong>
          <small>Stories in motion</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Documents</span>
            <span className="metric-icon"><Icon name="file" /></span>
          </div>
          <strong>{count('Documents')}</strong>
          <small>Resources and references</small>
        </div>
      </div>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          {['All', 'Images', 'Videos', 'Documents'].map(tab => (
            <button
              key={tab}
              className={`tab ${tab === assetTab ? 'active' : ''}`}
              onClick={() => setAssetTab(tab)}
            >
              {tab} <span style={{ opacity: 0.6 }}>{count(tab)}</span>
            </button>
          ))}
        </div>

        <div className="search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search assets"
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="asset-grid">
          {filtered.map(a => (
            <article key={a.id} className="card asset">
              <div className="asset-preview">
                {a.previewUrl ? (
                  a.kind === 'Images' ? (
                    <img src={a.previewUrl} alt={a.name} />
                  ) : a.kind === 'Videos' ? (
                    <video src={a.previewUrl} controls />
                  ) : (
                    <Icon name="file" />
                  )
                ) : (
                  <Icon name={a.kind === 'Documents' ? 'file' : 'assets'} />
                )}
              </div>

              <div className="asset-body">
                <div className="asset-name" title={a.name}>{a.name}</div>
                <div className="asset-meta">
                  <span>{a.kind}</span>
                  <span>{formatSize(a.size)}</span>
                </div>
                <div className="actions">
                  {a.previewUrl && (
                    <a
                      href={a.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn small"
                      style={{ textDecoration: 'none' }}
                    >
                      Open
                    </a>
                  )}
                  <button className="icon-btn" onClick={() => handleDelete(a.id)} title="Delete">
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="card">
          <div className="empty">
            <Icon name="assets" />
            <h3>No assets found</h3>
            <p>Upload brand images, videos and documents, or change your search.</p>
          </div>
        </section>
      )}

      <div className="storage">
        Local collection: {formatSize(totalUsed)} across {assets.length} files · 100 MB maximum per file
        <div className="storage-track">
          <i style={{ width: `${Math.min(100, (totalUsed / (1024 * 1024 * 100)) * 100)}%` }}></i>
        </div>
      </div>
    </div>
  );
}


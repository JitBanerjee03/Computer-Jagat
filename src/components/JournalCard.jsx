import React, { useState } from 'react';
import './styles/JournalCard.css'; // We'll create this CSS file

const JournalCard = ({ journal }) => {
  const [showPdf, setShowPdf] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleViewPdf = () => {
    setShowPdf(!showPdf);
    setIframeKey(prevKey => prevKey + 1);
  };

  return (
    <div className="journal-card">
      <div className="journal-content">
        <div className="journal-header">
          <h1 className="journal-title">{journal.title}</h1>
          {journal.author_name_text && (
            <p className="journal-authors">by {journal.author_name_text}</p>
          )}
        </div>
        
        <p className="journal-abstract">{journal.abstract}</p>
        
        <div className="journal-tags">
          <span className="language-tag">{journal.language}</span>
          {journal.keywords.split(', ').map((keyword, index) => (
            <span key={index} className="keyword-tag">{keyword}</span>
          ))}
        </div>
        
        <div className="journal-actions">
          <button 
            className={`view-pdf-btn ${showPdf ? 'active' : ''}`}
            onClick={handleViewPdf}
          >
            {showPdf ? (
              <>
                <i className="fas fa-eye-slash"></i> Hide Manuscript
              </>
            ) : (
              <>
                <i className="fas fa-eye"></i> View Manuscript
              </>
            )}
          </button>
          <a
            href={journal.manuscript_file}
            className="download-btn"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <i className="fas fa-download"></i> Download PDF
          </a>
        </div>
        
        {showPdf && (
          <div className="pdf-viewer-container">
            {journal.manuscript_file ? (
              <iframe 
                key={iframeKey}
                src={`${`${import.meta.env.VITE_BACKEND_DJANGO_URL}`+journal.manuscript_file}#view=fitH`}
                title="Journal Manuscript"
                className="pdf-iframe"
                onError={() => console.error('Failed to load PDF')}
              >
                <p>Your browser does not support iframes. 
                  <a href={journal.manuscript_file} download>Download PDF instead</a>
                </p>
              </iframe>
            ) : (
              <div className="pdf-error">
                <i className="fas fa-exclamation-triangle"></i> PDF file not available for viewing
              </div>
            )}
          </div>
        )}
        
        <div className="journal-footer">
          <span className="submission-date">
            <i className="fas fa-calendar-alt"></i> Submitted on: {new Date(journal.submission_date).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="journal-sidebar">
        <div className="sidebar-content">
          <h5 className="sidebar-title">
            <i className="fas fa-info-circle"></i> Submission Details
          </h5>
          <ul className="sidebar-details">
            <li>
              <i className="fas fa-tag"></i> 
              <strong>Status:</strong> 
              <span className={`status-badge ${journal.status.toLowerCase()}`}>
                {journal.status}
              </span>
            </li>
            <li>
              <i className="fas fa-book"></i> 
              <strong>Subject Area:</strong> {journal.subject_area_name}
            </li>
            {journal.supplementary_files && (
              <li>
                <i className="fas fa-paperclip"></i> 
                <strong>Supplementary Files:</strong> Available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JournalCard;
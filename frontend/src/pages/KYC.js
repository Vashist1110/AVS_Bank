import React, { useState } from 'react';
import './KYC.css';
import { useNavigate } from 'react-router-dom';

function KYC() {
  const [panFile, setPanFile] = useState(null);
  const [panStatus, setPanStatus] = useState('Pending');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoStatus, setPhotoStatus] = useState('Pending');
  const [signFile, setSignFile] = useState(null);
  const [signStatus, setSignStatus] = useState('Pending');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, JPEG files are allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handlePanUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setPanFile(file);
      setPanStatus('Uploaded');
    } else {
      setPanFile(null);
      setPanStatus('Pending');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setPhotoFile(file);
      setPhotoStatus('Uploaded');
    } else {
      setPhotoFile(null);
      setPhotoStatus('Pending');
    }
  };

  const handleSignUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSignFile(file);
      setSignStatus('Uploaded');
    } else {
      setSignFile(null);
      setSignStatus('Pending');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!panFile || !photoFile || !signFile || !firstName || !lastName) {
      setError('Please fill all fields and upload all documents.');
      return;
    }
    setSubmitted(true);
    setError('');
    setTimeout(() => {
      localStorage.setItem('kycStatus', 'completed');
      navigate('/user-dashboard');
    }, 1200);
    // Handle file uploads and data submission here
  };

  return (
    <div className="kyc-bg">
      <div className="kyc-card">
        <h2 className="kyc-title">KYC Verification</h2>
        <div className="kyc-documents-header">
          <span className="kyc-documents-title">KYC Documents</span>
          <span className="kyc-documents-user">
            <b>Applicant:</b> {firstName || 'First Name'} {lastName || 'Last Name'}
          </span>
        </div>
        <form className="kyc-form" onSubmit={handleSubmit}>
          <div className="kyc-documents-list">
            <div className="kyc-doc-row">
              <div className="kyc-doc-info">
                <span className="kyc-doc-label">PAN Card</span>
                <span className={`kyc-status ${panStatus === 'Pending' ? 'pending' : 'uploaded'}`}>
                  {panStatus}
                </span>
              </div>
              <div className="kyc-doc-upload">
                <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handlePanUpload} />
                <div className="kyc-file-constraints">Allowed: JPG, JPEG, PDF. Max size: 5MB.</div>
                {panFile && <span className="kyc-file-name">{panFile.name}</span>}
              </div>
            </div>
            <div className="kyc-doc-row">
              <div className="kyc-doc-info">
                <span className="kyc-doc-label">Photo</span>
                <span className={`kyc-status ${photoStatus === 'Pending' ? 'pending' : 'uploaded'}`}>
                  {photoStatus}
                </span>
              </div>
              <div className="kyc-doc-upload">
                <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handlePhotoUpload} />
                <div className="kyc-file-constraints">Allowed: JPG, JPEG, PDF. Max size: 5MB.</div>
                {photoFile && <span className="kyc-file-name">{photoFile.name}</span>}
              </div>
            </div>
          </div>
          <div className="improved-kyc-declaration">
            <h3 className="kyc-declaration-title">Declaration</h3>
            <p className="kyc-declaration-text">
              I hereby declare that the information provided in this form is accurate and complete. I confirm that any information is found incorrect and/or incomplete that leads a violation of regulations may initiate legal actions, and I accept that I am the responsible party for any and all charges, penalties and violations.
            </p>
            <div className="kyc-applicant">
              <label className="kyc-label">Name of the Applicant</label>
              <div className="kyc-name-fields">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="kyc-doc-row">
              <div className="kyc-doc-info">
                <span className="kyc-doc-label">Signature</span>
                <span className={`kyc-status ${signStatus === 'Pending' ? 'pending' : 'uploaded'}`}>
                  {signStatus}
                </span>
              </div>
              <div className="kyc-doc-upload">
                <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handleSignUpload} />
                <div className="kyc-file-constraints">Allowed: JPG, JPEG, PDF. Max size: 5MB.</div>
                {signFile && <span className="kyc-file-name">{signFile.name}</span>}
              </div>
            </div>
          </div>
          {error && <div className="kyc-error">{error}</div>}
          <button type="submit" className="kyc-submit-btn">I've finished</button>
          {submitted && <div className="kyc-success">KYC submitted successfully!</div>}
        </form>
      </div>
    </div>
  );
}

export default KYC;
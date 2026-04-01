import React, { useState } from 'react';
import { FiX, FiUpload, FiFileText, FiDownload, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const BulkUploadModal = ({ show, onClose, onSubmit, uploading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  if (!show) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        previewFile(selectedFile);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please upload a CSV file' });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        previewFile(selectedFile);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please upload a CSV file' });
      }
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').slice(0, 6);
      setPreview(lines);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onSubmit(file);
      setUploadStatus({ type: 'success', message: 'File uploaded successfully!' });
      setTimeout(() => {
        onClose();
        setFile(null);
        setPreview(null);
        setUploadStatus(null);
      }, 1500);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Name,Email,Phone,Domain\nJohn Doe,john@example.com,1234567890,Frontend Developer\nJane Smith,jane@example.com,0987654321,Backend Developer\nMike Johnson,mike@example.com,5551234567,DevOps Engineer";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiUpload className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bulk Upload Users</h3>
                <p className="text-green-100 text-sm">Import multiple users at once</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {uploadStatus && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {uploadStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
              <span className="text-sm">{uploadStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload CSV File
              </label>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                  ${dragActive
                    ? 'border-green-500 bg-green-50'
                    : file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
                  }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                  file ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {file ? (
                    <FiCheckCircle className={`w-8 h-8 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                  ) : (
                    <FiUpload className={`w-8 h-8 ${dragActive ? 'text-green-500' : 'text-gray-400'}`} />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {file ? 'File selected!' : 'Drag and drop your CSV file here, or click to select'}
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 cursor-pointer transition-all shadow-md hover:shadow-lg"
                >
                  <FiUpload size={16} />
                  Choose File
                </label>
                {file && (
                  <p className="mt-3 text-sm text-green-600 font-medium">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-2 font-medium transition-colors"
                >
                  <FiDownload size={14} />
                  Download CSV Template
                </button>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <FiInfo size={12} />
                  <span>Max 1000 rows</span>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {preview && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File Preview
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200 max-h-48 overflow-auto">
                  {preview.map((line, idx) => (
                    <div key={idx} className="text-xs font-mono text-gray-600 py-1.5 border-b border-gray-200 last:border-0">
                      {line}
                    </div>
                  ))}
                  {preview.length === 5 && (
                    <div className="text-xs text-gray-400 italic mt-1">...</div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiInfo className="text-blue-600" size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">File Format Requirements:</p>
                  <p className="text-xs text-blue-800">
                    • CSV file with headers: <strong>Name, Email, Phone, Domain</strong><br />
                    • Phone and Domain are optional<br />
                    • Users will receive email with login credentials (default password: Welcome@123)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!file || uploading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiFileText size={18} />
                    Upload & Process
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;

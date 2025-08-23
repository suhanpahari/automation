import React, { useState } from 'react';

const FileUploader = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onFileUpload(file);
            setFile(null);
        }
    };

    return (
        <div className="file-uploader">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
};

export default FileUploader;
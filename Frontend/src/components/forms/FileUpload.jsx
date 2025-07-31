import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image, Video, File } from 'lucide-react'

const FileUpload = ({ onFilesChange, maxFiles = 5, acceptedTypes = ['image/*', 'video/*'] }) => {
  const [files, setFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file'
    }))

    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map(f => f.file))
  }, [files, maxFiles, onFilesChange])

  const removeFile = (id) => {
    const updatedFiles = files.filter(f => f.id !== id)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map(f => f.file))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  })

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="h-6 w-6" />
      case 'video': return <Video className="h-6 w-6" />
      default: return <File className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-4">
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supports images and videos • Max {maxFiles} files • Max 10MB each
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((fileObj) => (
            <div key={fileObj.id} className="relative bg-white border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => removeFile(fileObj.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getFileIcon(fileObj.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {fileObj.preview && (
                <div className="mt-3">
                  <img
                    src={fileObj.preview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
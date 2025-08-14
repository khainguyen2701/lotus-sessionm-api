export const UploadFileSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
      description:
        'File to upload (PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, BMP, WEBP)',
    },
    folder: {
      type: 'string',
      description: 'Folder to upload file to',
      example: 'documents',
    },
  },
  required: ['file'],
};

export const UploadFileSchemaResponse = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Upload success status',
      example: true,
    },
    message: {
      type: 'string',
      description: 'Upload message',
      example: 'File uploaded successfully',
    },
    data: {
      type: 'object',
      description: 'File information',
      required: false,
      properties: {
        name: {
          type: 'string',
          description: 'File name',
          example: 'example.pdf',
        },
        path: {
          type: 'string',
          description: 'File path',
          example: 'documents/example.pdf',
        },
      },
    },
  },
};

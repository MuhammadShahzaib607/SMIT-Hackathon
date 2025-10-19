// File: utils/geminiImg.js

export function fileToGenerativePart(fileBuffer, mimeType) {
    const base64Data = fileBuffer.toString('base64');
    
    return {
        inlineData: {
            data: base64Data,
            mimeType
        },
    };
}
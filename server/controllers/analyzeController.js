// File: controllers/analyzeController.js

import { GoogleGenAI } from '@google/genai';
import { fileToGenerativePart } from '../utils/geminiImg.js'; 

// 🛑 FIX: Key ko seedha 'GEMINI_API_KEY' se uthaein. Agar yeh variable set nahi hoga, to error aayega.
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 

/**
 * Medical Report Image ko analyze karta hai.
 */
export const analyzeReport = async (req, res) => {
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error: Gemini API Key set nahi ki gayi hai.' 
        });
    }

    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ 
            success: false, 
            message: 'Image file nahi mili.' 
        });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const prompt = (
        "Aap aik medical expert hain. Yeh report ki tasveer hai. " +
        "Isko achhi tarah se analyze karein. Khaas tor par *abnormal values* " +
        "ko highlight karein. Iska poora tajziya *aasan Roman Urdu* mein likhein. " +
        "Jawab ko paragraphs aur headings mein structure karein."
    );

    try {
        const imagePart = fileToGenerativePart(fileBuffer, mimeType);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [
                { role: 'user', parts: [imagePart, { text: prompt }] }
            ]
        });
        
        res.status(200).json({
            success: true,
            analysisResult: response.text
        });

    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: "Your API Limit is exceeded" 
        });
    }
};

export const analyzeMemberReport = async (req, res) => {
    // 1. Zaroori IDs aur Data Extract karein
    const userId = req.user?.id; // Authentication token se
    const memberId = req.params.memberId; 
    const textPrompt = req.body.textPrompt || "Nayi report analyze karein."; 
    
    // Safety Checks
    if (!userId || !memberId) {
         return res.status(401).json({ success: false, message: 'Authentication ya Member ID missing hai.' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Server Error: Gemini API Key set nahi ki gayi hai.' });
    }
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'Report ki Image file zaroori hai.' });
    }
    
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    let analysisResult = '';

    try {
        // 2. Database se Member aur History Fetch karein
        const member = await FamilyMember.findOne({ 
            _id: memberId, 
            user: userId 
        });

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member nahi mila ya aapke paas access nahi hai.' });
        }
        
        // 3. Reports History ka Context Tayyar Karein
        let historyContext = 'Yeh is shakhs ki pichli reports hain:\n\n';
        if (member.reports && member.reports.length > 0) {
            member.reports.forEach((report, index) => {
                historyContext += `--- Report ${index + 1} (${new Date(report.uploadedAt).toLocaleDateString()}) ---\n`;
                historyContext += `${report.analysisText.substring(0, 300)}...\n\n`; // Pehle 300 characters hi context mein dein
            });
        } else {
            historyContext += 'Pichli koi report nahi mili.';
        }
        
        // 4. Final Prompt Tayyar Karein
        const finalPrompt = (
            `Aap aik medical expert hain. Aap ${member.name} ki reports analyze kar rahe hain. ` +
            `Yahan inki pichli reports ka data hai: \n\n${historyContext}\n\n` +
            `--- Nayi Report Analysis ---\n` +
            `Aapko is nai tasveer (image) ko achhi tarah se analyze karna hai. ` +
            `Khaas tor par *abnormal values* ko highlight karein aur pichle records (agar hain) se **muqabla** karein. ` +
            `User ki taraf se extra sawal: "${textPrompt}". ` +
            `Iska poora tajziya *aasan English mein likhein. Jawab ko headings aur bullet points mein structured rakhein.`
        );

        // 5. Gemini API Call
        const imagePart = fileToGenerativePart(fileBuffer, mimeType);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [
                { role: 'user', parts: [imagePart, { text: finalPrompt }] }
            ]
        });
        
        analysisResult = response.text; // Analysis result save karein

        // 6. DB Mein Nayi Report Save Karein
        const newReport = {
            uploadedAt: new Date(),
            analysisText: analysisResult,
            // imageURL: 'Yahan Cloudinary URL aayega agar aap use karte hain', 
        };
        
        member.reports.push(newReport);
        await member.save(); // Member document ko reports array ke saath save karein

        // 7. Success Response
        res.status(200).json({
            success: true,
            message: `${member.name} ki report analyze hokar save ho gayi hai.`,
            analysisResult: analysisResult,
            newReport: newReport, // Frontend ko update karne ke liye
        });

    } catch (error) {
        console.error('Analyze Member Report Error:', error.message);
        // User ko batayein ke masla kya hua, lekin limit ki ghalti tab tak na likhein jab tak confirm na ho
        res.status(500).json({ 
            success: false, 
            message: "AI analysis ya server operation ke dauran masla hua. Key ya limit check karein."
        });
    }
};

/**
 * [POST] /member/:memberId/chat
 * Member-specific text chat handle karta hai, pichli reports ka context use karte hue.
 */
export const chatWithMemberReports = async (req, res) => {
    const userId = req.user?.id;
    const memberId = req.params.memberId;
    const { textPrompt } = req.body; // Ab sirf textPrompt body se aayega

    // Safety Checks
    if (!userId || !memberId) {
         return res.status(401).json({ success: false, message: 'Authentication ya Member ID missing hai.' });
    }
    if (!textPrompt || textPrompt.trim() === '') {
         return res.status(400).json({ success: false, message: 'Text message zaroori hai.' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Server Error: Gemini API Key set nahi ki gayi hai.' });
    }

    try {
        // 1. Database se Member aur History Fetch karein
        const member = await FamilyMember.findOne({ 
            _id: memberId, 
            user: userId 
        });

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member nahi mila ya aapke paas access nahi hai.' });
        }
        
        // 2. Reports History ka Context Tayyar Karein (Wohi logic jo analyzeReport mein tha)
        let historyContext = `Aap ${member.name} ke baare mein baat kar rahe hain. Inki pichli reports ka data yeh hai: \n\n`;
        if (member.reports && member.reports.length > 0) {
            member.reports.forEach((report, index) => {
                // Short summary of previous reports (to save token space)
                historyContext += `--- Report ${index + 1} (${new Date(report.uploadedAt).toLocaleDateString()}) ---\n`;
                historyContext += `${report.analysisText.substring(0, 300)}...\n\n`; 
            });
        } else {
            historyContext += 'Pichli koi report nahi mili. Sirf general sawalon ka jawab dein.';
        }
        
        // 3. Final Contextual Prompt Tayyar Karein
        const finalPrompt = (
            `Aap aik helpful medical assistant hain. Aapke paas is shakhs ki history hai. ` +
            `History:\n\n${historyContext}\n\n` +
            `User ka sawal: "${textPrompt}". ` +
            `Is sawal ka jawab history ke context mein *aasan Roman Urdu* mein dein.`
        );

        // 4. Gemini API Call
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [
                { role: 'user', parts: [{ text: finalPrompt }] } // Ab sirf text part hai
            ]
        });
        
        // 5. Success Response
        res.status(200).json({
            success: true,
            analysisResult: response.text, // Jawab wapas karein
        });

    } catch (error) {
        console.error('Chat API Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: "Chat service ke dauran masla hua. Server logs check karein."
        });
    }
};
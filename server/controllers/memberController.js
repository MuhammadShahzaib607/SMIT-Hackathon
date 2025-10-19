import FamilyMember from '../models/FamilyMember.js';

// User ID authentication middleware se aayegi: req.user.id

/**
 * [POST] /api/member
 * Naya family member add karta hai aur usay login user se link karta hai.
 */
export const createFamilyMember = async (req, res) => {
    const userId = req.user._id; // Authentication middleware se aayi user ID
    const { name } = req.body; 
    console.log(userId, "===== User Id")

    if (!name || name.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'Member ka naam zaroori hai.' 
        });
    }

    try {
        const newMember = new FamilyMember({
            user: userId, // Current user ki ID
            name: name.trim(),
        });

        await newMember.save();

        res.status(201).json({
            success: true,
            message: `${newMember.name} successfully add ho gaya.`,
            member: newMember,
        });

    } catch (error) {
        console.error('Member Creation Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Member create karte waqt masla hua.' 
        });
    }
};

/**
 * [GET] /api/member
 * Login kiye hue user ke saare family members ki list deta hai.
 */
export const getFamilyMembers = async (req, res) => {
    const userId = req.user._id; // Login user ki ID
    try {
        // Sirf woh members fetch karein jinka 'user' field current userId se match karta ho.
        const members = await FamilyMember.find({ user: userId }).select('-reports'); // Reports array ko chota rakhne ke liye exclude kiya ja sakta hai

        if (!members || members.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Such Data Found in your DB'
            });
        }

        res.status(200).json({
            success: true,
            members: members,
        });

    } catch (error) {
        console.error('Fetch Members Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Members list fetch karte waqt masla hua.' 
        });
    }
};

/**
 * [DELETE] /api/member/:id
 * Kisi member ko delete karta hai. ID parameter mein member ki ID aayegi.
 * Yeh bhi check karega ki delete karne wala user hi uska owner hai.
 */
export const deleteFamilyMember = async (req, res) => {
    const userId = req.user._id;      // Login user ki ID
    const memberId = req.params.id; // URL parameter se member ki ID

    try {
        // Member ko find karke delete karein. Zaroori hai ki 'user' field current userId se match kare.
        const member = await FamilyMember.findOneAndDelete({ 
            _id: memberId,
            user: userId // 🛑 Security Check: Yahan ownership check ho rahi hai
        });

        if (!member) {
            // Ya to member ID ghalat hai, ya woh member current user ka nahi hai.
            return res.status(404).json({
                success: false,
                message: 'Member nahi mila ya aapke paas isay delete karne ka haq nahi hai.'
            });
        }

        res.status(200).json({
            success: true,
            message: `${member.name} successfully delete ho gaya.`,
        });

    } catch (error) {
        console.error('Delete Member Error:', error.message);
        // Agar ID format ghalat ho (e.g., Mongoose CastError)
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ success: false, message: 'Invalid Member ID format.' });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Member delete karte waqt masla hua.' 
        });
    }
};

// export const testing = (req, res)=> {
//     res.send("hello testing")
// }
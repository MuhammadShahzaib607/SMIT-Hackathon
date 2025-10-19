// File: FamilyDashboard.jsx (Cleaned & Focused CRUD Integration)

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaEye, FaUserMd, FaTimes, FaSpinner } from 'react-icons/fa';
import "./familyDashboard.scss"
import { Link } from 'react-router-dom';

// NOTE: Ensure your VITE_API_URL is correctly set in your .env file
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/member`; 

// Helper function to get the auth token
const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('token'); 
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
};

const FamilyDashboard = () => {
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [feedback, setFeedback] = useState(null); // For success/short messages

    // Removed: selectedMember state and handleSelect function to simplify the view.

    // 1. READ (GET /member) - Fetch all members
    const fetchMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getAuthHeaders(null),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                // Map the data, using MongoDB's _id as the key
                const membersList = data.members.map(m => ({
                    ...m,
                    // Temporary logic for lastReport, ideally this comes from the backend
                    lastReport: (m.reports && m.reports.length > 0) ? 'Recently' : 'N/A' 
                }));
                setMembers(membersList);
            } else if (res.status === 404) {
                setMembers([]);
            } else {
                setError(data.message || 'Members list fetch nahi ho saki. Token check karein.');
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError('Network Error: Server se connect nahi ho paya.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch members on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    // 2. CREATE (POST /member) - Add new member
    const handleSaveMember = async () => {
        if (!newMemberName.trim()) return;

        setIsModalOpen(false);
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getAuthHeaders('application/json'),
                body: JSON.stringify({ name: newMemberName.trim() }),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                const newMember = {
                    ...data.member,
                    lastReport: 'Just Added'
                };
                setMembers(prev => [...prev, newMember]);
                setNewMemberName('');
                setFeedback(data.message);
            } else {
                setError(data.message || 'Member add nahi ho saka.');
                setIsModalOpen(true); // Re-open modal on API failure
            }

        } catch (error) {
            console.error("Creation Error:", error);
            setError('Network Error: Member save nahi ho paya.');
            setIsModalOpen(true);
        } finally {
            setLoading(false);
            setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3s
        }
    };
    
    // 3. DELETE (DELETE /member/:id) - Delete a member
    const handleDelete = async (memberId, memberName) => {
        // if (!window.confirm(`Kya aap waqai ${memberName} ko delete karna chahte hain?`)) {
        //     return;
        // }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/${memberId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(null),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setMembers(prev => prev.filter(m => m._id !== memberId));
                setFeedback(data.message);
            } else {
                setError(data.message || 'Member delete nahi ho saka.');
            }
        } catch (error) {
            console.error("Deletion Error:", error);
            setError('Network Error: Member delete nahi ho paya.');
        } finally {
            setLoading(false);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    // Helper for modal open
    const handleAddClick = () => {
        setNewMemberName('');
        setIsModalOpen(true);
    };

    // --- Main Render ---
    return (
        <div className="family-dashboard-wrapper">
            
            <header className="dashboard-header">
                <h1 className="main-title">Family Health Hub <FaUserMd className="title-icon" /></h1>
                <p className="subtitle">Manage reports for all your family members.</p>
                
                <button className="add-member-btn" onClick={handleAddClick} disabled={loading}>
                    <FaPlus className="btn-icon" /> Create New Member
                </button>
            </header>

            {/* Loading, Error, and Success Feedback */}
            {loading && members.length === 0 && (
                <div className="loading-state">
                    <FaSpinner className="spinner rotating" />
                    <p>Loading family members...</p>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {feedback && <div className="success-message">{feedback}</div>}

            {/* Member List Section (READ) */}
            <section className="member-list-grid">
                {members.length > 0 ? (
                    members.map(member => (
                        <div key={member._id} className="member-card">
                            <h3 className="member-name">{member.name}</h3>
                            <p className="report-count">
                                {member.reports ? member.reports.length : 0} Reports Saved
                            </p>
                            <p className="last-update">Last Report: <strong>{member.lastReport}</strong></p>
                            
                            <div className="card-actions">
                                {/* Only keep Delete (Remove View/Analyze button to simplify) */}
                                <button className="delete-btn" onClick={() => handleDelete(member._id, member.name)} disabled={loading}>
                                    <FaTrashAlt /> Delete
                                </button>
                                <Link to={`/memberChat/${member._id}`}>
                                <button style={{backgroundColor: "green", color: "white", fontSize: "13px"}}>View Report</button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : !loading && !error && (
                    <div className="empty-state">
                        <p>No family members added yet. Click 'Create New Member' to start.</p>
                    </div>
                )}
            </section>
            
            {/* Modal for Adding New Member (CREATE) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Family Member</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)} disabled={loading}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="member-name">Member ka Pura Naam:</label>
                            <input
                                id="member-name"
                                type="text"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder="e.g., Salman Khan (Father)"
                                disabled={loading}
                            />
                            <button className="save-btn" onClick={handleSaveMember} disabled={loading || !newMemberName.trim()}>
                                {loading ? <FaSpinner className="rotating" /> : 'Save Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyDashboard;
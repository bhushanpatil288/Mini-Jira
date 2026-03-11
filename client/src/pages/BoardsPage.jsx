// ============================================================
// Boards Page
// ============================================================
// Shows all boards the user owns or is a member of.
// Provides a form to create new boards.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const BoardsPage = () => {
    const [boards, setBoards] = useState([]);
    const [boardName, setBoardName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch boards on mount
    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await API.get('/boards');
            setBoards(res.data);
        } catch (err) {
            setError('Failed to load boards');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!boardName.trim()) return;

        try {
            const res = await API.post('/boards', { name: boardName });
            setBoards([res.data, ...boards]); // Add new board to top of list
            setBoardName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create board');
        }
    };

    if (loading) return <div className="loading">Loading boards...</div>;

    return (
        <div className="boards-page">
            <h1>Your Boards</h1>

            {/* Create Board Form */}
            <form className="create-board-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name..."
                />
                <button type="submit" className="btn btn-primary">
                    + Create Board
                </button>
            </form>

            {error && <div className="error-msg">{error}</div>}

            {/* Board Cards Grid */}
            {boards.length === 0 ? (
                <div className="empty-state">
                    <p>No boards yet. Create your first board above!</p>
                </div>
            ) : (
                <div className="boards-grid">
                    {boards.map((board) => (
                        <div
                            key={board._id}
                            className="board-card"
                            onClick={() => navigate(`/boards/${board._id}`)}
                        >
                            <h3>{board.name}</h3>
                            <div className="board-meta">
                                Owner: {board.owner?.name || 'You'} ·{' '}
                                {board.members?.length || 0} member(s)
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardsPage;

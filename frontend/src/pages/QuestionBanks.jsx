import { useState, useEffect } from "react";
import api from "../utils/api";

export default function QuestionBanks() {
  const [activeTab, setActiveTab] = useState('my-banks'); // 'my-banks' or 'browse'
  const [myBanks, setMyBanks] = useState([]);
  const [publicBanks, setPublicBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);

  // Create bank form state
  const [bankForm, setBankForm] = useState({
    title: '',
    description: '',
    category: 'technical',
    difficulty: 'intermediate',
    isPublic: false,
    questions: []
  });

  // Add question form state
  const [questionForm, setQuestionForm] = useState({
    question: '',
    expectedAnswer: '',
    category: 'technical',
    difficulty: 'intermediate'
  });

  useEffect(() => {
    if (activeTab === 'my-banks') {
      fetchMyBanks();
    } else {
      fetchPublicBanks();
    }
  }, [activeTab]);

  const fetchMyBanks = async () => {
    try {
      const res = await api.get('/interview/question-banks/my-banks');
      setMyBanks(res.data.banks);
    } catch (err) {
      console.error('Failed to fetch my banks:', err);
    }
  };

  const fetchPublicBanks = async () => {
    try {
      const res = await api.get('/interview/question-banks/public');
      setPublicBanks(res.data.banks);
    } catch (err) {
      console.error('Failed to fetch public banks:', err);
    }
  };

  const createBank = async () => {
    if (!bankForm.title.trim()) return;

    setLoading(true);
    try {
      await api.post('/interview/question-banks/create', bankForm);
      setShowCreateModal(false);
      setBankForm({
        title: '',
        description: '',
        category: 'technical',
        difficulty: 'intermediate',
        isPublic: false,
        questions: []
      });
      fetchMyBanks();
    } catch (err) {
      console.error('Failed to create bank:', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestionToBank = async (bankId) => {
    if (!questionForm.question.trim() || !questionForm.expectedAnswer.trim()) return;

    try {
      await api.post(`/interview/question-banks/${bankId}/questions`, questionForm);
      setQuestionForm({
        question: '',
        expectedAnswer: '',
        category: 'technical',
        difficulty: 'intermediate'
      });
      fetchMyBanks();
    } catch (err) {
      console.error('Failed to add question:', err);
    }
  };

  const deleteBank = async (bankId) => {
    if (!confirm('Are you sure you want to delete this question bank?')) return;

    try {
      await api.delete(`/interview/question-banks/${bankId}`);
      fetchMyBanks();
    } catch (err) {
      console.error('Failed to delete bank:', err);
    }
  };

  const togglePublic = async (bankId, isPublic) => {
    try {
      await api.patch(`/interview/question-banks/${bankId}/visibility`, { isPublic });
      fetchMyBanks();
    } catch (err) {
      console.error('Failed to update visibility:', err);
    }
  };

  const renderStars = (difficulty) => {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const stars = levels[difficulty] || 2;

    return [1, 2, 3].map((star) => (
      <span
        key={star}
        style={{
          fontSize: '14px',
          color: star <= stars ? '#f59e0b' : '#374151'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div style={{ width: "100%", maxWidth: "1200px", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "36px",
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            📝 Custom Question Banks
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Create, manage, and share your own interview question collections
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          marginBottom: "32px",
          borderBottom: "1px solid rgba(71, 85, 105, 0.3)"
        }}>
          <button
            onClick={() => setActiveTab('my-banks')}
            style={{
              padding: "12px 24px",
              border: "none",
              background: activeTab === 'my-banks' ? "linear-gradient(135deg, #8b5cf6, #a855f7)" : "transparent",
              color: activeTab === 'my-banks' ? "white" : "#64748b",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: activeTab === 'my-banks' ? "600" : "400"
            }}
          >
            📚 My Banks ({myBanks.length})
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: "12px 24px",
              border: "none",
              background: activeTab === 'browse' ? "linear-gradient(135deg, #8b5cf6, #a855f7)" : "transparent",
              color: activeTab === 'browse' ? "white" : "#64748b",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: activeTab === 'browse' ? "600" : "400"
            }}
          >
            🌐 Browse Public ({publicBanks.length})
          </button>
        </div>

        {/* My Banks Tab */}
        {activeTab === 'my-banks' && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ color: "#f1f5f9", margin: 0 }}>
                My Question Banks
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                ➕ Create New Bank
              </button>
            </div>

            {myBanks.length === 0 ? (
              <div className="card" style={{
                padding: "60px",
                textAlign: "center",
                color: "#64748b"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📚</div>
                <h3 style={{ color: "#f1f5f9", marginBottom: "8px" }}>No question banks yet</h3>
                <p>Create your first question bank to organize interview questions!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {myBanks.map((bank) => (
                  <div key={bank._id} className="card" style={{ padding: "24px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px"
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: "#f1f5f9", margin: "0 0 8px 0" }}>
                          {bank.title}
                        </h3>
                        <p style={{ color: "#cbd5e1", margin: "0 0 12px 0", fontSize: "14px" }}>
                          {bank.description || "No description"}
                        </p>
                        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}>
                            {bank.category}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {renderStars(bank.difficulty)}
                            <span style={{ color: "#64748b", fontSize: "12px" }}>
                              {bank.difficulty}
                            </span>
                          </div>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {bank.questions?.length || 0} questions
                          </span>
                          {bank.isPublic && (
                            <span style={{
                              background: "rgba(16, 185, 129, 0.2)",
                              color: "#10b981",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}>
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                        <button
                          onClick={() => {
                            setSelectedBank(bank);
                            setShowBankModal(true);
                          }}
                          style={{
                            padding: "8px 16px",
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => togglePublic(bank._id, !bank.isPublic)}
                          style={{
                            padding: "8px 16px",
                            background: bank.isPublic ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                            color: bank.isPublic ? "#ef4444" : "#10b981",
                            border: `1px solid ${bank.isPublic ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          {bank.isPublic ? "🔒 Make Private" : "🌐 Make Public"}
                        </button>
                        <button
                          onClick={() => deleteBank(bank._id)}
                          style={{
                            padding: "8px 16px",
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse Public Tab */}
        {activeTab === 'browse' && (
          <div>
            <h2 style={{ color: "#f1f5f9", marginBottom: "24px" }}>
              Public Question Banks
            </h2>

            {publicBanks.length === 0 ? (
              <div className="card" style={{
                padding: "60px",
                textAlign: "center",
                color: "#64748b"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ color: "#f1f5f9", marginBottom: "8px" }}>No public banks available</h3>
                <p>Be the first to create and share a question bank!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {publicBanks.map((bank) => (
                  <div key={bank._id} className="card" style={{ padding: "24px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px"
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: "#f1f5f9", margin: "0 0 8px 0" }}>
                          {bank.title}
                        </h3>
                        <p style={{ color: "#cbd5e1", margin: "0 0 12px 0", fontSize: "14px" }}>
                          {bank.description || "No description"}
                        </p>
                        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{
                            background: "rgba(139, 92, 246, 0.2)",
                            color: "#8b5cf6",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}>
                            by {bank.creator?.username || 'Anonymous'}
                          </span>
                          <span style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}>
                            {bank.category}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {renderStars(bank.difficulty)}
                            <span style={{ color: "#64748b", fontSize: "12px" }}>
                              {bank.difficulty}
                            </span>
                          </div>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {bank.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedBank(bank);
                          setShowBankModal(true);
                        }}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        View Questions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Bank Modal */}
        {showCreateModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div className="card" style={{
              width: "90%",
              maxWidth: "500px",
              padding: "32px",
              maxHeight: "80vh",
              overflow: "auto"
            }}>
              <h2 style={{ color: "#f1f5f9", marginBottom: "24px" }}>
                Create Question Bank
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={bankForm.title}
                    onChange={(e) => setBankForm({...bankForm, title: e.target.value})}
                    placeholder="e.g., React Interview Questions"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(71, 85, 105, 0.5)",
                      border: "1px solid rgba(71, 85, 105, 0.3)",
                      borderRadius: "8px",
                      color: "#f1f5f9"
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                    Description
                  </label>
                  <textarea
                    value={bankForm.description}
                    onChange={(e) => setBankForm({...bankForm, description: e.target.value})}
                    placeholder="Brief description of this question bank"
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(71, 85, 105, 0.5)",
                      border: "1px solid rgba(71, 85, 105, 0.3)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                      Category
                    </label>
                    <select
                      value={bankForm.category}
                      onChange={(e) => setBankForm({...bankForm, category: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(71, 85, 105, 0.5)",
                        border: "1px solid rgba(71, 85, 105, 0.3)",
                        borderRadius: "8px",
                        color: "#f1f5f9"
                      }}
                    >
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="system-design">System Design</option>
                      <option value="data-structures">Data Structures</option>
                      <option value="algorithms">Algorithms</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                      Difficulty
                    </label>
                    <select
                      value={bankForm.difficulty}
                      onChange={(e) => setBankForm({...bankForm, difficulty: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(71, 85, 105, 0.5)",
                        border: "1px solid rgba(71, 85, 105, 0.3)",
                        borderRadius: "8px",
                        color: "#f1f5f9"
                      }}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    color: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}>
                    <input
                      type="checkbox"
                      checked={bankForm.isPublic}
                      onChange={(e) => setBankForm({...bankForm, isPublic: e.target.checked})}
                      style={{ accentColor: "#3b82f6" }}
                    />
                    Make this bank public (others can view and use it)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px" }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: "12px 24px",
                    background: "rgba(71, 85, 105, 0.5)",
                    color: "#cbd5e1",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createBank}
                  disabled={loading || !bankForm.title.trim()}
                  style={{
                    padding: "12px 24px",
                    background: loading ? "#64748b" : "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading || !bankForm.title.trim() ? "not-allowed" : "pointer",
                    opacity: loading || !bankForm.title.trim() ? 0.6 : 1
                  }}
                >
                  {loading ? "Creating..." : "Create Bank"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details Modal */}
        {showBankModal && selectedBank && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div className="card" style={{
              width: "90%",
              maxWidth: "800px",
              padding: "32px",
              maxHeight: "80vh",
              overflow: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ color: "#f1f5f9", margin: "0 0 8px 0" }}>
                    {selectedBank.title}
                  </h2>
                  <p style={{ color: "#cbd5e1", margin: 0, fontSize: "14px" }}>
                    {selectedBank.description || "No description"}
                  </p>
                </div>
                <button
                  onClick={() => setShowBankModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: "24px"
                  }}
                >
                  ×
                </button>
              </div>

              {/* Questions List */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ color: "#f1f5f9", marginBottom: "16px" }}>
                  Questions ({selectedBank.questions?.length || 0})
                </h3>

                {selectedBank.questions?.length === 0 ? (
                  <div style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b",
                    background: "rgba(71, 85, 105, 0.3)",
                    borderRadius: "8px"
                  }}>
                    No questions in this bank yet
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "16px" }}>
                    {selectedBank.questions.map((q, index) => (
                      <div key={index} style={{
                        background: "rgba(71, 85, 105, 0.3)",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(71, 85, 105, 0.3)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ color: "#f1f5f9", margin: "0 0 4px 0", fontSize: "16px" }}>
                            Question {index + 1}
                          </h4>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <span style={{
                              background: "rgba(59, 130, 246, 0.2)",
                              color: "#3b82f6",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "500"
                            }}>
                              {q.category}
                            </span>
                            <span style={{
                              background: "rgba(245, 158, 11, 0.2)",
                              color: "#f59e0b",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "500"
                            }}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                        <p style={{ color: "#cbd5e1", margin: "0 0 12px 0", fontSize: "14px" }}>
                          {q.question}
                        </p>
                        <details style={{ color: "#94a3b8" }}>
                          <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
                            Show Expected Answer
                          </summary>
                          <p style={{ margin: 0, padding: "8px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "4px", fontSize: "14px" }}>
                            {q.expectedAnswer}
                          </p>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Question Form (only for my banks) */}
              {activeTab === 'my-banks' && (
                <div style={{
                  borderTop: "1px solid rgba(71, 85, 105, 0.3)",
                  paddingTop: "24px"
                }}>
                  <h3 style={{ color: "#f1f5f9", marginBottom: "16px" }}>
                    Add New Question
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                        Question *
                      </label>
                      <textarea
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                        placeholder="Enter the interview question"
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "rgba(71, 85, 105, 0.5)",
                          border: "1px solid rgba(71, 85, 105, 0.3)",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                          resize: "vertical"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                        Expected Answer *
                      </label>
                      <textarea
                        value={questionForm.expectedAnswer}
                        onChange={(e) => setQuestionForm({...questionForm, expectedAnswer: e.target.value})}
                        placeholder="What would be a good answer to this question?"
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "rgba(71, 85, 105, 0.5)",
                          border: "1px solid rgba(71, 85, 105, 0.3)",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                          resize: "vertical"
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                          Category
                        </label>
                        <select
                          value={questionForm.category}
                          onChange={(e) => setQuestionForm({...questionForm, category: e.target.value})}
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "rgba(71, 85, 105, 0.5)",
                            border: "1px solid rgba(71, 85, 105, 0.3)",
                            borderRadius: "8px",
                            color: "#f1f5f9"
                          }}
                        >
                          <option value="technical">Technical</option>
                          <option value="behavioral">Behavioral</option>
                          <option value="system-design">System Design</option>
                          <option value="data-structures">Data Structures</option>
                          <option value="algorithms">Algorithms</option>
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="devops">DevOps</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ color: "#f1f5f9", display: "block", marginBottom: "8px" }}>
                          Difficulty
                        </label>
                        <select
                          value={questionForm.difficulty}
                          onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "rgba(71, 85, 105, 0.5)",
                            border: "1px solid rgba(71, 85, 105, 0.3)",
                            borderRadius: "8px",
                            color: "#f1f5f9"
                          }}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => addQuestionToBank(selectedBank._id)}
                      disabled={!questionForm.question.trim() || !questionForm.expectedAnswer.trim()}
                      style={{
                        padding: "12px 24px",
                        background: (!questionForm.question.trim() || !questionForm.expectedAnswer.trim()) ? "#64748b" : "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: (!questionForm.question.trim() || !questionForm.expectedAnswer.trim()) ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        alignSelf: "flex-start"
                      }}
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
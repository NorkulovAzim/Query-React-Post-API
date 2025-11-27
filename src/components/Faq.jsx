import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { faqService } from "../services/faqService";
import { useAuth } from "../hooks/useAuth";

const Faq = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: faqService.getAllFaqs,
  });

  const createMutation = useMutation({
    mutationFn: faqService.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setQuestion("");
      setAnswer("");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...faqData }) => faqService.updateFaq(id, faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setEditingId(null);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: faqService.deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      createMutation.mutate({ question, answer });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (editQuestion.trim() && editAnswer.trim()) {
      updateMutation.mutate({
        id: editingId,
        question: editQuestion,
        answer: editAnswer,
      });
    }
  };

  const startEditing = (faq) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  if (isLoading) return <div className="container">Loading FAQs...</div>;
  if (error)
    return <div className="container">Error loading FAQs: {error.message}</div>;

  return (
    <div className="container">
      <div>
        <h2>Frequently Asked Questions</h2>
        {isAuthenticated && (
          <div style={{ textAlign: "right" }}>
            <p>Welcome, {user?.username}</p>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <div>
          <p>You must be logged in to add, edit, or delete FAQs.</p>
          <p>
            Please <a href="/login">log in</a> to access these features.
          </p>
        </div>
      )}

      {isAuthenticated && (
        <form onSubmit={handleCreate} className="faq-form">
          <h3>Add New FAQ</h3>
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <input
              id="question"
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Answer:</label>
            <textarea
              id="answer"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ width: "100%", minHeight: "100px" }}
            />
          </div>
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Adding..." : "Add FAQ"}
          </button>
          {createMutation.isError && (
            <p style={{ color: "red" }}>
              Error adding FAQ: {createMutation.error.message}
            </p>
          )}
        </form>
      )}

      {data && data.length > 0 ? (
        <div>
          {data.map((faq) => (
            <div key={faq.id} className="faq-item">
              {editingId === faq.id && isAuthenticated ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label htmlFor={`edit-question-${faq.id}`}>Question:</label>
                    <input
                      id={`edit-question-${faq.id}`}
                      type="text"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`edit-answer-${faq.id}`}>Answer:</label>
                    <textarea
                      id={`edit-answer-${faq.id}`}
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      style={{ width: "100%", minHeight: "80px" }}
                    />
                  </div>
                  <div className="action-buttons">
                    <button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Updating..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                  {updateMutation.isError && (
                    <p style={{ color: "red" }}>
                      Error updating FAQ: {updateMutation.error.message}
                    </p>
                  )}
                </form>
              ) : (
                <div>
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                  {isAuthenticated && (
                    <div className="action-buttons">
                      <button
                        onClick={() => startEditing(faq)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(faq.id)}
                        disabled={deleteMutation.isPending}
                        className="delete-button"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                  {deleteMutation.isError && (
                    <p style={{ color: "red" }}>
                      Error deleting FAQ: {deleteMutation.error.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No FAQs available</p>
      )}
    </div>
  );
};

export default Faq;

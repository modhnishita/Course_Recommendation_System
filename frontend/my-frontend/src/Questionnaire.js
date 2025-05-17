import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Questionnaire.css';

function Questionnaire() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch questions on mount
  useEffect(() => {
    axios
      .get("https://course-recommendation-system-b1wi.onrender.com/questions")
      .then((response) => {
        console.log("✅ Questions fetched:", response.data); // Print response.data
        if (Array.isArray(response.data) && response.data.length > 0) {
          setQuestions(response.data);
        } else {
          setError("No questions returned from the server.");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch questions:", err);
        setError("Failed to fetch questions from server.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    const unanswered = questions.some((_, index) => !responses.hasOwnProperty(index));
    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const answers = questions.map((_, index) => responses[index]);

    console.log("📤 Submitting responses:", answers); // Print answers being submitted

    axios
      .post("https://course-recommendation-system-b1wi.onrender.com/recommend", { responses: answers })
      .then((response) => {
        console.log("✅ Recommendation response:", response.data); // Print response.data
        navigate("/result", {
          state: {
            recommended_course: response.data.recommended_course,
            description: response.data.description
          }
        });
      })
      .catch((error) => {
        console.error("❌ Error submitting recommendation:", error.response?.data || error.message);
        alert("Failed to fetch recommendation. Check backend or console.");
      });
  };

  // Render state
  if (loading) {
    return <div className="container"><p>Loading questions...</p></div>;
  }

  if (error) {
    return <div className="container"><p style={{ color: "red" }}>{error}</p></div>;
  }

  return (
    <div className="container">
      <h1>Course Recommendation</h1>

      {questions.map((q, index) => (
        <div key={index} className="question-block">
          <p className="question-text">{q.question}</p>
          {q.options.map((option, i) => (
            <label key={i} className="option-label">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={responses[index] === option}
                onChange={() => setResponses({ ...responses, [index]: option })}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} className="submit-btn">Submit</button>
    </div>
  );
}

export default Questionnaire;

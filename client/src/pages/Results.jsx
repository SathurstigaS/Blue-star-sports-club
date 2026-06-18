import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaMedal } from 'react-icons/fa';
import axios from 'axios';
import WinnerCard from '../components/WinnerCard';

function Results() {
  const { sportId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, [sportId]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`/api/results/sport/${sportId}`);
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  const result = results[0];

  return (
    <div className="results-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        Back to Sports
      </button>

      <div className="page-header results-header">
        <div className="results-header-chip">
          <FaTrophy />
          <span>Final Standings</span>
        </div>
        <h1>{result ? result.sport_name : 'Results'}</h1>
        <p>
          {result
            ? `${result.age_category_name} • ${result.gender}`
            : 'Winners for this event'}
        </p>
      </div>

      {!result ? (
        <div className="empty-state">
          <div className="empty-icon"><FaMedal /></div>
          <h3>No Results Yet</h3>
          <p>Results will be announced soon. Stay tuned!</p>
        </div>
      ) : (
        <div className="results-hero-panel">
          <video
            className="celebration-video"
            src="/121983-724732202.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="results-overlay"></div>
          <div className="winners-container">
            <WinnerCard position="gold" name={result.gold_winner} />
            <WinnerCard position="silver" name={result.silver_winner} />
            <WinnerCard position="bronze" name={result.bronze_winner} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;

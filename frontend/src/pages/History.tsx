import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../hooks/useAuth';
import generationService, { type Generation } from '../services/generation.service';

const History: React.FC = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const fetchHistory = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching history for page:', page);
      const response = await generationService.getHistory(page, 5);
      console.log('History response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setGenerations(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      } else {
        console.error('Invalid response format:', response);
        setGenerations([]);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to load history');
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const getLanguageForHighlighter = (languageCode: string) => {
    const languageMap: Record<string, string> = {
      'python': 'python',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'csharp': 'csharp',
      'c#': 'csharp',
      'go': 'go',
      'rust': 'rust',
    };
    return languageMap[languageCode.toLowerCase()] || 'javascript';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Generation History</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Generate Code
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Code Generations ({totalItems})
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">No code generations yet</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Your First Code
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {generations.map((gen) => (
                <div key={gen.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {gen.language}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(gen.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium text-lg">{gen.prompt}</p>
                    </div>
                    <button
                      onClick={() => handleCopyCode(gen.code)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      📋 Copy
                    </button>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <SyntaxHighlighter
                      language={getLanguageForHighlighter(gen.language)}
                      style={vscDarkPlus}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '0.9rem',
                        maxHeight: '600px',
                      }}
                      wrapLongLines
                    >
                      {gen.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../hooks/useAuth';
import generationService, { type Language } from '../services/generation.service';

const Generate: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<number>(0);
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false); // Prevent double requests
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadLanguages = async () => {
      if (isMounted) {
        await fetchLanguages();
      }
    };
    loadLanguages();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchLanguages = async () => {
    try {
      const data = await generationService.getLanguages();
      if (data && Array.isArray(data) && data.length > 0) {
        setLanguages(data);
        setSelectedLanguage(data[0].id);
      } else {
        console.error('No languages returned from API');
        setError('Failed to load languages. Please refresh the page.');
      }
    } catch (err) {
      console.error('Failed to fetch languages:', err);
      setError('Failed to load languages. Please check your connection.');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate requests
    if (isGenerating || loading) {
      return;
    }

    setError('');
    setLoading(true);
    setIsGenerating(true);
    setGeneratedCode('');

    try {
      const result = await generationService.generateCode({
        prompt,
        languageId: selectedLanguage,
      });
      setGeneratedCode(result.code);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
      // Add a small delay before allowing next request
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const getLanguageForHighlighter = () => {
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
    const selectedLang = languages.find(l => l.id === selectedLanguage);
    return languageMap[selectedLang?.code.toLowerCase() || ''] || 'javascript';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Code Generation Copilot</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={() => navigate('/history')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              History
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
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Code</h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe what you want to build
                </label>
                <textarea
                  id="prompt"
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
                  placeholder="Example: Create a function to reverse a string..."
                  minLength={10}
                  maxLength={1000}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {prompt.length}/1000 characters (min 10)
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isGenerating || !prompt.trim() || prompt.length < 10}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Generating...' : 'Generate Code'}
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="xl:col-span-3 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Generated Code</h2>
              {generatedCode && (
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  📋 Copy Code
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[calc(100vh-250px)]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your code...</p>
                </div>
              </div>
            ) : generatedCode ? (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <SyntaxHighlighter
                  language={getLanguageForHighlighter()}
                  style={vscDarkPlus}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.95rem',
                    maxHeight: 'calc(100vh - 250px)',
                    minHeight: '500px',
                  }}
                  wrapLongLines
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-250px)] text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-lg">Your generated code will appear here...</p>
                  <p className="text-sm mt-2">Enter a prompt and click "Generate Code"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;

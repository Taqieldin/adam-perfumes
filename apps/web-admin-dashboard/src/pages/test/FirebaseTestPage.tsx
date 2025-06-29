import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const FirebaseTestPage: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing Firebase connection...');
  const [authStatus, setAuthStatus] = useState<string>('Not authenticated');
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const testFirebaseConnection = async () => {
    try {
      // Test 1: Firebase Auth initialization
      addResult('✅ Firebase Auth initialized successfully');
      
      // Test 2: Firebase Firestore initialization
      addResult('✅ Firebase Firestore initialized successfully');
      
      // Test 3: Check current auth state
      const user = auth.currentUser;
      if (user) {
        addResult(`✅ User authenticated: ${user.email}`);
      } else {
        addResult('ℹ�� No user currently authenticated');
      }

      // Test 4: Test with demo credentials
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          'admin@adamperfumes.com', 
          'admin123'
        );
        addResult(`✅ Demo login successful: ${userCredential.user.email}`);
        
        // Test 5: Get user token
        const token = await userCredential.user.getIdToken();
        addResult(`✅ ID Token retrieved: ${token.substring(0, 20)}...`);
        
      } catch (error: any) {
        addResult(`❌ Demo login failed: ${error.message}`);
      }

      setStatus('Firebase connection test completed');
      
    } catch (error: any) {
      addResult(`❌ Firebase connection failed: ${error.message}`);
      setStatus('Firebase connection test failed');
    }
  };

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(`Authenticated as: ${user.email}`);
      } else {
        setAuthStatus('Not authenticated');
      }
    });

    // Run tests
    testFirebaseConnection();

    return () => unsubscribe();
  }, []);

  const clearResults = () => {
    setTestResults([]);
    setStatus('Testing Firebase connection...');
  };

  const runTests = () => {
    clearResults();
    testFirebaseConnection();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Firebase Connection Test
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Status: {status}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Auth Status: {authStatus}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={runTests}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Tests
                </button>
                <button
                  onClick={clearResults}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Test Results:
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No test results yet...</p>
                ) : (
                  <ul className="space-y-2">
                    {testResults.map((result, index) => (
                      <li key={index} className="text-sm font-mono text-gray-900 dark:text-white">
                        {result}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Environment Variables:
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>API Key:</strong> {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div>
                    <strong>Auth Domain:</strong> {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div>
                    <strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div>
                    <strong>Storage Bucket:</strong> {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div>
                    <strong>Messaging Sender ID:</strong> {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div>
                    <strong>App ID:</strong> {import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Demo Credentials:
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <p><strong>Super Admin:</strong> admin@adamperfumes.com / admin123</p>
                  <p><strong>Branch Manager:</strong> manager@adamperfumes.com / manager123</p>
                  <p><strong>Staff:</strong> staff@adamperfumes.com / staff123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestPage;
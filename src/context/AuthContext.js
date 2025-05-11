// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in when app starts
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userInfo');
      
      if (token && userData) {
        setUserToken(token);
        setUserInfo(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log in a user
  const login = async (email, password) => {
    setIsLoading(true);
    setError('');
    
    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return false;
      }

      // Get stored users
      const usersStr = await AsyncStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Find user with matching credentials
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        
        // Store authentication data
        await AsyncStorage.setItem('userToken', 'user-token-' + user.id);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        
        setUserToken('user-token-' + user.id);
        setUserInfo(userData);
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to register a new user
  const register = async (name, email, password, confirmPassword) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Validate input
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      // Get existing users
      const usersStr = await AsyncStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        setError('Email already registered');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In a real app, this should be hashed
      };
      
      // Save user to storage
      await AsyncStorage.setItem('users', JSON.stringify([...users, newUser]));
      
      // Create user data for state
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      // Store authentication data
      await AsyncStorage.setItem('userToken', 'user-token-' + newUser.id);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      
      setUserToken('user-token-' + newUser.id);
      setUserInfo(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out a user
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Remove user data from storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isLoading,
        userToken,
        userInfo,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
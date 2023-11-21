"use client"
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface RequestHeadersContextType {
  updateHeaders: (newHeaders: Record<string, string>) => void;
  getHeaders: () => Record<string, string>;
  setToken: (newToken: string) => void;
}

export const RequestHeadersContext = createContext<RequestHeadersContextType | undefined>(undefined);

interface RequestHeadersProviderProps {
  children: ReactNode;
}

export const RequestHeadersProvider: React.FC<RequestHeadersProviderProps> = ({
  children,
}) => {
  const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : '';// Retrieve token from localStorage
  const defaultHeaders = {
    Authorization: `Bearer ${initialToken}`,
    "Content-Type": "application/json"
  };

  const dynamicHeaders: Record<string, string> = {};
  const [token, setToken] = useState(initialToken);

  const updateHeaders = (newHeaders: Record<string, string>) => {
    Object.assign(dynamicHeaders, newHeaders);
  };

  const getHeaders = () => {
    return {
      ...defaultHeaders,
      ...dynamicHeaders,
    };
  };

  useEffect(() => {
    // Update headers whenever the token changes
    defaultHeaders.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <RequestHeadersContext.Provider value={{ updateHeaders, getHeaders, setToken }}>
      {children}
    </RequestHeadersContext.Provider>
  );
};
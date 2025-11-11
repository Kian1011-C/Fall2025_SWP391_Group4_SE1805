import React, { createContext, useContext, useState } from 'react';

const IssueContext = createContext();

export const useIssues = () => {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error('useIssues must be used within IssueProvider');
  return ctx;
};

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [issueFilter, setIssueFilter] = useState('all');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const getIssuesForStation = (stationId) => issues.filter(i => i.stationId === stationId);
  const getFilteredIssues = () => (issueFilter === 'all' ? issues : issues.filter(i => i.status === issueFilter));

  const updateIssueStatus = (issueId, newStatus, solutionNotes = '') => {
    setIssues(prev => prev.map(issue => issue.id === issueId ? { ...issue, status: newStatus, solutionNotes, updatedAt: new Date().toISOString() } : issue));
  };

  const value = {
    issues, setIssues,
    issueFilter, setIssueFilter,
    showIssueModal, setShowIssueModal,
    selectedIssue, setSelectedIssue,
    getIssuesForStation,
    getFilteredIssues,
    updateIssueStatus
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};



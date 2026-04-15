# JanSetu - Intelligent Complaint Management System

## Overview
JanSetu is a comprehensive complaint and issue management platform that leverages artificial intelligence and blockchain technology to streamline citizen grievance resolution. It serves as a bridge between citizens and administrative officers, enabling efficient complaint tracking, categorization, and resolution.

## Core Features

**AI-Powered Intelligence**: The system employs advanced NLP and machine learning algorithms to automatically categorize complaints, detect intent, assess priority levels, and identify escalation patterns. It features semantic similarity matching for complaint clustering and a sophisticated RAG (Retrieval-Augmented Generation) engine for intelligent responses.

**Blockchain Integration**: Complaints are recorded on an immutable blockchain ledger (CIvicChain smart contract), ensuring transparency, auditability, and tamper-proof complaint history. This builds trust in the system and maintains a permanent record of all citizen grievances.

**Real-Time Analytics**: The platform provides comprehensive analytics and hotspot detection to identify complaint clusters, emerging issues, and areas requiring immediate attention. Dashboard visualization enables data-driven decision making for administrators.

**Multi-Role Access**: Supports distinct user roles including Citizens (file complaints), Officers (manage and resolve issues), and Admins (system oversight). Each role has tailored workflows and permissions.

**Intelligent Routing**: Complaints are automatically categorized, tagged, and routed to appropriate officers based on priority scores calculated through multiple factors including urgency, frequency patterns, and category-specific rules.

**Chat Interface**: An interactive chatbot provides conversational support, allowing citizens to file complaints and receive updates through natural language interaction rather than complex forms.

## Technical Stack

- **Frontend**: React with Vite for responsive user interface
- **Backend**: Node.js/Express for REST API and business logic
- **AI Services**: Python-based AI engine with ML models for NLP, embedding, and analysis
- **Blockchain**: Solidity smart contracts on Hardhat framework
- **Database**: MongoDB for data persistence

# Development Steps for RehabBot - Intelligent Analytics Assistant

## Overview

This document outlines the systematic development process for RehabBot, an intelligent conversational analytics assistant designed to help rehabilitation center staff understand and interact with performance data through natural language queries. RehabBot provides professional analytics insights, real-time data analysis, and voice-enabled interactions to support evidence-based decision-making for staff members.

---

## Step 1: Requirements Analysis and Design

### 1.1 User Role Identification
**Objective**: Define the target user persona and communication style for RehabBot.

**Implementation**:
- Designed specifically for **Staff** users: Professional analytics advisors requiring technical insights, KPI calculations, and strategic recommendations
- Communication style:
  - Technical terminology appropriate for professional staff
  - Detailed metrics and comprehensive data analysis
  - Professional recommendations and actionable insights
  - Clear explanations of calculations and methodologies

**Code Location**: `FloatingChatbot.tsx` lines 11, 636-650, 685-716

### 1.2 Core Functionality Requirements
**Objective**: Define the essential capabilities RehabBot must provide.

**Requirements Identified**:
- Answer questions about overall performance and KPIs
- Explain dimension scores and comparisons
- Provide trend analysis and interpretations
- Offer improvement recommendations
- Explain calculation methodologies
- Interpret charts and visualizations
- Handle specific question queries (TO1, PO1, etc.)
- Support natural language queries with pattern matching
- Provide suggested questions for staff users
- Enable voice-based interactions through browser text-to-speech

**Code Location**: `FloatingChatbot.tsx` lines 718-1406

### 1.3 Data Integration Requirements
**Objective**: Identify data sources and required information for chatbot responses.

**Data Sources Identified**:
- KPI Data: Overall index, trend, best/lowest dimensions, total respondents
- Processed Dashboard Data: Dimension scores, question-level data, respondent groups
- Filter Context: Date range, group, dimension, PDK selection
- Question Descriptions: Comprehensive database of all 38 survey questions
- Dimension Mappings: Question-to-dimension relationships

**Code Location**: `FloatingChatbot.tsx` lines 13-32, 34-97

---

## Step 2: Component Architecture Design

### 2.1 Component Structure
**Objective**: Design the React component architecture for the floating chatbot.

**Implementation**:
- Created `FloatingChatbot` as a functional React component using TypeScript
- Defined comprehensive props interface `FloatingChatbotProps`:
  ```typescript
  interface FloatingChatbotProps {
    kpiData?: KPI data structure
    processedDashboardData?: Processed dashboard data
    filters?: Filter context
    respondentGroupOptions?: Available respondent groups
    pdkOptions?: Available PDK options
    dimensionMappings?: Dimension mappings
    role?: User role
  }
  ```
- Implemented state management using React hooks:
  - `useState` for UI state (open/closed, minimized, messages, typing)
  - `useRef` for DOM references and media elements
  - `useEffect` for side effects and lifecycle management
  - `useCallback` for optimized function references

**Code Location**: `FloatingChatbot.tsx` lines 99-125

### 2.2 Message System Design
**Objective**: Create a structured message system for conversation management.

**Implementation**:
- Defined `Message` interface:
  ```typescript
  interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  ```
- Implemented message state management:
  - Messages stored in array state
  - Auto-scroll to bottom on new messages
  - Message timestamps for user reference
  - Typing indicators for bot responses

**Code Location**: `FloatingChatbot.tsx` lines 4-9, 110-111, 517-524

### 2.3 Avatar State Management
**Objective**: Design dynamic avatar states to reflect chatbot interaction status.

**Implementation**:
- Defined four avatar states:
  - `idle`: Default state when not interacting
  - `listening`: User is typing input
  - `talking`: Bot is speaking/responding
  - `success`: Brief confirmation after response
- Created state transitions:
  - Idle → Listening (when user types)
  - Listening → Talking (when bot responds)
  - Talking → Success (after response completes)
  - Success → Idle (after 2 seconds)
- Implemented video-based animations for idle and speaking states

**Code Location**: `FloatingChatbot.tsx` lines 113, 477-515, 1483-1513

---

## Step 3: Knowledge Base Development

### 3.1 Question Description Database
**Objective**: Create comprehensive knowledge base of all survey questions.

**Implementation**:
- Created `QUESTION_DESCRIPTIONS` dictionary mapping question IDs to descriptions
- Included all 38 questions across 6 dimensions:
  - Trainee Orientation (TO1-TO6): 6 questions
  - Performance Orientation (PO1-PO6): 6 questions
  - Competitor Orientation (CO1-CO6): 6 questions
  - Long-term Focus (LO1-LO8): 8 questions
  - Inter-functional Coordination (IO1-IO6): 6 questions
  - Employee Orientation (EO1-EO6): 6 questions
- Each description explains what the question measures in rehabilitation context

**Code Location**: `FloatingChatbot.tsx` lines 34-80

### 3.2 Question-to-Dimension Mapping
**Objective**: Establish relationships between questions and dimensions.

**Implementation**:
- Created `QUESTION_TO_DIMENSION` mapping dictionary
- Maps each question ID to its corresponding dimension
- Enables dimension-level analysis and recommendations
- Supports question grouping for dimension score calculations

**Code Location**: `FloatingChatbot.tsx` lines 82-97

### 3.3 Dimension Knowledge Base
**Objective**: Create descriptive information about each dimension.

**Implementation**:
- Developed `getDimensionDescription()` function providing:
  - What each dimension measures
  - Context for understanding dimension scores
  - Role-appropriate explanations
- Created `getDimensionSuggestions()` function for improvement recommendations:
  - Actionable suggestions for lowest-performing dimensions
  - Maintenance strategies for highest-performing dimensions
  - Role-specific guidance

**Code Location**: `FloatingChatbot.tsx` lines 583-620

---

## Step 4: Intent Recognition and Response Generation

### 4.1 Pattern Matching System
**Objective**: Implement natural language understanding through pattern matching.

**Implementation**:
- Created `getBotResponse()` function as main response generator
- Implemented regex-based pattern matching for intent recognition:
  - Greetings: `/(hi|hello|hey|good morning|good afternoon|good evening)/`
  - Overall Performance: `/(overall|kpi|index|performance|score|how.*doing|current.*performance)/`
  - Trend Analysis: `/(trend|changing|improving|declining|getting better|getting worse|direction)/`
  - Dimensions: `/(dimension|dimensions|all.*scores|compare.*dimensions|which.*best|which.*worst)/`
  - Strengths/Weaknesses: `/(strength|weakness|strong|weak|best|worst|lowest|highest|excellent|poor)/`
  - Calculations: `/(how.*calculated|how.*compute|how.*work|calculation|formula|method|explain.*kpi)/`
  - Recommendations: `/(recommend|suggest|improve|better|action|what.*do|how.*improve|advice)/`
  - Charts: `/(graph|chart|visualization|plot|diagram|explain.*chart|what.*show|what.*mean)/`
- Pattern matching is case-insensitive and handles variations

**Code Location**: `FloatingChatbot.tsx` lines 718-1406

### 4.2 Response Generation Logic
**Objective**: Generate contextually appropriate responses based on user queries.

**Implementation**:
- Response generation follows priority-based pattern matching
- Each intent category has dedicated response logic:
  1. Validate data availability
  2. Extract relevant metrics from props
  3. Format response with professional terminology
  4. Include actionable insights and recommendations
- Handles edge cases:
  - Missing data scenarios
  - Invalid queries
  - Default fallback responses

**Code Location**: `FloatingChatbot.tsx` lines 752-1405

### 4.3 Response Formatting
**Objective**: Format responses with professional terminology appropriate for staff users.

**Implementation**:
- Created `formatForStaff()` function for professional formatting
- Uses technical terminology appropriate for staff:
  - "KPI", "dimension", "Overall Performance Index"
  - "Performance Status", "Total Respondents"
  - Professional metric terminology
- Applied markdown removal for clean text output
- Maintains professional tone throughout responses

**Code Location**: `FloatingChatbot.tsx` lines 652-716

---

## Step 5: Suggested Questions System

### 5.1 Suggested Questions System
**Objective**: Provide contextually relevant suggested questions for staff users.

**Implementation**:
- Created `getSuggestedQuestions()` function
- Staff-focused question set (12 questions) covering:
  - Overall performance overview
  - Trend analysis
  - Dimensions comparison
  - Strengths and weaknesses
  - Improvement recommendations
  - KPI calculations
  - Best/lowest performing dimensions
  - Dimension scores
  - Performance metrics explanations
  - Action recommendations
  - Chart interpretations
- Questions displayed as clickable buttons when chat is empty or after responses
- Questions automatically trigger bot responses when clicked

**Code Location**: `FloatingChatbot.tsx` lines 130-183

### 5.2 Suggestion Display Logic
**Objective**: Control when and how suggested questions are displayed.

**Implementation**:
- Suggestions shown when:
  - Chat is first opened (no messages)
  - After bot completes a response
- Suggestions hidden when:
  - User is typing
  - User sends a message
- Implemented smooth show/hide transitions
- Styled as interactive buttons with hover effects

**Code Location**: `FloatingChatbot.tsx` lines 115, 186-219, 1830-1845

---

## Step 6: Text-to-Speech Integration

### 6.1 Browser Text-to-Speech Integration
**Objective**: Implement text-to-speech functionality using browser's native Speech Synthesis API.

**Implementation**:
- Created `speakText()` function using Web Speech API
- Browser TTS features:
  - Voice selection (prioritizes neural/premium voices when available)
  - Configurable rate (0.95), pitch (1.0), volume (1.0)
  - Cross-browser compatibility checks
  - Automatic voice list loading
- Text preprocessing:
  - Markdown removal
  - Whitespace normalization
  - Newline-to-period conversion
- Error handling:
  - Graceful degradation if speech synthesis not supported
  - Console warnings for unsupported browsers
  - Fallback to silent mode if TTS unavailable

**Code Location**: `FloatingChatbot.tsx` lines 305-399

### 6.2 Speech State Management
**Objective**: Synchronize speech state with avatar animations and UI.

**Implementation**:
- Speech state tracking:
  - `isSpeaking`: Boolean flag for active speech
  - `speechSynthesisRef`: Reference to current utterance
- State transitions:
  - Speech start → Avatar "talking" state
  - Speech end → Avatar "success" state → "idle" after 2s
- Cleanup on component unmount and chat close
- Speech cancellation on new user input
- Proper cleanup of speech synthesis resources

**Code Location**: `FloatingChatbot.tsx` lines 114, 373-387, 425-433, 1411-1415

---

## Step 7: Avatar Animation System

### 7.1 Video-Based Animations
**Objective**: Implement dynamic avatar animations using video elements.

**Implementation**:
- Created video references for different states:
  - `idleVideoRefClosed` / `idleVideoRefHeader`: Idle state videos
  - `videoRefClosed` / `videoRefHeader`: Speaking state videos
- Video sources:
  - Idle: `/RehabBotIdle.mp4`, `/RehabBotIdle2.mp4`
  - Speaking: `/RehabBotSpeaking4.mp4`
- Video playback control:
  - Auto-play for idle videos
  - Loop enabled for continuous animation
  - Muted for autoplay compatibility
  - PlaysInline for mobile support

**Code Location**: `FloatingChatbot.tsx` lines 121-124, 435-475, 1595-1625, 1753-1783

### 7.2 CSS Animation System
**Objective**: Create smooth CSS animations for avatar states.

**Implementation**:
- Defined keyframe animations:
  - `blink`: Subtle opacity changes for idle state
  - `breathe`: Gentle scale animation for idle state
  - `listen`: Slight movement when user is typing
  - `talk`: Dynamic scale and rotation for speaking
  - `successNod`: Brief nod animation after response
- Applied animations via CSS classes:
  - `avatar-idle`: Combines breathe and blink
  - `avatar-listening`: Applies listen animation
  - `avatar-talking`: Applies talk animation with brightness filter
  - `avatar-success`: Applies success nod animation

**Code Location**: `FloatingChatbot.tsx` lines 1519-1585, 1639-1716

### 7.3 State-Based Animation Control
**Objective**: Synchronize animations with interaction states.

**Implementation**:
- Animation state logic:
  - Priority: speaking > typing > listening > success > idle
  - Automatic transitions based on user/bot actions
  - Timeout-based state resets
- Video/Image switching:
  - Video for idle and talking states
  - Static images for listening and success states
  - Smooth transitions between states

**Code Location**: `FloatingChatbot.tsx` lines 477-515, 1483-1513

---

## Step 8: UI/UX Design and Implementation

### 8.1 Floating Chat Interface
**Objective**: Design an accessible, modern floating chat interface.

**Implementation**:
- Fixed positioning: Bottom-left corner with z-index 100
- Responsive sizing: 300px width, 500px height, max 85vh
- Gradient background: Malaysia-themed colors (red #CE1126, yellow #FCD106)
- Rounded corners: 3xl border radius
- Shadow effects: 2xl shadow for depth
- Backdrop blur: Subtle blur effect for modern look

**Code Location**: `FloatingChatbot.tsx` lines 1717-1727

### 8.2 Chat Header Design
**Objective**: Create an engaging header with avatar and title.

**Implementation**:
- Header components:
  - Circular avatar (130px) with decorative border
  - Close button (X icon) in top-right
  - Title text: "Ask RehabBot anything"
- Avatar frame:
  - Red/yellow gradient border
  - Semi-transparent background
  - Centered positioning
- Responsive layout with proper spacing

**Code Location**: `FloatingChatbot.tsx` lines 1736-1793

### 8.3 Message Display System
**Objective**: Design clear, readable message bubbles.

**Implementation**:
- Message styling:
  - User messages: Right-aligned, red-yellow gradient background
  - Bot messages: Left-aligned, dark background with red border
  - Rounded corners with directional tail (rounded-br-sm / rounded-bl-sm)
  - Max width: 85% of container
  - Padding and spacing for readability
- Timestamp display:
  - Small font size (10px)
  - Color-coded by sender
  - 12-hour time format
- Auto-scroll: Smooth scroll to bottom on new messages

**Code Location**: `FloatingChatbot.tsx` lines 1795-1828

### 8.4 Input Area Design
**Objective**: Create intuitive input interface.

**Implementation**:
- Input components:
  - Text input with placeholder
  - Send button with gradient background
  - Keyboard shortcuts hint
- Styling:
  - Dark background with transparency
  - Border with yellow accent
  - Focus states with ring effects
  - Disabled states for send button
- Functionality:
  - Enter key to send
  - Escape key to close
  - Auto-focus when opened

**Code Location**: `FloatingChatbot.tsx` lines 1863-1891

### 8.5 Closed State Button
**Objective**: Design attractive floating button when chat is closed.

**Implementation**:
- Circular button (160px) with avatar
- Decorative border with gradient colors
- Pulsing indicator dot (red circle)
- Hover tooltip: "Chat with RehabBot"
- Hover effects: Scale and shadow transitions
- Video/image display based on avatar state

**Code Location**: `FloatingChatbot.tsx` lines 1516-1634

---

## Step 9: Data Integration and Context Awareness

### 9.1 KPI Data Integration
**Objective**: Connect chatbot to real-time KPI data.

**Implementation**:
- Props integration:
  - `kpiData`: Overall index, trend, best/lowest dimensions, respondents
  - `processedDashboardData`: Dimension scores, question data
  - `filters`: Current filter context (PDK, date range, etc.)
- Data validation:
  - Checks for data availability before responding
  - Provides helpful error messages when data missing
  - Handles edge cases (zero respondents, missing dimensions)

**Code Location**: `FloatingChatbot.tsx` lines 13-32, 552-566, 752-839

### 9.2 Helper Functions for Data Analysis
**Objective**: Create utility functions for data processing.

**Implementation**:
- `getDimensionAnalysis()`: Extracts and sorts dimension data
- `getLowestScoringQuestions()`: Identifies questions needing improvement
- `getDimensionDescription()`: Provides dimension explanations
- `getDimensionSuggestions()`: Generates improvement recommendations
- `getHighestDimensionSuggestions()`: Provides maintenance strategies
- `scoreToPercentage()`: Converts 0-7 scale to percentage
- `getRehabServEStatus()`: Determines performance status category

**Code Location**: `FloatingChatbot.tsx` lines 552-635

### 9.3 Context-Aware Responses
**Objective**: Generate responses that reflect current dashboard state.

**Implementation**:
- PDK-specific responses when filter is active
- Trend-aware interpretations (improving/declining/stable)
- Dimension-specific insights based on current scores
- Question-level details when querying specific questions
- Respondent count context in all relevant responses

**Code Location**: `FloatingChatbot.tsx` lines 752-1405

---

## Step 10: Advanced Query Handling

### 10.1 Specific Question Queries
**Objective**: Handle queries about individual questions (TO1, PO1, etc.).

**Implementation**:
- Pattern matching: `/\b(TO|PO|CO|LO|IO|EO)(\d+)\b/i`
- Response includes:
  - Question ID and description
  - Dimension association
  - Current score and status
  - Professional interpretation for staff
- Handles invalid question IDs with helpful error message

**Code Location**: `FloatingChatbot.tsx` lines 1211-1282

### 10.2 Dimension-Specific Queries
**Objective**: Provide detailed information about specific dimensions.

**Implementation**:
- Pattern matching for dimension names
- Response includes:
  - Dimension score and percentage
  - Status category (Excellent/Good/Needs Improvement)
  - Dimension description
  - Professional recommendations for staff
- Supports all 6 dimensions with accurate data

**Code Location**: `FloatingChatbot.tsx` lines 1189-1209

### 10.3 Calculation Explanations
**Objective**: Explain how metrics are calculated.

**Implementation**:
- Comprehensive calculation guide:
  - Overall Index calculation
  - Percentage conversion
  - RehabServE Status thresholds
  - Dimension aggregation method
  - Question-level averaging
  - Trend calculation
  - Response rate formula
- Professional terminology and detailed explanations for staff

**Code Location**: `FloatingChatbot.tsx` lines 1069-1081

---

## Step 11: User Interaction Management

### 11.1 Keyboard Navigation
**Objective**: Implement keyboard shortcuts for accessibility.

**Implementation**:
- Enter key: Send message (when not shift)
- Escape key: Close chat when open
- Auto-focus: Input field when chat opens
- Tab navigation: Proper focus order
- ARIA labels: Screen reader support

**Code Location**: `FloatingChatbot.tsx` lines 526-550, 1449-1454, 1866-1876

### 11.2 Message Handling
**Objective**: Manage message flow and user interactions.

**Implementation**:
- `handleSendMessage()`:
  - Validates input (non-empty)
  - Stops ongoing speech
  - Creates user message object
  - Triggers bot response with delay
  - Manages typing indicator
  - Handles suggestions visibility
- `handleSuggestionClick()`:
  - Directly sends suggested question
  - Bypasses input field
  - Maintains conversation flow

**Code Location**: `FloatingChatbot.tsx` lines 186-219, 1408-1447

### 11.3 Chat State Management
**Objective**: Control chat open/close and minimize states.

**Implementation**:
- `handleToggleChat()`: Opens/closes chat
- `handleClose()`: Closes chat and cleans up:
  - Stops speech synthesis
  - Pauses audio playback
  - Resets states
  - Clears timeouts
- State persistence: Messages maintained during minimize

**Code Location**: `FloatingChatbot.tsx` lines 108, 1456-1481

---

## Step 12: Integration with Main Application

### 12.1 Component Integration
**Objective**: Integrate RehabBot into main dashboard application.

**Implementation**:
- Added `FloatingChatbot` component to `App.tsx`
- Positioned outside main content for proper z-index
- Passed required props:
  - KPI data from state
  - Processed dashboard data
  - Filter context
  - Options arrays
  - Dimension mappings
- Role prop passed from sidebar selection

**Code Location**: `App.tsx` lines 968-976

### 12.2 Data Flow
**Objective**: Ensure real-time data updates reach chatbot.

**Implementation**:
- Chatbot receives props from parent component
- Props update automatically when:
  - New data fetched from Google Sheets
  - PDK filter changes
  - Dashboard data processed
- React re-renders ensure chatbot has latest data
- No additional data fetching in chatbot component

**Code Location**: `App.tsx` lines 388-708, 968-976

### 12.3 Staff-Focused Design
**Objective**: Ensure chatbot is optimized for staff users.

**Implementation**:
- Default role: 'Staff' (only role supported)
- Staff-focused features:
  - Professional suggested questions
  - Technical response language
  - Detailed metrics and terminology
  - Comprehensive analysis and recommendations

**Code Location**: `App.tsx` line 976, `FloatingChatbot.tsx` lines 106, 128-183

---

## Step 13: Error Handling and Edge Cases

### 13.1 Data Validation
**Objective**: Handle missing or invalid data gracefully.

**Implementation**:
- Checks for data availability before generating responses
- Provides helpful error messages:
  - "I do not currently have access to performance data..."
  - "Dimension data is not currently available..."
  - "Trend data is not currently available..."
- Graceful degradation when data incomplete

**Code Location**: `FloatingChatbot.tsx` lines 753-760, 843-849, 891-894

### 13.2 Speech Error Handling
**Objective**: Handle TTS failures gracefully.

**Implementation**:
- Feature detection for browser speech synthesis support
- Error logging for debugging
- Graceful degradation (continues without speech if TTS unavailable)
- Speech synthesis error handlers
- Console warnings for unsupported browsers

**Code Location**: `FloatingChatbot.tsx` lines 328-332, 389-394

### 13.3 Browser Compatibility
**Objective**: Ensure functionality across different browsers.

**Implementation**:
- Feature detection for speech synthesis
- Polyfills for older browsers
- Video autoplay handling
- Mobile browser considerations (playsInline)
- Popup blocker handling for PDF export

**Code Location**: `FloatingChatbot.tsx` lines 328-332, 1601-1617

---

## Step 14: Testing and Refinement

### 14.1 Functional Testing
**Objective**: Verify all chatbot features work correctly.

**Testing Scenarios**:
- Staff-focused response generation
- Pattern matching accuracy
- Data integration correctness
- Browser speech synthesis functionality
- Avatar state transitions
- Suggested questions display
- Message flow and scrolling
- Keyboard shortcuts
- Error handling

### 14.2 User Experience Testing
**Objective**: Ensure intuitive and pleasant user experience.

**Testing Areas**:
- Response time and typing indicators
- Visual design and animations
- Accessibility (keyboard navigation, screen readers)
- Mobile responsiveness
- Voice quality and clarity
- Avatar animations smoothness

### 14.3 Performance Optimization
**Objective**: Ensure efficient rendering and updates.

**Optimizations**:
- `useCallback` for speech functions
- Memoized response generation
- Efficient state updates
- Minimal re-renders
- Optimized video loading
- Cleanup on unmount

**Code Location**: `FloatingChatbot.tsx` lines 223, 308, 425-433

---

## Step 15: Documentation and Maintenance

### 15.1 Code Documentation
**Objective**: Maintain clear, documented codebase.

**Documentation**:
- TypeScript interfaces for type safety
- Inline comments for complex logic
- Function documentation
- Component prop descriptions

### 15.2 User Documentation
**Objective**: Provide guidance for end users.

**Documentation Needs**:
- How to interact with chatbot
- Available query types
- Role differences
- Voice feature usage
- Troubleshooting common issues

---

## Technical Specifications

### Component Dependencies
- React 18+ for component framework
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
- Browser Speech Synthesis API (Web Speech API) for text-to-speech

### Data Flow Architecture
```
Dashboard Data → FloatingChatbot Props → 
State Management → Intent Recognition → 
Response Generation → Professional Formatting → 
Text-to-Speech → Avatar Animation → User Display
```

### Key Algorithms

1. **Intent Recognition Algorithm**:
   ```
   FOR each pattern in priority order:
     IF userMessage matches pattern:
       Extract intent category
       Generate professional response for staff
       Format with technical terminology
       Return response
   ```

2. **Response Generation Algorithm**:
   ```
   FOR Staff users:
     Use technical terminology
     Include detailed metrics
     Provide professional recommendations
     Include calculation methodologies
     Offer strategic insights
   ```

3. **Avatar State Management**:
   ```
   IF isSpeaking:
     state = 'talking'
   ELSE IF isTyping:
     state = 'talking'
   ELSE IF inputValue.length > 0:
     state = 'listening'
   ELSE IF lastMessage from bot:
     state = 'success' (briefly)
   ELSE:
     state = 'idle'
   ```

---

## Conclusion

RehabBot represents a comprehensive conversational AI solution for making rehabilitation analytics accessible to staff members. The development process involved systematic implementation of natural language understanding, professional analytics insights, browser-based voice synthesis, and intuitive UI/UX design. The result is an intelligent assistant that bridges the gap between complex data analytics and user-friendly interactions, enabling evidence-based decision-making for rehabilitation center staff.

The chatbot successfully integrates with the dashboard's real-time data pipeline, providing contextual insights, detailed explanations, and professional recommendations tailored for staff users. Through continuous refinement and testing, RehabBot has become an essential tool for understanding and acting on rehabilitation service excellence metrics, supporting staff in making informed decisions based on comprehensive performance data.


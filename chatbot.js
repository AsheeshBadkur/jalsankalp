class ChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiEndpoint = '/api/generate';
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
    }

    createChatWidget() {
        // Create main chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chatbot-container';
        chatContainer.className = 'fixed bottom-4 right-4 z-50 font-sans';
        
        chatContainer.innerHTML = `
            <!-- Chat Button -->
            <div id="chat-toggle" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 mb-4">
                <svg id="chat-icon" class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <svg id="close-icon" class="w-6 h-6 hidden transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>

            <!-- Chat Window -->
            <div id="chat-window" class="hidden bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden transform transition-all duration-300 scale-95 opacity-0">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-sm">AI Assistant</h3>
                            <div class="flex items-center space-x-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span class="text-xs opacity-90">Online</span>
                            </div>
                        </div>
                    </div>
                    <button id="minimize-chat" class="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>

                <!-- Messages Area -->
                <div id="messages-container" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    <!-- Welcome Message -->
                    <div class="flex items-start space-x-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                            </svg>
                        </div>
                        <div class="bg-white rounded-lg p-3 shadow-sm border max-w-xs">
                            <p class="text-sm text-gray-700">Hi! I'm your AI assistant. How can I help you with rainwater harvesting?</p>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="border-t border-gray-200 p-4 bg-white">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="message-input" 
                            placeholder="Ask about rainwater harvesting..." 
                            class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            maxlength="500"
                        >
                        <button 
                            id="send-button" 
                            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs text-gray-500">Press Enter to send</span>
                        <span id="char-counter" class="text-xs text-gray-400">0/500</span>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div id="typing-indicator" class="hidden border-t border-gray-200 p-4 bg-gray-50">
                    <div class="flex items-center space-x-2">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                        <span class="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatContainer);
    }

    attachEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const minimizeChat = document.getElementById('minimize-chat');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const charCounter = document.getElementById('char-counter');

        // Toggle chat window
        chatToggle.addEventListener('click', () => this.toggleChat());
        minimizeChat.addEventListener('click', () => this.toggleChat());

        // Input handling
        messageInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCounter.textContent = `${length}/500`;
            sendButton.disabled = length === 0;
            
            if (length > 450) {
                charCounter.classList.add('text-red-500');
                charCounter.classList.remove('text-gray-400');
            } else {
                charCounter.classList.remove('text-red-500');
                charCounter.classList.add('text-gray-400');
            }
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !sendButton.disabled) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendButton.addEventListener('click', () => this.sendMessage());
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');
        const messageInput = document.getElementById('message-input');

        if (this.isOpen) {
            // Close chat
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
            
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            // Open chat
            chatWindow.classList.remove('hidden');
            setTimeout(() => {
                chatWindow.classList.remove('scale-95', 'opacity-0');
                chatWindow.classList.add('scale-100', 'opacity-100');
            }, 10);
            
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            
            // Focus input after animation
            setTimeout(() => {
                messageInput.focus();
            }, 350);
        }

        this.isOpen = !this.isOpen;
    }

    async sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        messageInput.value = '';
        document.getElementById('char-counter').textContent = '0/500';
        document.getElementById('send-button').disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Make API call to your Express server
            const response = await fetch("http://localhost:8080/api/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: message })
            });

            const data = await response.json();

            // Hide typing indicator
            this.hideTypingIndicator();

            if (response.ok && data.success) {
                // Add bot response
                this.addMessage(data.response, 'bot');
            } else {
                // Handle error
                const errorMessage = data.error || 'Sorry, I encountered an error. Please try again.';
                this.addMessage(errorMessage, 'bot', true);
            }
        } catch (error) {
            console.error('Chat API Error:', error);
            this.hideTypingIndicator();
            this.addMessage(`Sorry, I'm having trouble connecting right now. Please check your connection and try again.', 'bot', true`);
        }
    }

    addMessage(text, sender, isError = false) {
        const messagesContainer = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-end justify-end space-x-2">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3 max-w-xs">
                        <p class="text-sm">${this.escapeHtml(text)}</p>
                        <span class="text-xs opacity-75 block mt-1">${this.getCurrentTime()}</span>
                    </div>
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            `;
        } else {
            const bgColor = isError ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200';
            const textColor = isError ? 'text-red-700' : 'text-gray-700';
            
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                    </div>
                    <div class="${bgColor} rounded-lg p-3 shadow-sm border max-w-xs">
                        <p class="text-sm ${textColor}">${this.formatMessage(text)}</p>
                        <span class="text-xs opacity-75 block mt-1 ${textColor}">${this.getCurrentTime()}</span>
                    </div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom with smooth animation
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);

        // Store message
        this.messages.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString(),
            isError: isError
        });
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('messages-container');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessage(text) {
        // Simple formatting for bot messages
        return this.escapeHtml(text)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>');
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Additional utility methods
    sendProgrammaticMessage(message) {
        if (typeof message === 'string' && message.trim()) {
            document.getElementById('message-input').value = message.trim();
            this.sendMessage();
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = `
            <div class="flex items-start space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                </div>
                <div class="bg-white rounded-lg p-3 shadow-sm border max-w-xs">
                    <p class="text-sm text-gray-700">Hi! I'm your AI assistant. How can I help you with rainwater harvesting?</p>
                </div>
            </div>
        `;
        this.messages = [];
    }

    updateApiEndpoint(newEndpoint) {
        this.apiEndpoint = newEndpoint;
        console.log('API endpoint updated to:', newEndpoint);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Tailwind CSS is loaded
    const tailwindCheck = document.createElement('div');
    tailwindCheck.className = 'hidden';
    document.body.appendChild(tailwindCheck);
    const isHidden = window.getComputedStyle(tailwindCheck).display === 'none';
    document.body.removeChild(tailwindCheck);
    
    if (!isHidden) {
        console.warn('Tailwind CSS may not be loaded. The chatbot might not display correctly.');
    }
    
    // Initialize the chatbot
    try {
        window.chatBot = new ChatBot();
        console.log('AI Chatbot initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize chatbot:', error);
    }
});

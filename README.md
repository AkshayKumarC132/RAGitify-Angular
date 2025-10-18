# RAGitify - Angular 17 Frontend

A comprehensive end-to-end UI built with **Angular 17 standalone components** for the RAGitify project, featuring a modern chatbot-style interface similar to OpenAI and Grok.

## 🚀 Features

### Core Functionality
- **Authentication System**: Login and registration with JWT token management
- **Chat Interface**: Modern chatbot UI with real-time messaging
- **Document Management**: Upload and manage documents  
- **Vector Store Management**: Create and manage vector stores
- **Assistant Configuration**: Configure AI assistants with custom settings
- **Settings Panel**: Manage API keys and user preferences

### Technical Highlights
- ✅ **Angular 17** with Standalone Components
- ✅ **Tailwind CSS** for modern, responsive UI
- ✅ **RxJS** for reactive programming
- ✅ **HTTP Interceptors** for automatic token injection
- ✅ **Route Guards** for protected routes
- ✅ **TypeScript** for type safety

## 🌐 Environment Configuration

API URL is configured in:
- Development: `src/environments/environment.ts` → `http://localhost:8001/api`
- Production: `src/environments/environment.prod.ts` → `/api`

## 🚀 Running the Application

```bash
# Start all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# Access URLs
# Frontend: http://localhost:3000
# Backend: http://localhost:8001/api
```

## 📝 API Integration

All endpoints from the provided serializers and URLs are fully integrated with Angular services.

---

**Built with Angular 17 + Standalone Components + Tailwind CSS**

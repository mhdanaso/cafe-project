# Rivera Coffee

Rivera Coffee is a React/Vite cafe website with a small FastAPI backend for
contact form submissions.

## Run locally

Install the frontend dependencies:

```powershell
npm install
```

Start the backend from the project root:

```powershell
.\backend\.venv\Scripts\python.exe -m uvicorn main:app --reload --app-dir backend
```

In another terminal, start the frontend:

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173` and sends contact form requests
to `http://localhost:8000/api/contact`.

To use a different backend URL, create a `.env` file in the project root:

```env
VITE_API_URL=https://api.example.com
```

## Useful commands

```powershell
npm run lint
npm run build
```

The backend health endpoint is available at `http://localhost:8000/health`.

import { createRoot } from 'react-dom/client'
import MastermindApp from './MastermindApp.tsx'
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById('root')!).render(
    <MastermindApp />
)

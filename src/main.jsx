import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import App from './App';

// Register GSAP plugins globally once
gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger defaults
ScrollTrigger.config({
  ignoreMobileResize: true,
});

createRoot(document.getElementById('root')).render(<App />);
